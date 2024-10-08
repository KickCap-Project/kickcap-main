from fastapi.responses import Response
from ultralytics import YOLO
import datetime
import requests
from pydantic import BaseModel
import cv2
import numpy as np
import easyocr
import re
import pytz
from datetime import datetime, timedelta
from dotenv import load_dotenv
from fastapi import FastAPI, File, UploadFile, HTTPException
import os
import httpx
import time  # 시간 측정을 위한 모듈 추가

os.environ["CUDA_DEVICE_ORDER"] = "PCI_BUS_ID"
os.environ["CUDA_VISIBLE_DEVICES"] = "8"

# YOLO 모델 로드
model = YOLO('runs/detect/train3/weights/best.pt')

def upload_image(image_buffer, file_name, type):
    url = f"https://j11b102.p.ssafy.io/image/upload/{type}"
    files = {'image': (f'{file_name}.jpg', image_buffer.tobytes(), 'image/jpeg')}
    response = requests.post(url, files=files)
    return f'{url}/{response.text}'


def upload_image2(image_buffer, file_name, type):
    url = f"https://j11b102.p.ssafy.io/image/upload/{type}"
    files = {'image': (f'{file_name}.jpg', image_buffer.tobytes(), 'image/jpeg')}
    response = requests.post(url, files=files)
    return f'{url}/{response.text}'


# FastAPI 앱 생성
app = FastAPI()

KST = pytz.timezone('Asia/Seoul')

reader = easyocr.Reader(['en'])

class OCRRequests(BaseModel):
    camera_idx: int
    file_name: str
    type: int
    time: str

# 킥보드의 유형에 따라 서버에 이미지를 저장
@app.post("/detect")
async def detect(image_file: UploadFile = File(...)):
    # 업로드된 파일에서 이미지 읽기
    contents = await image_file.read()
    nparr = np.frombuffer(contents, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    if image is not None:
        results = model.predict(source=image, conf=0.5)

        annotated_frame = image.copy()

        for result in results:
            boxes = result.boxes  # 바운딩 박스 객체
            if boxes:
                for box in boxes:
                    x1, y1, x2, y2 = map(int, box.xyxy[0])
                    class_label = box.cls.item()
                    class_name = model.names[class_label]

                    if class_name == "Scooter":
                        # 전체 이미지에 사각형 그리기
                        cv2.rectangle(annotated_frame, (x1, y1), (x2, y2), (255, 0, 0), 3)

                    if class_name == "Scooter_No_Helmet":
                        # 전체 이미지에 사각형 그리기
                        cv2.rectangle(annotated_frame, (x1, y1), (x2, y2), (255, 255, 0), 3)
                        current_time_str = datetime.datetime.now().strftime("%Y%m%d%H%M%S%f")
                        full_image_filename = f'./Scooter_No_Helmet/{current_time_str}_1.jpg'

                        _, image_encoded = cv2.imencode('.jpg', annotated_frame)
                        upload_image(image_encoded, full_image_filename)

                        roi = image[y1:y2, x1:x2]
                        roi_filename = f'./Scooter_No_Helmet/{current_time_str}_2.jpg'
                        _, image_encoded = cv2.imencode('.jpg', roi)
                        upload_image(image_encoded, roi_filename)

                    if class_name == "Scooter_Two":
                        # 전체 이미지에 사각형 그리기
                        cv2.rectangle(annotated_frame, (x1, y1), (x2, y2), (255, 255, 255), 3)
                        current_time_str = datetime.datetime.now().strftime("%Y%m%d%H%M%S%f")
                        full_image_filename = f'./Scooter_Two/{current_time_str}_1.jpg'

                        _, image_encoded = cv2.imencode('.jpg', annotated_frame)
                        upload_image(image_encoded, full_image_filename)

                        roi = image[y1:y2, x1:x2]
                        roi_filename = f'./Scooter_Two/{current_time_str}_2.jpg'
                        _, image_encoded = cv2.imencode('.jpg', roi)
                        upload_image(image_encoded, roi_filename)

        _, buffer = cv2.imencode('.jpg', annotated_frame)
        return Response(content=buffer.tobytes(), media_type="image/jpeg")


# 킥보드의 유형에 따라 서버에 이미지를 저장
@app.post("/preprocess")
async def ocr_endpoint(request: OCRRequests):
    path = f'https://j11b102.p.ssafy.io/image/camera/{request.file_name}'
    # print('시작')

    total_start_time = time.time()  # 전체 처리 시간 측정 시작

    # 비동기적으로 외부 API 호출
    start_time = time.time()
    async with httpx.AsyncClient() as client:
        req = await client.get(path)
    end_time = time.time()
    # print(f"이미지 다운로드 시간: {end_time - start_time:.4f}초")

    # 이미지 데이터를 numpy 배열로 변환
    start_time = time.time()
    image_array = np.frombuffer(req.content, np.uint8)
    img = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
    end_time = time.time()
    # print(f"이미지 디코딩 시간: {end_time - start_time:.4f}초")

    if img is None:
        raise HTTPException(status_code=404, detail="Image Not Found")

    # 이미지 전처리 시작
    start_time = time.time()
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # 가우시안 블러 적용
    blur = cv2.GaussianBlur(gray, (5, 5), 0)

    # 적응형 이진화 적용
    thresh = cv2.adaptiveThreshold(
        blur, 255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY_INV,
        15, 2
    )
    end_time = time.time()
    # print(f"이미지 전처리 시간: {end_time - start_time:.4f}초")

    # 컨투어 찾기
    start_time = time.time()
    contours, _ = cv2.findContours(
        thresh,
        mode=cv2.RETR_LIST,
        method=cv2.CHAIN_APPROX_SIMPLE
    )
    end_time = time.time()
    # print(f"컨투어 찾기 시간: {end_time - start_time:.4f}초")

    # 컨투어 데이터 준비
    start_time = time.time()
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
    end_time = time.time()
    # print(f"컨투어 데이터 준비 시간: {end_time - start_time:.4f}초")

    # 가능한 컨투어 필터링
    start_time = time.time()
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
    end_time = time.time()
    # print(f"가능한 컨투어 필터링 시간: {end_time - start_time:.4f}초")

    # 컨투어 매칭
    start_time = time.time()
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
    end_time = time.time()
    # print(f"컨투어 매칭 시간: {end_time - start_time:.4f}초")

    # 매칭 결과 처리
    start_time = time.time()
    matched_result = []
    for idx_list in result_idx:
        matched_result.append(np.take(possible_contours, idx_list))
    end_time = time.time()
    # print(f"매칭 결과 처리 시간: {end_time - start_time:.4f}초")

    # 번호판 후보 이미지 추출
    start_time = time.time()
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

        if img_cropped.shape[1] / img_cropped.shape[0] < MIN_PLATE_RATIO or img_cropped.shape[1] / img_cropped.shape[0] > MAX_PLATE_RATIO:
            continue

        plate_imgs.append(img_cropped)
        plate_infos.append({
            'x': int(plate_cx - plate_width / 2),
            'y': int(plate_cy - plate_height / 2),
            'w': int(plate_width),
            'h': int(plate_height)
        })
    end_time = time.time()
    # print(f"번호판 후보 이미지 추출 시간: {end_time - start_time:.4f}초")

    # print(f"OCR 시작 전 번호판 후보 개수: {len(plate_imgs)}")

    # OCR 수행
    start_time = time.time()
    for i, plate_img in enumerate(plate_imgs):
        result = reader.readtext(plate_img)

        # 영어 1자와 숫자 4개로 구성된 경우에만 통과
        for bbox, text, conf in result:
            text = re.sub(r'[^A-Za-z0-9]', '', text)
            # print(f"OCR 결과: {text}")
            if re.fullmatch(r'[A-Za-z]{1}[0-9]{4}', text):
                result_text = text
                _, image_encoded = cv2.imencode('.jpg', plate_img)
                ocr_img_src = upload_image2(image_encoded, 'image', 'result')
                ocr_img_src = ocr_img_src.replace('/upload', '')

                end_time = time.time()
                # print(f"OCR 처리 시간: {end_time - start_time:.4f}초")

                total_end_time = time.time()
                # print(f"전체 처리 시간: {total_end_time - total_start_time:.4f}초")

                return {
                    'image_src': path,
                    'ocr_img_src': ocr_img_src,
                    'result_text': result_text
                }
    else:
        end_time = time.time()
        # print(f"OCR 처리 시간: {end_time - start_time:.4f}초")

        total_end_time = time.time()
        print(f"전체 처리 시간: {total_end_time - total_start_time:.4f}초")
        raise HTTPException(status_code=404, detail="OCR Not Found")