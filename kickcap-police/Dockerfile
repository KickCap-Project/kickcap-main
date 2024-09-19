# 1. Node.js 20.15를 기반으로 하는 이미지에서 빌드
FROM node:20.15 AS build

# 2. 작업 디렉토리 설정
WORKDIR /app

# 3. 패키지 파일 복사 및 종속성 설치
COPY package.json package-lock.json ./
RUN npm install

# 4. 소스 코드 복사 및 빌드
COPY . .
RUN npm run build

# 5. 빌드된 애플리케이션을 Node.js로 실행
FROM node:20.15

# 6. 작업 디렉토리 설정
WORKDIR /app

# 7. 빌드된 애플리케이션 파일 복사
COPY --from=build /app/build /app/build

# 8. 애플리케이션 코드와 종속성 복사 (필요한 경우)
COPY package.json package-lock.json ./
RUN npm install --production

# 9. 애플리케이션 실행
CMD ["npx", "serve", "-s", "build", "-l", "5000"]

# 10. 컨테이너 포트 노출
EXPOSE 5000