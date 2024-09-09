FROM openjdk:17-jdk-slim

# tzdata 패키지 설치 및 타임존 설정
RUN apt-get update && apt-get install -y tzdata && \
    ln -snf /usr/share/zoneinfo/Asia/Seoul /etc/localtime && \
    echo Asia/Seoul > /etc/timezone && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Gradle로 빌드된 JAR 파일을 Docker 이미지로 복사
ARG JAR_FILE=build/libs/kickcap-0.0.1-SNAPSHOT.jar
COPY ${JAR_FILE} ourClass.jar

# 운영 및 개발에서 사용되는 환경 설정을 분리
ENTRYPOINT ["java", "-jar", "-Dspring.profiles.active=dev", "-Duser.timezone=Asia/Seoul", "/ourClass.jar"]
