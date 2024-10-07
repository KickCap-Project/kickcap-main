import asyncio
from aiohttp import web, ClientSession
import cv2
import numpy as np
import aiohttp
import os
from dotenv import load_dotenv

# .env 파일에서 환경 변수 로드
load_dotenv()

# 환경 변수에서 DB 연결 정보 가져오기
API_ENDPOINT = os.getenv("API_ENDPOINT")

connected_clients = set()
image_queue = asyncio.Queue()


async def broadcast_images():
    while True:
        frame = await image_queue.get()  # Queue에서 데이터를 가져옴 (대기)
        for client in connected_clients:
            try:
                await client.send_bytes(frame)  # 브로드캐스트
            except Exception as e:
                print(f"Error broadcasting to client: {e}")
        image_queue.task_done()  # Queue에서 작업이 완료되었음을 알림


async def video_stream(request):
    ws = web.WebSocketResponse()
    await ws.prepare(request)
    print("Client connected")

    connected_clients.add(ws)

    async with ClientSession() as session:
        try:
            async for msg in ws:
                if msg.type == aiohttp.WSMsgType.BINARY:
                    # 수신받은 데이터 크기 출력
                    data_size = len(msg.data)
                    print(f"Received data size: {data_size} bytes")

                    # 웹소켓으로부터 프레임 데이터 수신
                    frame = msg.data

                    # 원본 프레임을 Queue에 넣음
                    await image_queue.put(frame)

                    # 넘파이 배열로 변환
                    nparr = np.frombuffer(frame, np.uint8)
                    # 이미지를 디코딩
                    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

                    if image is not None:
                        # 이미지를 메모리 버퍼로 인코딩 (JPEG 포맷으로 인코딩)
                        _, image_encoded = cv2.imencode('.jpg', image)
                        # FastAPI 엔드포인트로 이미지 전송
                        files = {'image_file': image_encoded.tobytes()}
                        async with session.post(API_ENDPOINT, data=files) as resp:
                            if resp.status != 200:
                                print(f"Error from FastAPI endpoint: {resp.status}")

                        # 주석 처리된 이미지를 다른 클라이언트들에게 브로드캐스트 (Queue에 넣음)
                        resized_image = cv2.resize(image, (640, 360))
                        _, resize_image_encoded = cv2.imencode('.jpg', resized_image)
                        annotated_image_bytes = resize_image_encoded.tobytes()
                        await image_queue.put(annotated_image_bytes)
                elif msg.type == aiohttp.WSMsgType.ERROR:
                    print('ws connection closed with exception %s' % ws.exception())
        except Exception as e:
            print(f"Error: {e}")
        finally:
            connected_clients.remove(ws)
            print("Client disconnected")
    return ws


app = web.Application()
app.router.add_get('/video', video_stream)

# 브로드캐스트 작업을 별도의 비동기 태스크로 실행
loop = asyncio.get_event_loop()
loop.create_task(broadcast_images())

# 앱 실행
web.run_app(app, port=8765)
