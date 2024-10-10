import asyncio
from aiohttp import web, WSMsgType, ClientSession, FormData
import cv2
import numpy as np
import os
from dotenv import load_dotenv
from collections import defaultdict

# .env 파일에서 환경 변수 로드
load_dotenv()

# 환경 변수에서 API 엔드포인트 가져오기 (필요에 따라 사용)
API_ENDPOINT = os.getenv("API_ENDPOINT")

# 각 camera_idx에 대한 큐와 연결된 클라이언트 저장
image_queues = defaultdict(lambda: asyncio.Queue(maxsize=10))  # 각 카메라의 이미지 데이터를 저장하는 큐
connected_clients = defaultdict(set)  # 각 camera_idx에 연결된 클라이언트
connected_cameras = {}  # 연결된 카메라들: {camera_idx: websocket}
last_frames = {}  # 각 camera_idx의 마지막 프레임 저장

# 클라이언트에게 프레임을 전송하는 개별 태스크
async def client_send_loop(ws, camera_idx):
    try:
        while True:
            frame_data = await ws.client_queue.get()
            await ws.send_bytes(frame_data)
    except asyncio.CancelledError:
        pass
    except Exception as e:
        print(f"Error in client_send_loop for camera_idx {camera_idx}: {e}")
    finally:
        ws.client_queue = None

# 큐에서 이미지를 가져와 각 클라이언트의 큐에 분배하는 함수
async def broadcast_frames():
    while True:
        for camera_idx in list(image_queues.keys()):
            queue = image_queues[camera_idx]
            frame_data = None
            frame_camera_idx = None

            if not queue.empty():
                print(f"Queue size for camera_idx {camera_idx}: {queue.qsize()}")
                frame_info = await queue.get()
                frame_camera_idx, frame_data = frame_info['camera_idx'], frame_info['frame']
                last_frames[camera_idx] = frame_data  # 마지막 프레임 저장
                queue.task_done()
            else:
                # 큐가 비어 있을 때 마지막 프레임 사용
                frame_data = last_frames.get(camera_idx)

            if frame_data:
                clients = connected_clients.get(camera_idx, set())
                if clients:
                    for ws in clients.copy():
                        try:
                            if camera_idx == frame_camera_idx:
                                # 클라이언트의 큐에 프레임 추가
                                if ws.client_queue and not ws.client_queue.full():
                                    await ws.client_queue.put(frame_data)
                                else:
                                    # 큐가 가득 찼을 경우 가장 오래된 프레임 제거
                                    if ws.client_queue:
                                        ws.client_queue.get_nowait()
                                        await ws.client_queue.put(frame_data)
                        except Exception as e:
                            print(f"Error distributing frame to client: {e}")
                            connected_clients[camera_idx].remove(ws)
                else:
                    print(f"No connected clients for camera_idx {camera_idx}, but frame exists.")
            await asyncio.sleep(0.01)
        await asyncio.sleep(0.01)

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
        async with ClientSession() as session:
            try:
                async for msg in ws:
                    if msg.type == WSMsgType.BINARY:
                        # 수신받은 데이터 크기 출력
                        data_size = len(msg.data)
                        print(f"Received data size: {data_size} bytes")

                        # msg.data를 넘파이 배열로 변환
                        nparr = np.frombuffer(msg.data, np.uint8)
                        # 이미지를 디코딩
                        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

                        if image is not None:
                            # 이미지를 320x180 크기로 리사이즈
                            resized_image = cv2.resize(image, (320, 180))
                            # 리사이즈된 이미지를 JPEG로 인코딩
                            _, resized_image_encoded = cv2.imencode('.jpg', resized_image)
                            # 인코딩된 이미지를 바이트로 변환
                            frame_data = resized_image_encoded.tobytes()

                            # 큐가 가득 찼을 경우 가장 오래된 데이터를 제거
                            queue = image_queues[camera_idx]
                            if queue.full():
                                print(f"Queue for camera_idx {camera_idx} is full. Discarding oldest frame.")
                                await queue.get()
                                queue.task_done()

                            # 큐에 camera_idx와 리사이즈된 frame_data를 함께 저장
                            await queue.put({'camera_idx': camera_idx, 'frame': frame_data})

                            # 원본 이미지를 JPEG로 인코딩하여 API 엔드포인트로 전송
                            _, image_encoded = cv2.imencode('.jpg', image)
                            form = FormData()
                            form.add_field(
                                'image_file',
                                image_encoded.tobytes(),
                                filename='image.jpg',  # 파일 이름을 필요에 따라 설정
                                content_type='image/jpeg'
                            )
                            form.add_field('camera_idx', str(camera_idx))

                            async with session.post(API_ENDPOINT, data=form) as resp:
                                if resp.status != 200:
                                    print(f"Error from FastAPI endpoint: {resp.status}")
                        else:
                            print("Failed to decode image")
                    elif msg.type == WSMsgType.ERROR:
                        print(f"Camera connection closed with exception {ws.exception()}")
            except Exception as e:
                print(f"Camera WebSocket error: {e}")
            finally:
                del connected_cameras[camera_idx]
                print(f"Camera disconnected with camera_idx: {camera_idx}")
    elif role == 'client':
        connected_clients[camera_idx].add(ws)
        ws.client_queue = asyncio.Queue(maxsize=2)  # 클라이언트 큐 생성
        client_task = asyncio.create_task(client_send_loop(ws, camera_idx))
        try:
            async for msg in ws:
                # 서버는 클라이언트로부터의 메시지를 처리하지 않음
                pass
        except Exception as e:
            print(f"Client WebSocket error: {e}")
        finally:
            connected_clients[camera_idx].remove(ws)
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
