import asyncio
from aiohttp import web, ClientSession
import cv2
import numpy as np
import aiohttp
import datetime
import os
from dotenv import load_dotenv

# .env 파일에서 환경 변수 로드
load_dotenv()

# 환경 변수에서 DB 연결 정보 가져오기
API_ENDPOINT = os.getenv("API_ENDPOINT")

async def video_stream(request):
    ws = web.WebSocketResponse()
    await ws.prepare(request)
    print("Client connected")

    frame_interval = 0.3
    last_frame_time = datetime.datetime.now()

    async with ClientSession() as session:
        while True:
            try:
                # 웹소켓으로부터 프레임 데이터 수신
                frame = await ws.receive_bytes()
                # 넘파이 배열로 변환
                nparr = np.frombuffer(frame, np.uint8)
                # 이미지를 디코딩
                image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

                if image is not None:
                    current_time = datetime.datetime.now()
                    time_elapsed = (current_time - last_frame_time).total_seconds()

                    if time_elapsed >= frame_interval:
                        # 이미지를 메모리 버퍼로 인코딩 (JPEG 포맷으로 인코딩)
                        _, image_encoded = cv2.imencode('.jpg', image)
                        # FastAPI 엔드포인트로 이미지 전송
                        files = {'image_file': image_encoded.tobytes()}
                        async with session.post(API_ENDPOINT, data=files) as resp:
                            if resp.status == 200:
                                # 응답으로 받은 주석 처리된 이미지 수신
                                annotated_image_bytes = await resp.read()
                                # 클라이언트로 전송
                                await ws.send_bytes(annotated_image_bytes)
                            else:
                                print(f"Error from FastAPI endpoint: {resp.status}")
                        # 마지막 프레임 시간을 현재 시간으로 업데이트
                        last_frame_time = datetime.datetime.now()

            except (aiohttp.WSServerHandshakeError, aiohttp.ClientError) as e:
                print(f"Error: {e}")
                break
    print("Client disconnected")
    return ws

app = web.Application()
app.router.add_get('/video', video_stream)

# 앱 실행
web.run_app(app, port=8765)
