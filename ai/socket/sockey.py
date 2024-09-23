import asyncio
from aiohttp import web
import cv2
import numpy as np
import aiohttp
from ultralytics import YOLO
import os
import datetime  # datetime module added
import requests

# Load the YOLO model. Ultralytics will download the model if it doesn't exist.
# model = YOLO('runs/detect/train5/weights/best.pt')  # yolov8n.pt is a smaller, lightweight version
model = YOLO('best.pt')


# 파일을 서버로 업로드하는 함수
def upload_image(image_buffer, file_name):
    url = "https://j11b102.p.ssafy.io/image/upload/camera"  # Postman에서 사용한 URL
    # 메모리 버퍼를 바이너리로 전송
    files = {'image': (f'{file_name}', image_buffer.tobytes(), 'image/jpeg')}
    response = requests.post(url, files=files)  # POST 요청 보내기
    print(response.status_code)  # 응답 코드 출력
    print(response.text)  # 서버 응답 내용 출력


async def video_stream(request):
    ws = web.WebSocketResponse()
    await ws.prepare(request)
    print("Client connected")

    frame_interval = 0.3
    last_frame_time = datetime.datetime.now()

    directories = ['./Scooter_No_Helmet', './Scooter_Two']
    for directory in directories:
        if not os.path.exists(directory):
            os.makedirs(directory)

    while True:
        try:
            # Receive the frame data from WebSocket
            frame = await ws.receive_bytes()
            # Convert frame data to numpy array
            nparr = np.frombuffer(frame, np.uint8)
            # Decode image from numpy array
            image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

            if image is not None:
                current_time = datetime.datetime.now()
                time_elapsed = (current_time - last_frame_time).total_seconds()

                if time_elapsed >= frame_interval:
                    # Perform object detection
                    results = model.predict(source=image, conf=0.5)

                    # Annotate the image
                    annotated_frame = image.copy()

                    # Process results list
                    for result in results:
                        boxes = result.boxes  # Boxes object for bounding box outputs
                        if boxes:
                            for box in boxes:
                                x1, y1, x2, y2 = map(int, box.xyxy[0])
                                class_label = box.cls.item()  # Extract integer label from tensor
                                class_name = model.names[class_label]  # Get string label from model.names
                                if class_name == "Scooter":
                                    # Draw rectangle on the full image
                                    cv2.rectangle(annotated_frame, (x1, y1), (x2, y2), (255, 0, 0), 3)

                                if class_name == "Scooter_No_Helmet":
                                    # Draw rectangle on the full image
                                    cv2.rectangle(annotated_frame, (x1, y1), (x2, y2), (255, 255, 0), 3)
                                    current_time_str = datetime.datetime.now().strftime("%Y%m%d_%H%M%S%f")
                                    full_image_filename = f'./Scooter_No_Helmet/{current_time_str}_1.jpg'
                                    # cv2.imwrite(full_image_filename, annotated_frame)
                                    # 이미지를 메모리 버퍼로 인코딩 (JPEG 포맷으로 인코딩)
                                    _, image_encoded = cv2.imencode('.jpg', annotated_frame)
                                    # 인코딩된 이미지를 업로드
                                    upload_image(image_encoded, full_image_filename)

                                    # Extract and save the region of interest (ROI) as a separate image
                                    roi = image[y1:y2, x1:x2]
                                    roi_filename = f'./Scooter_No_Helmet/{current_time_str}_2.jpg'
                                    # cv2.imwrite(roi_filename, roi)

                                    # 이미지를 메모리 버퍼로 인코딩 (JPEG 포맷으로 인코딩)
                                    _, image_encoded = cv2.imencode('.jpg', roi)
                                    # 인코딩된 이미지를 업로드
                                    upload_image(image_encoded, roi_filename)

                                if class_name == "Scooter_Two":
                                    # Draw rectangle on the full image
                                    cv2.rectangle(annotated_frame, (x1, y1), (x2, y2), (255, 255, 255), 3)
                                    current_time_str = datetime.datetime.now().strftime("%Y%m%d_%H%M%S%f")
                                    full_image_filename = f'./Scooter_Two/{current_time_str}_1.jpg'
                                    # cv2.imwrite(full_image_filename, annotated_frame)
                                    # 이미지를 메모리 버퍼로 인코딩 (JPEG 포맷으로 인코딩)
                                    _, image_encoded = cv2.imencode('.jpg', annotated_frame)
                                    # 인코딩된 이미지를 업로드
                                    upload_image(image_encoded, full_image_filename)

                                    # Extract and save the region of interest (ROI) as a separate image
                                    roi = image[y1:y2, x1:x2]
                                    roi_filename = f'./Scooter_Two/{current_time_str}_2.jpg'
                                    # cv2.imwrite(roi_filename, roi)
                                    # 이미지를 메모리 버퍼로 인코딩 (JPEG 포맷으로 인코딩)
                                    _, image_encoded = cv2.imencode('.jpg', roi)
                                    # 인코딩된 이미지를 업로드
                                    upload_image(image_encoded, roi_filename)

                    # Convert the annotated frame to JPEG format
                    _, buffer = cv2.imencode('.jpg', annotated_frame)
                    jpeg_bytes = buffer.tobytes()

                    # Send the JPEG bytes back to the client
                    await ws.send_bytes(jpeg_bytes)

                    # Update last_frame_time to current
                    last_frame_time = datetime.datetime.now()

        except (aiohttp.WSServerHandshakeError, aiohttp.ClientError) as e:
            print(f"Error: {e}")
            break
    print("Client disconnected")
    return ws

app = web.Application()
app.router.add_get('/video', video_stream)

# Run the app
web.run_app(app, port=8765)