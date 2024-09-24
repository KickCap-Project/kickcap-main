import requests
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import cv2
import numpy as np
import os
import easyocr
import re
import redis
import pytz
from datetime import datetime, timedelta
import psycopg2
from dotenv import load_dotenv

"""
실행 명령어:
uvicorn license_plate_api:app --reload

POST: http://localhost:8000/ocr
(JSON)
{
    "camera_idx": 1,
    "file_path": "C://Users//roista//Desktop//SSAFY//OCR//image2//license_plate_18.jpg",
    "type": 1,
    "time": "20230101123045000"
}

>> redis 에서는 "camera1_번호판 번호" 형태의 키로 저장 (TTL은 1분)

- DB에 저장하는 코드 추가해야 됨
- OCR 정확도 확인 필요
-- 파라미터 조정
-- 추출한 이미지 내의 사각형을 확인 후 평면으로 만드는 작업
-- 번호판의 형태 및 폰트 변경
"""

app = FastAPI()

KST = pytz.timezone('Asia/Seoul')

# OCR을 위한 Reader 객체 생성 (영어 지원)
reader = easyocr.Reader(['en'])

# Redis 클라이언트 설정
redis_client = redis.Redis(host='localhost', port=5555, db=0)

# .env 파일에서 환경 변수 로드
load_dotenv()

# 환경 변수에서 DB 연결 정보 가져오기
db_name = os.getenv("DB_NAME")
db_user = os.getenv("DB_USER")
db_password = os.getenv("DB_PASSWORD")
db_host = os.getenv("DB_HOST")
db_port = os.getenv("DB_PORT")


# 파일을 서버로 업로드하는 함수
def upload_image(image_buffer, file_name):
    url = "https://j11b102.p.ssafy.io/image/upload/result"  # Postman에서 사용한 URL
    # 메모리 버퍼를 바이너리로 전송
    files = {'image': (f'{file_name}', image_buffer.tobytes(), 'image/jpeg')}
    response = requests.post(url, files=files)  # POST 요청 보내기
    print(response.text)  # 서버 응답 내용 출력
    return f'{url}/{response.text}'


class OCRRequests(BaseModel):
    camera_idx: int
    file_name: str
    type: int
    time: str



@app.post("/ocr")
def ocr_endpoint(request: OCRRequests):
    # Redis에서 기존에 처리된 요청인지 확인

    path = f'https://j11b102.p.ssafy.io/image/camera/{request.file_name}'
    req = requests.get(path)
    print(req.status_code)

    # 1. 이미지 읽기 및 그레이스케일 변환
    # img = cv2.imread(file_path)

    # 이미지 데이터를 numpy 배열로 변환
    image_array = np.frombuffer(req.content, np.uint8)
    img = cv2.imdecode(image_array, cv2.IMREAD_COLOR)

    if img is None:
        raise HTTPException(status_code=404, detail="Image Not Found")

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # 2. 가우시안 블러 적용
    blur = cv2.GaussianBlur(gray, (5, 5), 0)

    # 3. 적응형 이진화 적용
    thresh = cv2.adaptiveThreshold(
        blur, 255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY_INV,
        15, 2
    )

    # 4. 컨투어 찾기
    contours, _ = cv2.findContours(
        thresh,
        mode=cv2.RETR_LIST,
        method=cv2.CHAIN_APPROX_SIMPLE
    )

    height, width = gray.shape
    temp_result = np.zeros((height, width, 3), dtype=np.uint8)

    contours_dict = []

    for contour in contours:
        x, y, w, h = cv2.boundingRect(contour)
        contours_dict.append({
            'contour': contour,
            'x': x,
            'y': y,
            'w': w,
            'h': h,
            'cx': x + (w / 2),
            'cy': y + (h / 2)
        })

    # 필터링된 컨투어 저장
    MIN_AREA = 80
    MIN_WIDTH, MIN_HEIGHT = 2, 8
    MIN_RATIO, MAX_RATIO = 0.2, 2.0

    possible_contours = []
    cnt = 0
    for d in contours_dict:
        area = d['w'] * d['h']
        ratio = d['w'] / d['h']

        if area > MIN_AREA \
                and d['w'] > MIN_WIDTH and d['h'] > MIN_HEIGHT \
                and MIN_RATIO < ratio < MAX_RATIO:
            d['idx'] = cnt
            cnt += 1
            possible_contours.append(d)
    
    # 컨투어 매칭
    # TODO: 파라미터 조정 필요
    MAX_DIAG_MULTIPLYER = 4  # 4
    MAX_ANGLE_DIFF = 45.0  # 15.0 45.0
    MAX_AREA_DIFF = 1.0  # 0.5 2.0 1.0
    MAX_WIDTH_DIFF = 0.8  # 0.8
    MAX_HEIGHT_DIFF = 0.2  # 0.2
    MIN_N_MATCHED = 4  # 4

    def find_chars(contour_list):
        matched_result_idx = []

        for d1 in contour_list:
            matched_contours_idx = []
            for d2 in contour_list:
                if d1['idx'] == d2['idx']:
                    continue

                dx = abs(d1['cx'] - d2['cx'])
                dy = abs(d1['cy'] - d2['cy'])

                diagonal_length1 = np.sqrt(d1['w'] ** 2 + d1['h'] ** 2)

                distance = np.linalg.norm(
                    np.array([d1['cx'], d1['cy']]) - np.array([d2['cx'], d2['cy']])
                )

                if dx == 0:
                    angle_diff = 90
                else:
                    angle_diff = np.degrees(np.arctan(dy / dx))

                area_diff = abs(d1['w'] * d1['h'] - d2['w'] * d2['h']) / (d1['w'] * d1['h'])
                width_diff = abs(d1['w'] - d2['w']) / d1['w']
                height_diff = abs(d1['h'] - d2['h']) / d1['h']

                if distance < diagonal_length1 * MAX_DIAG_MULTIPLYER \
                        and angle_diff < MAX_ANGLE_DIFF and area_diff < MAX_AREA_DIFF \
                        and width_diff < MAX_WIDTH_DIFF and height_diff < MAX_HEIGHT_DIFF:
                    matched_contours_idx.append(d2['idx'])

            matched_contours_idx.append(d1['idx'])

            if len(matched_contours_idx) < MIN_N_MATCHED:
                continue

            matched_result_idx.append(matched_contours_idx)

            unmatched_contour_idx = []
            for d4 in contour_list:
                if d4['idx'] not in matched_contours_idx:
                    unmatched_contour_idx.append(d4['idx'])

            unmatched_contour = np.take(possible_contours, unmatched_contour_idx)

            recursive_contour_list = find_chars(unmatched_contour)

            for idx in recursive_contour_list:
                matched_result_idx.append(idx)

            break

        return matched_result_idx

    result_idx = find_chars(possible_contours)

    matched_result = []
    for idx_list in result_idx:
        matched_result.append(np.take(possible_contours, idx_list))

    # TODO: 파라미터 조정 필요
    PLATE_WIDTH_PADDING = 1.4  # 1.3
    PLATE_HEIGHT_PADDING = 4.0  # 1.5
    MIN_PLATE_RATIO = 1
    MAX_PLATE_RATIO = 50

    plate_imgs = []
    plate_infos = []

    for i, matched_chars in enumerate(matched_result):
        sorted_chars = sorted(matched_chars, key=lambda x: x['cx'])

        plate_cx = (sorted_chars[0]['cx'] + sorted_chars[-1]['cx']) / 2
        plate_cy = (sorted_chars[0]['cy'] + sorted_chars[-1]['cy']) / 2

        plate_width = (sorted_chars[-1]['x'] + sorted_chars[-1]['w'] - sorted_chars[0]['x']) * PLATE_WIDTH_PADDING

        sum_height = 0
        for d in sorted_chars:
            sum_height += d['h']

        plate_height = int(sum_height / len(sorted_chars) * PLATE_HEIGHT_PADDING)

        triangle_height = sorted_chars[-1]['cy'] - sorted_chars[0]['cy']
        triangle_hypotenus = np.linalg.norm(
            np.array([sorted_chars[0]['cx'], sorted_chars[0]['cy']]) -
            np.array([sorted_chars[-1]['cx'], sorted_chars[-1]['cy']])
        )

        angle = np.degrees(np.arcsin(triangle_height / triangle_hypotenus))

        rotation_matrix = cv2.getRotationMatrix2D(center=(plate_cx, plate_cy), angle=angle, scale=1.0)

        img_rotated = cv2.warpAffine(thresh, M=rotation_matrix, dsize=(width, height))

        img_cropped = cv2.getRectSubPix(
            img,
            patchSize=(int(plate_width), int(plate_height)),
            center=(int(plate_cx), int(plate_cy))
        )

        if img_cropped.shape[1] / img_cropped.shape[0] < MIN_PLATE_RATIO or img_cropped.shape[1] / img_cropped.shape[
            0] < MIN_PLATE_RATIO > MAX_PLATE_RATIO:
            continue

        plate_imgs.append(img_cropped)
        plate_infos.append({
            'x': int(plate_cx - plate_width / 2),
            'y': int(plate_cy - plate_height / 2),
            'w': int(plate_width),
            'h': int(plate_height)
        })

    # 결과 저장 및 OCR 수행
    result_text = ''
    ocr_img_src = ''
    image_encoded = ''
    for i, plate_img in enumerate(plate_imgs):
        # OCR 수행
        result = reader.readtext(plate_img)

        # 결과 처리
        # TODO: 정규표현식으로 인식된 번호판만 처리 필요
        for bbox, text, conf in result:
            # 정규표현식을 사용하여 숫자와 영어만 추출
            text = re.sub(r'[^A-Za-z0-9]', '', text)
            # 영어 1자와 숫자 4개로 구성된 경우에만 통과
            # if re.fullmatch(r'[A-Za-z]{1}[0-9]{4}', text):
            if re.fullmatch(r'[0-9]{4}', text):
                result_text = text
                break

        if result_text:
            # cv2.imwrite(preprocessed_image_path, plate_img)
            # 이미지를 메모리 버퍼로 인코딩 (JPEG 포맷으로 인코딩)
            _, image_encoded = cv2.imencode('.jpg', plate_img)
            break

    if result_text:
        # 현재 시간 (한국 시간)
        now_kst = datetime.now(KST)

        # TTL 설정을 위한 만료 시간 계산
        expire_time = now_kst + timedelta(minutes=1)
        expire_seconds = int((expire_time - now_kst).total_seconds())

        # Redis에 키 저장 및 TTL 설정
        key = f"{request.camera_idx}_{request.type}_{result_text}"

        print(key)
        if redis_client.exists(key):
            print(redis_client.ttl(key))
            raise HTTPException(status_code=200, detail=f"Duplicate License Plate {redis_client.ttl(key)}")

        # 데이터베이스 연결
        crackdown_time = ''
        accused_idx = ''
        try:
            connection = psycopg2.connect(
                dbname=db_name,
                user=db_user,
                password=db_password,
                host=db_host,
                port=db_port
            )
            cursor = connection.cursor()

            crackdown_time = KST.localize(datetime.strptime(request.time, "%Y%m%d%H%M%S%f"))

            # 킥보드를 이용한 사람을 업체를 통해 찾음
            select_query = '''
            SELECT name, phone
            FROM gcooter
            WHERE %s BETWEEN start_time AND end_time;
            '''

            cursor.execute(select_query, (now_kst, ))
            results = cursor.fetchall()
            if not results:
                raise HTTPException(status_code=404, detail="Gcooter Not Found")
            # print(results)

            # 킥보드를 이용한 member를 찾음
            select_query = '''
            SELECT idx
            FROM member
            WHERE name = %s AND phone = %s;
            '''
            name, phone = results[0]
            cursor.execute(select_query, (name, phone, ))
            results = cursor.fetchall()
            if not results:
                raise HTTPException(status_code=404, detail="Memeber Not Found")
            accused_idx = results[0]
            # print(results)

            # # CCTV 신고에 데이터 추가
            insert_query = '''
            INSERT INTO crackdown (cctv_idx, accused_idx, violation_type, image_src, crackdown_time, created_at)
            VALUES (%s, %s, %s, %s, %s, %s)
            '''
            data = (request.camera_idx, accused_idx[0], request.type, path, crackdown_time, now_kst)
            cursor.execute(insert_query, data)
            connection.commit()
            # print("DB에 저장 완료")

        except HTTPException as http_exc:
            raise http_exc  # HTTPException을 그대로 재발생시켜 FastAPI가 처리하도록 합니다.

        except Exception as error:
            print(f"에러 발생: {error}")
            raise HTTPException(status_code=500, detail="DataBase Error")  # 데이터베이스 예외 처리

        finally:
            if connection:
                cursor.close()
                connection.close()
                # print("PostgreSQL 연결이 닫혔습니다.")

        redis_client.setex(key, expire_seconds, 'processed')

        # 인코딩된 이미지를 업로드
        ocr_img_src = upload_image(image_encoded, 'image')
        return {
            'cctv_idx': request.camera_idx,
            'accused_idx': accused_idx[0],
            'type': request.type,
            'image_src': path,
            'ocr_img_src': ocr_img_src,
            'crackdown_time': crackdown_time,
            'created_at': now_kst,
            'result': result_text
        }
    else:
        raise HTTPException(status_code=404, detail="OCR Not Found")