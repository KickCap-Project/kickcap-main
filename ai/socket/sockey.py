import asyncio
from aiohttp import web, ClientSession
import cv2
import numpy as np
import aiohttp
import os
from queue import Queue
from dotenv import load_dotenv

# .env 파일에서 환경 변수 로드
load_dotenv()

# 환경 변수에서 DB 연결 정보 가져오기
API_ENDPOINT = os.getenv("API_ENDPOINT")

connected_clients = set()
image_queue = Queue(maxsize=50)  # 이미지를 저장하는 큐. 크기를 조절할 수 있습니다.


# 큐에 있는 데이터를 브로드캐스트하는 함수
async def broadcast_frames():
    while True:
        if not image_queue.empty() and connected_clients:  # 큐에 데이터가 있고, 클라이언트가 있으면
            frame = image_queue.get()  # 큐에서 프레임 가져오기
            for client in connected_clients:
                try:
                    await client.send_bytes(frame)
                except Exception as e:
                    print(f"Error broadcasting to client: {e}")
            image_queue.task_done()  # 큐의 작업 완료 처리
        await asyncio.sleep(0.1)  # 너무 자주 실행하지 않도록 딜레이 추가

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

                    # 큐에 프레임 데이터를 저장 (큐가 가득 차면 가장 오래된 데이터를 제거)
                    if image_queue.full():
                        print("Queue is full. Discarding the oldest frame.")
                        image_queue.get()  # 가장 오래된 프레임 제거
                        image_queue.task_done()
                    image_queue.put(msg.data)  # 새로운 프레임 저장

                    # 넘파이 배열로 변환
                    nparr = np.frombuffer(msg.data, np.uint8)
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

# 주기적으로 큐에 있는 데이터를 브로드캐스트하는 태스크 실행
async def start_background_tasks(app):
    app['broadcast_task'] = asyncio.create_task(broadcast_frames())

app.on_startup.append(start_background_tasks)

# 앱 실행
web.run_app(app, port=8765)
