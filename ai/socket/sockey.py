import asyncio
from aiohttp import web, WSMsgType, ClientSession
import cv2
import numpy as np
import os
from dotenv import load_dotenv
from collections import defaultdict
from queue import Queue

# .env 파일에서 환경 변수 로드
load_dotenv()

# 환경 변수에서 API 엔드포인트 가져오기 (필요에 따라 사용)
API_ENDPOINT = os.getenv("API_ENDPOINT")

# 각 camera_idx에 대한 큐와 연결된 클라이언트 저장
image_queues = defaultdict(lambda: asyncio.Queue(maxsize=10))  # 각 카메라의 이미지 데이터를 저장하는 큐
connected_clients = defaultdict(set)  # 각 camera_idx에 연결된 클라이언트
connected_cameras = {}  # 연결된 카메라들: {camera_idx: websocket}
last_frames = {}  # 각 camera_idx의 마지막 프레임 저장


# 큐에서 이미지를 가져와 해당 클라이언트들에게 브로드캐스트하는 함수
async def broadcast_frames():
    while True:
        for camera_idx in list(image_queues.keys()):
            queue = image_queues[camera_idx]
            frame_data = None

            if not queue.empty():
                print(f"Queue size for camera_idx {camera_idx}: {queue.qsize()}")
                # 카메라 ID와 이미지를 함께 저장했으므로 (camera_idx, frame) 형식으로 가져옴
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
                            # 클라이언트의 camera_idx와 프레임의 camera_idx가 같을 때만 전송
                            if camera_idx == frame_camera_idx:
                                await ws.send_bytes(frame_data)
                        except Exception as e:
                            print(f"Error broadcasting to client: {e}")
                            connected_clients[camera_idx].remove(ws)
                else:
                    print(f"No connected clients for camera_idx {camera_idx}, but frame exists.")
            await asyncio.sleep(0.1)
        await asyncio.sleep(0.1)


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

                        frame_data = msg.data

                        # 큐가 가득 찼을 경우 가장 오래된 데이터를 제거
                        queue = image_queues[camera_idx]
                        if queue.full():
                            print(f"Queue for camera_idx {camera_idx} is full. Discarding oldest frame.")
                            await queue.get()
                            queue.task_done()

                        # 큐에 camera_idx와 frame_data를 함께 저장
                        await queue.put({'camera_idx': camera_idx, 'frame': frame_data})

                        # 넘파이 배열로 변환
                        nparr = np.frombuffer(msg.data, np.uint8)
                        # 이미지를 디코딩
                        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

                        if image is not None:
                            # 이미지를 메모리 버퍼로 인코딩 (JPEG 포맷으로 인코딩)
                            _, image_encoded = cv2.imencode('.jpg', image)
                            # FastAPI 엔드포인트로 이미지 전송
                            files = {
                                'image_file': image_encoded.tobytes()
                            }
                            async with session.post(API_ENDPOINT, data=files) as resp:
                                if resp.status != 200:
                                    print(f"Error from FastAPI endpoint: {resp.status}")

                    elif msg.type == WSMsgType.ERROR:
                        print(f"Camera connection closed with exception {ws.exception()}")
            except Exception as e:
                print(f"Camera WebSocket error: {e}")
            finally:
                del connected_cameras[camera_idx]
                print(f"Camera disconnected with camera_idx: {camera_idx}")
    elif role == 'client':
        connected_clients[camera_idx].add(ws)
        try:
            async for msg in ws:
                # 서버는 클라이언트로부터의 메시지를 처리하지 않음
                pass
        except Exception as e:
            print(f"Client WebSocket error: {e}")
        finally:
            connected_clients[camera_idx].remove(ws)
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
