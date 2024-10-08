connected_clients = {}  # 각 CCTV의 연결을 저장할 딕셔너리


# 특정 CCTV에 대한 방송 관리 함수
async def broadcast_frames(camera_id):
    while True:
        if camera_id in image_queue and not image_queue[camera_id].empty() and connected_clients.get(camera_id):
            frame = image_queue[camera_id].get()  # 특정 카메라에 대한 프레임 가져오기
            for client in connected_clients[camera_id]:
                try:
                    await client.send_bytes(frame)
                except Exception as e:
                    print(f"Error broadcasting to client: {e}")
            image_queue[camera_id].task_done()
        await asyncio.sleep(0.1)


async def video_stream(request):
    ws = web.WebSocketResponse()
    await ws.prepare(request)

    # 요청에서 camera_id를 추출 (예: 쿼리 파라미터나 URL의 일부로 전달)
    camera_id = request.query.get('camera_id')  # 쿼리 파라미터로부터 camera_id 가져오기
    if camera_id is None:
        return web.HTTPBadRequest(reason="camera_id is required")

    print(f"Client connected for camera {camera_id}")

    if camera_id not in connected_clients:
        connected_clients[camera_id] = set()
    connected_clients[camera_id].add(ws)

    if camera_id not in image_queue:
        image_queue[camera_id] = Queue(maxsize=50)  # 특정 카메라에 대한 큐 생성

    async with ClientSession() as session:
        try:
            async for msg in ws:
                if msg.type == aiohttp.WSMsgType.BINARY:
                    data_size = len(msg.data)
                    print(f"Received data size: {data_size} bytes from camera {camera_id}")

                    if image_queue[camera_id].full():
                        print(f"Queue for camera {camera_id} is full. Discarding the oldest frame.")
                        image_queue[camera_id].get()
                        image_queue[camera_id].task_done()

                    image_queue[camera_id].put(msg.data)

                    nparr = np.frombuffer(msg.data, np.uint8)
                    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

                    if image is not None:
                        _, image_encoded = cv2.imencode('.jpg', image)
                        files = {'image_file': image_encoded.tobytes()}
                        async with session.post(API_ENDPOINT, data=files) as resp:
                            if resp.status != 200:
                                print(f"Error from FastAPI endpoint: {resp.status}")
                elif msg.type == aiohttp.WSMsgType.ERROR:
                    print(f'ws connection closed with exception {ws.exception()}')
        except Exception as e:
            print(f"Error: {e}")
        finally:
            connected_clients[camera_id].remove(ws)
            if not connected_clients[camera_id]:
                del connected_clients[camera_id]  # 클라이언트가 더 이상 없으면 카메라 제거
            print(f"Client disconnected from camera {camera_id}")
    return ws


app = web.Application()
app.router.add_get('/video', video_stream)


# 백그라운드에서 주기적으로 큐 데이터를 처리하는 태스크 실행
async def start_background_tasks(app):
    for camera_id in connected_clients.keys():
        app['broadcast_task'] = asyncio.create_task(broadcast_frames(camera_id))


app.on_startup.append(start_background_tasks)

web.run_app(app, port=8765)
