# KICKCAP 킥보드 단속 플랫폼

### ✍🏻 프로젝트 설명:

- 현재 사회에서는 개인형 이동장치(PM)와 관련된 안전사고가 많이 대두되고 있습니다. 이에 수동적으로 이루어지는 킥보드 단속환경을 개선하고자 카메라에 학습된 AI모델을 연결하여 자동 단속시스템을 개발하였습니다.

- 저희 프로젝트는 킥보드 번호판을 통해 자동 단속의 가능성과 벌점 제도를 바탕으로 킥보드 단속의 개선방향을 제시하여 보다 나은 이용 문화를 도모하고 있습니다.

### 개발기간 :
- 2024.08.26 ~ 2024.10.11(7주)

### 개발환경 : 
- 배포 환경 : EC2 ubuntu(20.04.6)
- GPU 서버 : Ubuntu(20.04), Python3.9

### 기술스택 :
- 백엔드 : <img src="https://img.shields.io/badge/springboot-6DB33F?style=for-the-badge&logo=html5&logoColor=white"> <img src="https://img.shields.io/badge/spring%20security-6DB33F?style=for-the-badge&logo=spring-security&logoColor=white"> <img src="https://img.shields.io/badge/JPA%20(Hibernate)-00485B?style=for-the-badge&logo=Hibernate&logoColor=white"> <img src="https://img.shields.io/badge/PostgreSQL-00485B?style=for-the-badge&logo=PostgreSQL&logoColor=white"> <img src="https://img.shields.io/badge/redis-00485B?style=for-the-badge&logo=redis&logoColor=white"> <img src="https://img.shields.io/badge/AIOHTTP-00485B?style=for-the-badge&logo=AIOHTTP&logoColor=white"> <img src="https://img.shields.io/badge/fastapi-00485B?style=for-the-badge&logo=fastapi&logoColor=white"> 
- 프론트엔드 : <img src="https://img.shields.io/badge/React-6DB33F?style=for-the-badge&logo=React&logoColor=white"> <img src="https://img.shields.io/badge/fcm-00485B?style=for-the-badge&logo=firebase&logoColor=white"> 
- DevOps : <img src="https://img.shields.io/badge/Docker-6DB33F?style=for-the-badge&logo=Docker&logoColor=white"> <img src="https://img.shields.io/badge/Jenkins-6DB33F?style=for-the-badge&logo=Jenkins&logoColor=white"> <img src="https://img.shields.io/badge/nginx-6DB33F?style=for-the-badge&logo=nginx&logoColor=white"> <img src="https://img.shields.io/badge/haproxy-6DB33F?style=for-the-badge&logo=HaProxy&logoColor=white">

### 아키텍쳐 : 
![캡처](./imgs/architecture.png)

### 프로젝트 설치 및 실행방법 :
- Police Front
```
cd kickcap-police
npm install
npm start
```

- User Front
```
cd kickcap-user
npm install
npm start
```

- Backend docker-compose
```
services:
  api:
    image: parkbeong/kickcap:latest
    container_name: kickcap-8080
    environment:
      SPRING_DATASOURCE_URL: {postgreSQL}
      SPRING_DATASOURCE_USERNAME: {dbId}
      SPRING_DATASOURCE_PASSWORD: {dbId}
      SPRING_DATA_REDIS_HOST: {redis}
      SPRING_DATA_REDIS_PORT: {redis:port}
      BASE_URL: {BASE_URL}
      GOOGLE_CLIENT_ID: {GOOGLE_CLIENT_ID}
      GOOGLE_CLIENT_SECRET: {GOOGLE_CLIENT_SECRET}
      KAKAO_CLIENT_ID: {KAKAO_CLIENT_ID}
      KAKAO_CLIENT_SECRET: {KAKAO_CLIENT_SECRET}
      BASE64_SECRET_KEY: {BASE64_SECRET_KEY}
      SPRING_JPA_HIBERNATE_DDL_AUTO: update
      NAVER_CLIENT_ID: {NAVER_CLIENT_ID}
      NAVER_CLIENT_SECRET: {NAVER_CLIENT_SECRET}
      redirect_uri: {redirect_uri}
    ports:
      - '8080:8080'
    networks:
      - shared-network

networks:
  shared-network:
    external: true
```

- DB docker-compose
```
version: '3.3'

services:
  db:
    image: postgres:latest
    container_name: postgres-db
    environment:
      POSTGRES_DB: kickcap
      POSTGRES_USER: {POSTGRES_USER}
      POSTGRES_PASSWORD: {POSTGRES_PASSWORD}
    volumes:
      - db-data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    networks:
      - shared-network

  redis:
    image: redis:latest
    container_name: redis
    ports:
      - "6379:6379"
    networks:
      - shared-network

volumes:
  db-data:

networks:
  shared-network:
    external: true
```

-GPU BackEnd
```
cd ai/gpu
pip install torch==1.13.1 torchvision==0.14.1 torchaudio==0.13.1 --index-url https://download.pytorch.org/whl/cu117
pip install -r requirements.txt

uvicorn get_image_api:app --host 0.0.0.0 --port 8765
uvicorn detect_api:app --host 0.0.0.0 --port 9876
```

### 팀원소개 : 

|                      이름                      |      역할       | 소감                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| :--------------------------------------------: | :-------------: | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|  ![박민지](./imgs/박민지.jpg)<br>박민지  |    팀장(BE)     | 소감쓰세요                                                                                                                     |
| ![오진영](./imgs/오진영.jpg) <br> 오진영 |     FE 리더     | 프로젝트를 하면서 처음에는 어떻게 해야할까 고민과 걱정이 많았지만 그래도 결과가 나오고 하나씩 적용이 되다보니 <br> 뿌듯함도 많이 느꼈습니다. 아마 이번 프로젝트가 졸작때보다 기간때문인지 더 힘들다고 느꼈습니다. <br> 앞으로의 프로젝트도 힘들겠지만 그래도 재미있는 프로젝트들이라서 기대가 됩니다. B310 모두 수고했습니다~                                                                                                                                        |
| ![유현진](./imgs/유현진.jpg) <br>유현진  | BE  | 소감쓰세요                                                                                                                                                                                                                                                                                                   |
| ![정동찬](./imgs/정동찬.jpg) <br> 정동찬 |     FE      | 소감쓰세요                                                                                                                                                           |
| ![박병준](./imgs/박병준.jpg) <br>박병준  |       인프라        | 감회가 깊었습니다. |
| ![김종원](./imgs/김종원.jpg) <br>김종원  |       AI        | 살려주세요                                                                                                                                                                                                                                                              |                                                                                                                                                      |

