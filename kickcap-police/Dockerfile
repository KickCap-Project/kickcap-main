FROM node:20.15 as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# ARG 선언 및 환경 변수 설정
ARG REACT_APP_KAKAO_MAP
ENV REACT_APP_KAKAO_MAP=${REACT_APP_KAKAO_MAP}

# 환경 변수가 빌드에 제대로 반영되는지 확인
RUN echo "REACT_APP_KAKAO_MAP=$REACT_APP_KAKAO_MAP" >> .env

# 빌드 실행
RUN npm run build

RUN rm .env

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]