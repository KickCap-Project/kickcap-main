import asyncio
from aiohttp import web, ClientSession
import cv2
import numpy as np
import aiohttp
import os
from dotenv import load_dotenv
from multiprocessing import Process, Queue

# .env 파일에서 환경 변수 로드
load_dotenv()

API_ENDPOINT = os.getenv("API_ENDPOINT")
connected_clients = set()
image_queue = Queue()  # 프로세스 간에 데이터를 공유할 Queue

async def broadcast_images(queue):
    while True:
        try:
            images_to_broadcast = []
            for _ in range(3):
                if not queue.empty():
                    frame = queue.get()
                    images_to_broadcast.append(frame)
                    print(f"Image added to broadcast queue: {len(frame)} bytes")
                else:
                    break

            if images_to_broadcast:
                print(f"Broadcasting {len(images_to_broadcast)} images to {len(connected_clients)} clients.")
                for client in connected_clients:
                    for frame in images_to_broadcast:
                        await client.send_bytes(frame)
                        print(f"Sent frame of size: {len(frame)} bytes to client.")
        except Exception as e:
            print(f"Error during broadcasting: {e}")
        await asyncio.sleep(1)

async def video_stream(request, queue):
    ws = web.WebSocketResponse()
    await ws.prepare(request)
    print("Client connected")

    connected_clients.add(ws)

    async with ClientSession() as session:
        try:
            async for msg in ws:
                if msg.type == aiohttp.WSMsgType.BINARY:
                    data_size = len(msg.data)
                    print(f"Received data size: {data_size} bytes")

                    frame = msg.data
                    queue.put(frame)
                    print(f"Frame added to queue, current queue size: {queue.qsize()}")

                    nparr = np.frombuffer(frame, np.uint8)
                    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

                    if image is not None:
                        _, image_encoded = cv2.imencode('.jpg', image)
                        files = {'image_file': image_encoded.tobytes()}
                        async with session.post(API_ENDPOINT, data=files) as resp:
                            if resp.status != 200:
                                print(f"Error from FastAPI endpoint: {resp.status}")

                        resized_image = cv2.resize(image, (640, 360))
                        _, resize_image_encoded = cv2.imencode('.jpg', resized_image)
                        annotated_image_bytes = resize_image_encoded.tobytes()

                        queue.put(annotated_image_bytes)
                elif msg.type == aiohttp.WSMsgType.ERROR:
                    print('ws connection closed with exception %s' % ws.exception())
        except Exception as e:
            print(f"Error: {e}")
        finally:
            connected_clients.remove(ws)
            print("Client disconnected")
    return ws

def start_websocket_server(queue):
    app = web.Application()
    app.router.add_get('/video', lambda request: video_stream(request, queue))

    web.run_app(app, port=8765)

def start_broadcast_process(queue):
    loop = asyncio.get_event_loop()
    loop.create_task(broadcast_images(queue))
    loop.run_forever()

if __name__ == "__main__":
    # 두 개의 프로세스 실행: 하나는 웹소켓 서버, 다른 하나는 브로드캐스트 작업
    queue = Queue()

    # 웹소켓 서버 프로세스
    websocket_process = Process(target=start_websocket_server, args=(queue,))
    websocket_process.start()

    # 브로드캐스트 프로세스
    broadcast_process = Process(target=start_broadcast_process, args=(queue,))
    broadcast_process.start()

    # 두 프로세스가 종료될 때까지 대기
    websocket_process.join()
    broadcast_process.join()
