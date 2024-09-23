import cv2
import requests
import datetime
import numpy as np
import requests

# 이미지 읽기 (임의 경로 사용)
annotated_frame = cv2.imread(r'C:\SSAFY\OCR\image2\license_plate_17.jpg')  # 이미지 파일 경로 설정

# 이미지를 메모리 버퍼로 인코딩 (JPEG 포맷으로 인코딩)
_, image_encoded = cv2.imencode('.jpg', annotated_frame)

# 파일을 서버로 업로드하는 함수
def upload_image(image_buffer):
    url = "https://j11b102.p.ssafy.io/image/upload/test"  # Postman에서 사용한 URL
    # 메모리 버퍼를 바이너리로 전송
    files = {'image': ('image.jpg', image_buffer.tobytes(), 'image/jpeg')}
    response = requests.post(url, files=files)  # POST 요청 보내기
    print(response.status_code)  # 응답 코드 출력
    print(response.text)  # 서버 응답 내용 출력

# 인코딩된 이미지를 업로드
upload_image(image_encoded)
