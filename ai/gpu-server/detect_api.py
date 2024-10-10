import requests
from pydantic import BaseModel
import cv2
import numpy as np
import easyocr
import re
import pytz
from fastapi import FastAPI
import os
import httpx
import time
from queue import Queue
import threading
import concurrent.futures
from dotenv import load_dotenv

os.environ["CUDA_DEVICE_ORDER"] = "PCI_BUS_ID"
os.environ["CUDA_VISIBLE_DEVICES"] = "8"


def upload_image(image_buffer, file_name, type):
    url = f"https://j11b102.p.ssafy.io/image/upload/{type}"
    files = {'image': (f'{file_name}.jpg', image_buffer.tobytes(), 'image/jpeg')}
    response = requests.post(url, files=files)
    return f'{url}/{response.text}'


# FastAPI 앱 생성
app = FastAPI()

KST = pytz.timezone('Asia/Seoul')

reader = easyocr.Reader(['en'])

# 요청을 저장할 Queue 생성
request_queue = Queue()


class OCRRequests(BaseModel):
    camera_idx: int
    file_name: str
    type: int
    time: str


@app.post("/preprocess")
async def ocr_endpoint(request: OCRRequests):
    request_queue.put(request)
    return {'status': 'Request received and added to the queue'}


# TODO: 여기서 부터는 테스트용

# .env 구성 및 활게 변수 로드
# load_dotenv()

# API 키 설정
# client_id = os.getenv("CLIENT_ID")
# client_secret = os.getenv("CLIENT_SECRET")
# url = os.getenv("URL")

# def naver_ocr(request: OCRRequests):
#     path = f'https://j11b102.p.ssafy.io/image/camera/{request.file_name}'

#     # 이미지 다운로드
#     print('이미지 다운로드')
#     with httpx.Client() as client:
#         req = client.get(path)

#     # 이미지 데이터를 numpy 배열로 변환
#     image_array = np.frombuffer(req.content, np.uint8)
#     img = cv2.imdecode(image_array, cv2.IMREAD_COLOR)

#     # 이미지 데이터를 메모리에 저장하고 PNG 포맥으로 변환
#     secret_key = "WmpMWnhzTFhkZ25TVnBVWW9jUkJaU3p5VnlTbXBPYWY="
#     api_url = "https://hkma6t6ov5.apigw.ntruss.com/custom/v1/34940/ebbdfb6377abc1aa90ce13ae4f2fae47f39cef0bf281e51b4f5308599f730d85/general"

#     request_json = {
#         'images': [
#             {
#                 'format': 'jpg',
#                 'name': 'demo'
#             }
#         ],
#         'requestId': str(uuid.uuid4()),
#         'version': 'V2',
#         'timestamp': int(round(time.time() * 1000))
#     }

#     payload = {'message': json.dumps(request_json).encode('UTF-8')}
#     # 이미지를 메모리에서 바로 전송
#     _, img_encoded = cv2.imencode('.jpg', img)
#     files = [('file', ('image.jpg', img_encoded.tobytes(), 'image/jpeg'))]
#     headers = {'X-OCR-SECRET': secret_key}

#     # Make the OCR request
#     response = requests.request("POST", api_url, headers=headers, data=payload, files=files)

#     # Load the original image for visualization
#     highlighted_image = img.copy()

#     # OCR 응답 처리
#     if response.status_code == 200:
#         result_text = None
#         ocr_results = json.loads(response.text)
#         all_texts = []  # 모든 텍스트를 저장할 리스트
#         for image_result in ocr_results['images']:
#             for field in image_result['fields']:
#                 text = field['inferText']
#                 all_texts.append(text)  # 텍스트 추가

#                 # 텍스트 주변에 빨간 사각형 그리기
#                 bounding_box = field['boundingPoly']['vertices']
#                 start_point = (int(bounding_box[0]['x']), int(bounding_box[0]['y']))
#                 end_point = (int(bounding_box[2]['x']), int(bounding_box[2]['y']))
#                 cv2.rectangle(highlighted_image, start_point, end_point, (0, 0, 255), 2)

#                 print(text)
#                 if result_text is None:
#                     text = re.sub(r'[^A-Za-z0-9]', '', text)
#                     print(f"OCR 결과: {text}")
#                     if re.fullmatch(r'[A-Za-z]{1}[0-9]{4}', text):
#                         text = text.upper()
#                         result_text = text


#     print(f"OCR 결과를 받아오지 못했습니다. 상태 코드: {response.status_code}")
#     return "Not found"

def process_requests():
    while True:
        if not request_queue.empty():
            print(request_queue.qsize())
            request = request_queue.get()
            process_request(request)
            request_queue.task_done()
        else:
            time.sleep(1)


@app.on_event('startup')
def startup_event():
    threading.Thread(target=process_requests, daemon=True).start()


def process_request(request: OCRRequests):
    path = f'https://j11b102.p.ssafy.io/image/camera/{request.file_name}'

    total_start_time = time.time()  # 전체 처리 시간 측정 시작

    # 이미지 다운로드
    print('이미지 다운로드')
    with httpx.Client() as client:
        req = client.get(path)

    # 이미지 데이터를 numpy 배열로 변환
    image_array = np.frombuffer(req.content, np.uint8)
    img = cv2.imdecode(image_array, cv2.IMREAD_COLOR)

    if img is None:
        print("Image Not Found")
        return

    # 이미지 전처리 시작
    print('이미지 전처리 시작')
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # 가우시안 블러 적용
    print('가우시안 블러 적용')
    blur = cv2.GaussianBlur(gray, (5, 5), 0)

    # 적응형 이진화 적용
    print('적응형 이진화 적용')
    thresh = cv2.adaptiveThreshold(
        blur, 255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY_INV,
        15, 2
    )

    # 컨투어 찾기
    print('컨투어 찾기')
    contours, _ = cv2.findContours(
        thresh,
        mode=cv2.RETR_LIST,
        method=cv2.CHAIN_APPROX_SIMPLE
    )

    # 컨투어 데이터 준비
    print('컨투어 데이터 준비')
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

    # 가능한 컨투어 필터링
    print('가능한 컨투어 필터링')
    MIN_AREA = 5
    MIN_WIDTH, MIN_HEIGHT = 4, 8
    MIN_RATIO, MAX_RATIO = 0.25, 2.0

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
    print('컨투어 매칭')
    MAX_DIAG_MULTIPLYER = 3
    MAX_ANGLE_DIFF = 10.0
    MAX_AREA_DIFF = 0.3
    MAX_WIDTH_DIFF = 0.5
    MAX_HEIGHT_DIFF = 1
    MIN_N_MATCHED = 3

    def match_contours(d1, contour_list):
        matched_contours_idx = []
        diagonal_length1 = np.sqrt(d1['w'] ** 2 + d1['h'] ** 2)
        for d2 in contour_list:
            if d1['idx'] == d2['idx']:
                continue

            dx = abs(d1['cx'] - d2['cx'])
            dy = abs(d1['cy'] - d2['cy'])
            distance = np.sqrt(dx ** 2 + dy ** 2)

            if dx == 0:
                angle_diff = 90
            else:
                angle_diff = np.degrees(np.arctan(dy / dx))

            area_diff = abs(d1['w'] * d1['h'] - d2['w'] * d2['h']) / (d1['w'] * d1['h'])
            width_diff = abs(d1['w'] - d2['w']) / d1['w']
            height_diff = abs(d1['h'] - d2['h']) / d1['h']

            if distance < diagonal_length1 * MAX_DIAG_MULTIPLYER and angle_diff < MAX_ANGLE_DIFF and \
                    area_diff < MAX_AREA_DIFF and width_diff < MAX_WIDTH_DIFF and height_diff < MAX_HEIGHT_DIFF:
                matched_contours_idx.append(d2['idx'])

        return matched_contours_idx if len(matched_contours_idx) >= MIN_N_MATCHED else None

    # 병렬처리로 컨투어 매칭 수행
    matched_result_idx = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as executor:
        futures = [executor.submit(match_contours, d1, possible_contours) for d1 in possible_contours]
        for future in concurrent.futures.as_completed(futures):
            result = future.result()
            if result:
                matched_result_idx.append(result)

    print(f"매칭된 컨투어 그룹 수: {len(matched_result_idx)}")

    # 매칭 결과 처리
    matched_result = []
    for idx_list in matched_result_idx:
        matched_result.append(np.take(possible_contours, idx_list))

    # 번호판 후보 이미지 추출
    print('번호판 후보 이미지 추출')

    PLATE_WIDTH_PADDING = 2.5  # 1.3
    PLATE_HEIGHT_PADDING = 3.5  # 1.5
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
            0] > MAX_PLATE_RATIO:
            continue

        plate_imgs.append(img_cropped)
        plate_infos.append({
            'x': int(plate_cx - plate_width / 2),
            'y': int(plate_cy - plate_height / 2),
            'w': int(plate_width),
            'h': int(plate_height)
        })

    # OCR 수행
    print('OCR 수행')
    for i, plate_img in enumerate(plate_imgs):
        result = reader.readtext(plate_img)
        _, image_encoded = cv2.imencode('.jpg', plate_img)

        # 영어 1자와 숫자 4개로 구성된 경우에만 통과
        for bbox, text, conf in result:
            text = re.sub(r'[^A-Za-z0-9]', '', text)
            print(f"OCR 결과: {text}")
            if re.fullmatch(r'[A-Za-z]{1}[0-9]{4}', text):
                text = text.upper()
                result_text = text
                print(result_text)
                _, image_encoded = cv2.imencode('.jpg', plate_img)
                ocr_img_src = upload_image(image_encoded, 'image', 'result')
                ocr_img_src = ocr_img_src.replace('/upload', '')

                total_end_time = time.time()
                print(f"전체 처리 시간: {total_end_time - total_start_time:.4f}초")
                # /ocr로 POST 요청을 보내는 코드 추가
                print(f'{result_text}: {request.time}')
                ocr_request_payload = {
                    "camera_idx": request.camera_idx,
                    "file_name": request.file_name,
                    "type": request.type,
                    "time": request.time,
                    "image_src": path,
                    "ocr_img_src": ocr_img_src,
                    "result_text": result_text,
                }
                # HTTP 요청 보내기
                try:
                    response = requests.post("https://j11b102.p.ssafy.io/plate/insert_crackdown",
                                             json=ocr_request_payload)
                    if response.status_code != 200:
                        print(
                            f"Error calling /ocr API: {response.status_code}, {response.json().get('detail', 'No detail provided')}")
                    else:
                        print("OCR API 호출 성공:", response.json())
                except Exception as e:
                    print(f"Error during /ocr API call: {str(e)}")

                return
            if re.fullmatch(r'[A-Za-z]{1}[0-9]{5}', text):
                if text[-1] == '1':
                    text = text.upper()
                    result_text = text[0:5]
                    print(result_text)
                    _, image_encoded = cv2.imencode('.jpg', plate_img)
                    ocr_img_src = upload_image(image_encoded, 'image', 'result')
                    ocr_img_src = ocr_img_src.replace('/upload', '')

                    total_end_time = time.time()
                    print(f"전체 처리 시간: {total_end_time - total_start_time:.4f}초")
                    # /ocr로 POST 요청을 보내는 코드 추가
                    print(f'{result_text}: {request.time}')
                    ocr_request_payload = {
                        "camera_idx": request.camera_idx,
                        "file_name": request.file_name,
                        "type": request.type,
                        "time": request.time,
                        "image_src": path,
                        "ocr_img_src": ocr_img_src,
                        "result_text": result_text,
                    }
                    # HTTP 요청 보내기
                    try:
                        response = requests.post("https://j11b102.p.ssafy.io/plate/insert_crackdown",
                                                 json=ocr_request_payload)
                        if response.status_code != 200:
                            print(
                                f"Error calling /ocr API: {response.status_code}, {response.json().get('detail', 'No detail provided')}")
                        else:
                            print("OCR API 호출 성공:", response.json())
                    except Exception as e:
                        print(f"Error during /ocr API call: {str(e)}")

                    return

    else:
        total_end_time = time.time()
        print(f"전체 처리 시간: {total_end_time - total_start_time:.4f}초")
        print("OCR Not Found")