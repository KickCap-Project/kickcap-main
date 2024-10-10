import datetime
from pydantic import BaseModel
from ultralytics import YOLO
import requests
import cv2
import numpy as np
import pytz
from datetime import datetime
from fastapi import FastAPI, File, UploadFile, Form
import os

os.environ["CUDA_DEVICE_ORDER"] = "PCI_BUS_ID"
os.environ["CUDA_VISIBLE_DEVICES"] = "8"

# FastAPI 앱 생성
app = FastAPI()

KST = pytz.timezone('Asia/Seoul')

# YOLO 모델 로드
model = YOLO('runs/detect/train3/weights/best.pt')


def upload_image(image_buffer, file_name, type):
    url = f"https://j11b102.p.ssafy.io/image/upload/{type}"
    files = {'image': (f'{file_name}.jpg', image_buffer.tobytes(), 'image/jpeg')}
    response = requests.post(url, files=files)
    return f'{url}/{response.text}'


class OCRRequests(BaseModel):
    camera_idx: int
    file_name: str
    type: int
    time: str


# 킥보드의 유형에 따라 서버에 이미지를 저장
@app.post("/detect")
async def detect(
    image_file: UploadFile = File(...),
    camera_idx: int = Form(...)
):
    # 업로드된 파일에서 이미지 읽기
    contents = await image_file.read()
    nparr = np.frombuffer(contents, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    if image is not None:
        results = model.predict(source=image, conf=0.5, verbose=False)

        annotated_frame = image.copy()

        for result in results:
            boxes = result.boxes  # 바운딩 박스 객체
            if boxes:
                for box in boxes:
                    x1, y1, x2, y2 = map(int, box.xyxy[0])
                    class_label = box.cls.item()
                    class_name = model.names[class_label]
                    current_time_str = datetime.now().strftime("%Y%m%d%H%M%S%f")
                    print(current_time_str)
                    if class_name == "Scooter":
                        # 전체 이미지에 사각형 그리기
                        print('헬멧 착용')

                    if class_name == "Scooter_No_Helmet":
                        # 전체 이미지에 사각형 그리기
                        print('헬멧 미착용')
                        full_image_filename = f'Scooter_No_Helmet_{current_time_str}_1'

                        _, image_encoded = cv2.imencode('.jpg', annotated_frame)
                        uploaded_url = upload_image(image_encoded, full_image_filename, 'camera')
                        uploaded_file_name = uploaded_url.split('/')[-1]

                        # 두 번째 API에 POST 요청 보내기
                        data = {
                            'camera_idx': camera_idx,
                            'file_name': uploaded_file_name,
                            'type': 3,
                            'time': current_time_str
                        }
                        requests.post('http://localhost:9876/preprocess', json=data)

                        roi = image[y1:y2, x1:x2]
                        roi_filename = f'Scooter_No_Helmet_{current_time_str}_2'
                        _, image_encoded = cv2.imencode('.jpg', roi)
                        upload_image(image_encoded, roi_filename, 'camera')

                    if class_name == "Scooter_Two":
                        # 전체 이미지에 사각형 그리기
                        print('다인 탑승')
                        full_image_filename = f'Scooter_Two_{current_time_str}_1'

                        _, image_encoded = cv2.imencode('.jpg', annotated_frame)
                        uploaded_url = upload_image(image_encoded, full_image_filename, 'camera')
                        uploaded_file_name = uploaded_url.split('/')[-1]

                        # 두 번째 API에 POST 요청 보내기
                        data = {
                            'camera_idx': camera_idx,
                            'file_name': uploaded_file_name,
                            'type': 1,
                            'time': current_time_str
                        }
                        requests.post('http://localhost:9876/preprocess', json=data)

                        roi = image[y1:y2, x1:x2]
                        roi_filename = f'Scooter_Two_{current_time_str}_2'
                        _, image_encoded = cv2.imencode('.jpg', roi)
                        upload_image(image_encoded, roi_filename, 'camera')
