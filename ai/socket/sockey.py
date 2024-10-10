import asyncio
from aiohttp import web, WSMsgType, ClientSession, FormData, WebSocketError  # WebSocketError 추가
import cv2
import numpy as np
import os
from dotenv import load_dotenv
from collections import defaultdict
import concurrent.futures  # Executors를 위한 임포트

# .env 파일에서 환경 변수 로드
load_dotenv()

# 환경 변수에서 API 엔드포인트 가져오기
API_ENDPOINT = os.getenv("API_ENDPOINT")

# Executors 생성 (스레드 풀 또는 프로세스 풀 선택 가능)
executor = concurrent.futures.ThreadPoolExecutor(max_workers=2)  # 최대 2개의 스레드로 제한

# 각 camera_idx에 대한 큐와 연결된 클라이언트 저장
image_queues = defaultdict(lambda: asyncio.Queue(maxsize=10))  # 각 카메라의 이미지 데이터를 저장하는 큐
connected_clients = defaultdict(set)  # 각 camera_idx에 연결된 클라이언트
connected_cameras = {}  # 연결된 카메라들: {camera_idx: websocket}
last_frames = {}  # 각 camera_idx의 마지막 프레임 저장

client_tasks = {}  # 클라이언트 태스크 저장용 딕셔너리
connected_clients_lock = asyncio.Lock()
client_tasks_lock = asyncio.Lock()

# 클라이언트에게 프레임을 전송하는 개별 태스크
async def client_send_loop(ws, camera_idx):
    try:
        while True:
            frame_data = await ws.client_queue.get()
            await ws.send_bytes(frame_data)
    except (asyncio.CancelledError, WebSocketError):  # 수정된 부분
        pass
    except Exception as e:
        print(f"Error in client_send_loop for camera_idx {camera_idx}: {e}")
    finally:
        ws.client_queue = None

# 프레임을 처리하는 함수
async def process_frame(camera_idx):
    queue = image_queues[camera_idx]
    frame_info = await queue.get()
    frame_camera_idx, frame_data = frame_info['camera_idx'], frame_info['frame']
    last_frames[camera_idx] = frame_data
    queue.task_done()

    async with connected_clients_lock:
        clients = connected_clients.get(camera_idx, set()).copy()
    for ws in clients:
        try:
            if ws.client_queue and not ws.client_queue.full():
                await ws.client_queue.put(frame_data)
            else:
                if ws.client_queue:
                    # 큐가 가득 찼을 경우 가장 오래된 프레임 제거
                    ws.client_queue.get_nowait()
                    await ws.client_queue.put(frame_data)
        except Exception as e:
            print(f"Error distributing frame to client: {e}")
            async with connected_clients_lock:
                if ws in connected_clients[camera_idx]:
                    connected_clients[camera_idx].remove(ws)
            async with client_tasks_lock:
                client_task = client_tasks.pop(ws, None)
                if client_task:
                    client_task.cancel()

# 큐에서 이미지를 가져와 각 클라이언트의 큐에 분배하는 함수
async def broadcast_frames():
    while True:
        tasks = []
        for camera_idx, queue in image_queues.items():
            if not queue.empty():
                tasks.append(process_frame(camera_idx))
        if tasks:
            await asyncio.gather(*tasks)
        else:
            await asyncio.sleep(0.05)  # 프레임이 없을 때 슬립 시간 증가

# 이미지 처리 함수 (동기 함수, executor에서 실행)
def process_image(data):
    # 이미지 디코딩
    nparr = np.frombuffer(data, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if image is not None:
        # 이미지를 320x180 크기로 리사이즈
        resized_image = cv2.resize(image, (320, 180))
        # 리사이즈된 이미지를 JPEG로 인코딩
        _, resized_image_encoded = cv2.imencode('.jpg', resized_image)
        frame_data = resized_image_encoded.tobytes()
        return frame_data, image
    else:
        print("Failed to decode image")
        return None, None

# API로 이미지 전송 함수 (동기 함수)
def send_to_api(image_encoded_bytes, camera_idx):
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    async def _send():
        async with ClientSession() as session:
            form = FormData()
            form.add_field(
                'image_file',
                image_encoded_bytes,
                filename='image.jpg',
                content_type='image/jpeg'
            )
            form.add_field('camera_idx', str(camera_idx))
            async with session.post(API_ENDPOINT, data=form) as resp:
                if resp.status != 200:
                    print(f"Error from FastAPI endpoint: {resp.status}")
    loop.run_until_complete(_send())
    loop.close()

# 카메라와 클라이언트 모두를 처리하는 WebSocket 엔드포인트
async def websocket_handler(request):
    ws = web.WebSocketResponse()
    await ws.prepare(request)

    # 쿼리 파라미터에서 역할(role)과 camera_idx 가져오기
    role = request.query.get('role')
    camera_idx = request.query.get('camera_idx')

    if not role or not camera_idx:
        await ws.close(message='role and camera_idx query parameters are required')
        return ws

    print(f"{role.capitalize()} connected with camera_idx: {camera_idx}")

    # 역할에 따라 다른 처리
    if role == 'camera':
        if camera_idx in connected_cameras:
            await ws.close(message='Another camera is already connected with this camera_idx')
            return ws
        connected_cameras[camera_idx] = ws

        try:
            async for msg in ws:
                if msg.type == WSMsgType.BINARY:
                    # 이미지 처리와 API 전송을 executor로 오프로드
                    frame_data, image = await asyncio.get_event_loop().run_in_executor(
                        executor,
                        process_image,
                        msg.data
                    )
                    if frame_data is not None:
                        # 프레임을 큐에 추가
                        queue = image_queues[camera_idx]
                        if queue.full():
                            print(f"Queue for camera_idx {camera_idx} is full. Discarding oldest frame.")
                            await queue.get()
                            queue.task_done()
                        await queue.put({'camera_idx': camera_idx, 'frame': frame_data})

                        # 원본 이미지를 API로 전송
                        _, image_encoded = cv2.imencode('.jpg', image)
                        image_encoded_bytes = image_encoded.tobytes()
                        # API 전송을 executor로 오프로드
                        asyncio.get_event_loop().run_in_executor(
                            executor,
                            send_to_api,
                            image_encoded_bytes,
                            camera_idx
                        )
                elif msg.type == WSMsgType.ERROR:
                    print(f"Camera connection closed with exception {ws.exception()}")
        except Exception as e:
            print(f"Camera WebSocket error: {e}")
        finally:
            del connected_cameras[camera_idx]
            print(f"Camera disconnected with camera_idx: {camera_idx}")
    elif role == 'client':
        async with connected_clients_lock:
            connected_clients[camera_idx].add(ws)
        ws.client_queue = asyncio.Queue(maxsize=2)  # 클라이언트 큐 생성
        client_task = asyncio.create_task(client_send_loop(ws, camera_idx))
        async with client_tasks_lock:
            client_tasks[ws] = client_task
        try:
            async for msg in ws:
                pass  # 서버는 클라이언트로부터의 메시지를 처리하지 않음
        except Exception as e:
            print(f"Client WebSocket error: {e}")
        finally:
            async with connected_clients_lock:
                if ws in connected_clients[camera_idx]:
                    connected_clients[camera_idx].remove(ws)
            async with client_tasks_lock:
                client_task = client_tasks.pop(ws, None)
                if client_task:
                    client_task.cancel()
            print(f"Client disconnected with camera_idx: {camera_idx}")
    else:
        await ws.close(message='Invalid role')
        return ws

    return ws

app = web.Application()
app.router.add_get('/video', websocket_handler)

# 백그라운드에서 프레임을 처리하는 태스크 시작
async def start_background_tasks(app):
    app['broadcast_task'] = asyncio.create_task(broadcast_frames())

app.on_startup.append(start_background_tasks)

# 앱 실행
if __name__ == '__main__':
    web.run_app(app, port=8765)
