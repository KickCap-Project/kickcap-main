from fastapi import FastAPI
from pydantic import BaseModel
import cv2
import numpy as np
import os
import easyocr
import re
import redis
from datetime import datetime, timedelta

"""
실행 명령어:
uvicorn license_plate_api:app --reload

POST: http://localhost:8000/ocr
(JSON)
{
    "camera_name": "camera1",
    "file_path": "C://Users//roista//Desktop//SSAFY//OCR//image2//license_plate_18.jpg",
    "division": 1,
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

# OCR을 위한 Reader 객체 생성 (영어 지원)
reader = easyocr.Reader(['en'])

# Redis 클라이언트 설정
redis_client = redis.Redis(host='localhost', port=6379, db=0)


class OCRRequest(BaseModel):
    camera_name: str
    file_path: str
    division: int
    time: str


@app.post("/ocr")
def ocr_endpoint(request: OCRRequest):
    # Redis에서 기존에 처리된 요청인지 확인
    key = f"{request.camera_name}_{request.division}_{request.time}"

    # TODO: 처리 결과는 출력하지 않도록 수정 필요
    if redis_client.exists(key):
        return {'result': 'duplicate', 'message': '이미 처리된 요청입니다.'}

    # 1. 이미지 읽기 및 그레이스케일 변환
    img = cv2.imread(request.file_path)

    # TODO: 결과 값을 404와 같이 코드로 반환
    if img is None:
        return {'result': 'fail', 'message': '이미지를 찾을 수 없습니다.'}

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
    preprocessed_image_path = ''
    for i, plate_img in enumerate(plate_imgs):
        # 전처리 결과 이미지 저장
        file_name = f'{request.camera_name}_{request.division}_{request.time}_{i}'
        preprocessed_image_path = f'preprocessed/{file_name}.jpg'
        os.makedirs(os.path.dirname(preprocessed_image_path), exist_ok=True)


        # OCR 수행
        result = reader.readtext(plate_img)

        # 결과 처리
        # TODO: 정규표현식으로 인식된 번호판만 처리 필요
        for bbox, text, conf in result:
            # 정규표현식을 사용하여 숫자와 영어만 추출
            text = re.sub(r'[^A-Za-z0-9]', '', text)
            # 영어 1자와 숫자 4개로 구성된 경우에만 통과
            # if re.fullmatch(r'[A-Za-z]{1}[0-9]{4}', text):
            #     result_text = text
            #     break
            result_text = text
            if result_text:
                cv2.imwrite(preprocessed_image_path, plate_img)
                break

        if result_text:
            cv2.imwrite(preprocessed_image_path, plate_img)
            break

    # TODO: 처리 결과는 출력하지 않도록 수정 필요
    if result_text:
        # TTL 설정을 위한 만료 시간 계산
        expire_time = datetime.now() + timedelta(minutes=1)
        ttl_seconds = (expire_time - datetime.now()).total_seconds()
        ttl_seconds = max(0, int(ttl_seconds))  # 음수일 경우 0으로 설정

        # Redis에 키 저장 및 TTL 설정
        redis_key = f"{request.camera_name}_{result_text}"
        print(redis_key)
        redis_client.setex(redis_key, ttl_seconds, 'processed')

        return {
            'camera_name': request.camera_name,
            'file_path': request.file_path,
            'preprocessed_image_path': preprocessed_image_path,
            'division': request.division,
            'time': request.time,
            'result': result_text
        }
    else:
        return {
            'camera_name': request.camera_name,
            'file_path': request.file_path,
            'preprocessed_image_path': '',
            'division': request.division,
            'time': request.time,
            'result': 'fail'
        }
