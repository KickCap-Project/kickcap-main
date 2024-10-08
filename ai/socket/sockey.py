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

# 연결된 클라이언트 관리용 집합
connected_clients = set()
# 각 카메라에 대한 이미지를 저장하는 큐 (카메라마다 큐를 나누고 싶으면 카메라별로 분리 가능)
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


# WebSocket 요청을 처리하는 함수
async def video_stream(request):
    ws = web.WebSocketResponse()
    await ws.prepare(request)

    # Query parameter에서 camera_idx 가져오기
    camera_idx = request.query.get('camera_idx')
    print(f"Client connected for camera_idx: {camera_idx}")

    connected_clients.add(ws)

    async with ClientSession() as session:
        try:
            async for msg in ws:
                if msg.type == aiohttp.WSMsgType.BINARY:
                    # 수신받은 데이터 크기 출력
                    data_size = len(msg.data)
                    print(f"Received data size: {data_size} bytes for camera_idx: {camera_idx}")

                    # 카메라별 프레임 처리 로직
                    process_frame_for_camera(camera_idx, msg.data, session)

                elif msg.type == aiohttp.WSMsgType.ERROR:
                    print('ws connection closed with exception %s' % ws.exception())
        except Exception as e:
            print(f"Error: {e}")
        finally:
            connected_clients.remove(ws)
            print(f"Client disconnected for camera_idx: {camera_idx}")
    return ws


# 카메라별 프레임을 처리하는 함수
def process_frame_for_camera(camera_idx, frame_data, session):
    # 큐가 가득 차면 가장 오래된 데이터를 제거
    if image_queue.full():
        print(f"Queue is full for camera_idx: {camera_idx}. Discarding the oldest frame.")
        image_queue.get()
        image_queue.task_done()
    image_queue.put(frame_data)  # 새로운 프레임 저장

    # 넘파이 배열로 변환 후 이미지 디코딩
    nparr = np.frombuffer(frame_data, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    if image is not None:
        # 이미지를 메모리 버퍼로 인코딩 (JPEG 포맷으로 인코딩)
        _, image_encoded = cv2.imencode('.jpg', image)
        files = {'image_file': image_encoded.tobytes()}

        # FastAPI 엔드포인트로 비동기적으로 이미지 전송
        asyncio.create_task(send_image_to_fastapi(session, files))


# FastAPI 엔드포인트로 이미지 전송하는 함수
async def send_image_to_fastapi(session, files):
    try:
        async with session.post(API_ENDPOINT, data=files) as resp:
            if resp.status != 200:
                print(f"Error from FastAPI endpoint: {resp.status}")
    except Exception as e:
        print(f"Error sending image to FastAPI: {e}")


# aiohttp 웹 앱 설정
app = web.Application()

# 비디오 스트림 엔드포인트 추가
app.router.add_get('/video', video_stream)


# 주기적으로 큐에 있는 데이터를 브로드캐스트하는 태스크 실행
async def start_background_tasks(app):
    app['broadcast_task'] = asyncio.create_task(broadcast_frames())


app.on_startup.append(start_background_tasks)

# 앱 실행
if __name__ == '__main__':
    web.run_app(app, port=8765)
