import time
import requests
from pydantic import BaseModel
import cv2
import numpy as np
import re
import redis
import pytz
from datetime import datetime, timedelta
import psycopg2
from dotenv import load_dotenv
from fastapi import FastAPI, File, UploadFile, HTTPException
import os
from fastapi.middleware.cors import CORSMiddleware  # CORS 미들웨어 임포트
import httpx

"""
실행 명령어:
uvicorn license_plate_api:app --reload

POST: http://localhost:8000/ocr
(JSON)
{
    "camera_idx": 1,
    "file_path": "C://Users//roista//Desktop//SSAFY//OCR//image2//license_plate_18.jpg",
    "type": 1,
    "time": "20230101123045000"
}

>> redis 에서는 "camera1_번호판 번호" 형태의 키로 저장 (TTL은 1분)

- DB에 저장하는 코드 추가해야 됨
- OCR 정확도 확인 필요
-- 파라미터 조정
-- 추출한 이미지 내의 사각형을 확인 후 평면으로 만드는 작업
-- 번호판의 형태 및 폰트 변경
"""

app = FastAPI()

# CORS 설정 추가
origins = [
    "http://localhost:3000",  # React 앱이 실행되는 도메인
    # 필요에 따라 다른 도메인을 추가할 수 있습니다.
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # 허용할 출처 목록
    allow_credentials=True,
    allow_methods=["*"],  # 허용할 HTTP 메서드
    allow_headers=["*"],  # 허용할 HTTP 헤더
)

KST = pytz.timezone('Asia/Seoul')

# Redis 클라이언트 설정
redis_client = redis.Redis(host='localhost', port=5555, db=0)

# .env 파일에서 환경 변수 로드
load_dotenv()

# 환경 변수에서 DB 연결 정보 가져오기
db_name = os.getenv("DB_NAME")
db_user = os.getenv("DB_USER")
db_password = os.getenv("DB_PASSWORD")
db_host = os.getenv("DB_HOST")
db_port = os.getenv("DB_PORT")
API_ENDPOINT = os.getenv("API_ENDPOINT")


# 파일을 서버로 업로드하는 함수
def upload_image2(image_buffer, file_name, type):
    url = f"https://j11b102.p.ssafy.io/image/upload/{type}"  # Postman에서 사용한 URL
    # 메모리 버퍼를 바이너리로 전송
    files = {'image': (f'{file_name}.jpg', image_buffer.tobytes(), 'image/jpeg')}
    response = requests.post(url, files=files)  # POST 요청 보내기
    return f'{response.text}'



class OCRRequests(BaseModel):
    camera_idx: int
    file_name: str
    type: int
    time: str


class GcooterRequests(BaseModel):
    kickboard_number: str
    phone: str
    name: str
    minute: int


class ResultRequests(BaseModel):
    image_src: str
    ocr_img_src: str
    result_text: str

@app.post("/insert")
def gcooter_insert(request: GcooterRequests):
    lat = 36.355409
    lng = 127.298400
    code = '3020011300'
    addr = '대전광역시 유성구 덕명동 122-1 유성연수원'

    try:
        connection = psycopg2.connect(
            dbname=db_name,
            user=db_user,
            password=db_password,
            host=db_host,
            port=db_port
        )
        cursor = connection.cursor()

        now_kst = datetime.now(KST)
        select_query = '''
            SELECT name
            FROM gcooter
            WHERE %s BETWEEN start_time AND end_time
            AND kickboard_number = %s;
            '''

        cursor.execute(select_query, (now_kst, request.kickboard_number, ))
        results = cursor.fetchall()
        if not results:
            # SQL 쿼리에서 NOW()와 INTERVAL을 직접 사용
            insert_query = f'''
            INSERT INTO gcooter (lat, lng, start_time, end_time, code, addr, kickboard_number, phone, name)
            VALUES (%s, %s, NOW(), NOW() + INTERVAL '{request.minute} minutes', %s, %s, %s, %s, %s)
            '''

            # SQL 함수인 NOW()와 INTERVAL은 직접 쿼리에 넣고 나머지는 파라미터로 전달
            data = (lat, lng, code, addr, request.kickboard_number, request.phone, request.name)
            cursor.execute(insert_query, data)
            connection.commit()
            raise HTTPException(status_code=200, detail="Inserting Data Into the Database")
        else:
            print("Duplicate Kickboard")
            raise HTTPException(status_code=500, detail="Duplicate Kickboard")

    except HTTPException as http_exc:
        raise http_exc  # HTTPException을 그대로 재발생시켜 FastAPI가 처리하도록 합니다.

    except Exception as error:
        print(f"에러 발생: {error}")
        raise HTTPException(status_code=500, detail="DataBase Error")  # 데이터베이스 예외 처리

    finally:
        if connection:
            cursor.close()
            connection.close()
            # print("PostgreSQL 연결이 닫혔습니다.")

@app.post("/image")
async def capture_image(image: UploadFile = File(...)):
    try:
        # 업로드된 파일을 읽어들입니다.
        image_bytes = await image.read()
        # 바이트 데이터를 NumPy 배열로 변환합니다.
        np_arr = np.frombuffer(image_bytes, np.uint8)
        # 이미지 디코딩 (이미지를 OpenCV 형식으로 변환)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
        if img is None:
            raise Exception("이미지 디코딩 실패")
        # 이미지를 메모리 버퍼로 인코딩 (JPEG 포맷으로 인코딩)
        success, image_encoded = cv2.imencode('.jpg', img)
        if not success:
            raise Exception("이미지 인코딩 실패")
        # 인코딩된 이미지를 업로드
        upload_result = upload_image2(image_encoded, image.filename, 'camera')
        return {"message": "이미지 업로드 성공", "image_src": upload_result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"이미지 처리 중 오류 발생: {str(e)}")



app = FastAPI()

@app.post("/ocr")
async def ocr_endpoint(request: OCRRequests):
    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(API_ENDPOINT, json=request.model_dump())
            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail="Error calling Preprocess API")
            response_data = response.json()

            result = ResultRequests(
                image_src=response_data.get("image_src"),
                ocr_img_src=response_data.get("ocr_img_src"),
                result_text=response_data.get("result_text")
            )

            # 현재 시간 (한국 시간)
            now_kst = datetime.now(KST)

            # TTL 설정을 위한 만료 시간 계산
            expire_time = now_kst + timedelta(minutes=1)
            expire_seconds = int((expire_time - now_kst).total_seconds())

            # Redis에 키 저장 및 TTL 설정
            key = f"{request.camera_idx}_{request.type}_{result.result_text}"

            print(key)
            if redis_client.exists(key):
                print(redis_client.ttl(key))
                raise HTTPException(status_code=200, detail=f"Duplicate License Plate {redis_client.ttl(key)}")

            connection = ''
            cursor = ''
            try:
                connection = psycopg2.connect(
                    dbname=db_name,
                    user=db_user,
                    password=db_password,
                    host=db_host,
                    port=db_port
                )
                cursor = connection.cursor()

                crackdown_time = KST.localize(datetime.strptime(request.time, "%Y%m%d%H%M%S%f"))

                # 킥보드를 이용한 사람을 업체를 통해 찾음
                select_query = '''
                SELECT name, phone
                FROM gcooter
                WHERE %s BETWEEN start_time AND end_time;
                '''

                cursor.execute(select_query, (now_kst, ))
                results = cursor.fetchall()
                if not results:
                    raise HTTPException(status_code=404, detail="Gcooter Not Found")

                # 킥보드를 이용한 member를 찾음
                select_query = '''
                SELECT idx
                FROM member
                WHERE name = %s AND phone = %s;
                '''
                name, phone = results[0]
                cursor.execute(select_query, (name, phone, ))
                results = cursor.fetchall()
                if not results:
                    raise HTTPException(status_code=404, detail="Memeber Not Found")
                accused_idx = results[0]

                # # CCTV 신고에 데이터 추가
                insert_query = '''
                INSERT INTO crackdown (cctv_idx, accused_idx, violation_type, image_src, crackdown_time, created_at)
                VALUES (%s, %s, %s, %s, %s, %s)
                '''
                data = (request.camera_idx, accused_idx[0], request.type, result.image_src, crackdown_time, now_kst)
                cursor.execute(insert_query, data)
                connection.commit()

            except HTTPException as http_exc:
                raise http_exc

            except Exception as error:
                raise HTTPException(status_code=500, detail="DataBase Error")  # 데이터베이스 예외 처리

            finally:
                if connection:
                    cursor.close()
                    connection.close()
                    # print("PostgreSQL 연결이 닫혔습니다.")

            await redis_client.setex(key, expire_seconds, 'processed')

            return {
                'cctv_idx': request.camera_idx,
                'accused_idx': accused_idx[0],
                'type': request.type,
                'image_src': result.image_src,
                'ocr_img_src': result.ocr_img_src,
                'crackdown_time': crackdown_time,
                'created_at': now_kst,
                'result': result.result_text
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing OCR: {str(e)}")