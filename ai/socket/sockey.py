import asyncio
from aiohttp import web, ClientSession
import cv2
import numpy as np
import aiohttp
import os
from dotenv import load_dotenv

# .env 파일에서 환경 변수 로드
load_dotenv()

API_ENDPOINT = os.getenv("API_ENDPOINT")
connected_clients = set()
image_queue = asyncio.Queue()  # 이미지 데이터를 저장할 큐


async def broadcast_images():
    while True:
        try:
            # 1초마다 큐에서 최대 3장의 이미지를 꺼내옴
            images_to_broadcast = []
            for _ in range(3):
                try:
                    # 큐에서 이미지를 비동기적으로 가져옴 (1초에 3장 처리)
                    frame = await asyncio.wait_for(image_queue.get(), timeout=1)
                    images_to_broadcast.append(frame)
                except asyncio.TimeoutError:
                    # 큐에 더 이상 이미지가 없는 경우, 남은 이미지만 처리
                    break

            # 이미지가 있는 경우만 브로드캐스트
            if images_to_broadcast:
                for client in connected_clients:
                    for frame in images_to_broadcast:
                        await client.send_bytes(frame)
        except Exception as e:
            print(f"Error during broadcasting: {e}")
        finally:
            # 다음 처리로 넘어가기 전에 1초 대기
            await asyncio.sleep(1)


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

                    # 큐에 프레임 추가 (1초마다 브로드캐스트됨)
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

                        # 이미지 크기를 조정하고 주석 처리된 이미지를 큐에 추가
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

# 웹소켓 서버를 실행하면서, 큐의 데이터를 브로드캐스트하는 작업도 비동기로 실행
loop = asyncio.get_event_loop()
loop.create_task(broadcast_images())
web.run_app(app, port=8765)
