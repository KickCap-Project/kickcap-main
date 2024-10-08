
spring properties
```
spring.application.name=kickcap

# PostgreSQL 설정
spring.datasource.url={postgresql}
spring.datasource.username={username}
spring.datasource.password={password}
spring.datasource.driver-class-name=org.postgresql.Driver

# Redis 설정
spring.data.redis.host={redis}
spring.data.redis.port={redis-port}

spring.jpa.properties.hibernate.jdbc.time_zone=Asia/Seoul

# JPA 설정
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true


# GOOGLE OAUTH 설정
spring.security.oauth2.client.registration.google.client-id=${GOOGLE_CLIENT_ID}
spring.security.oauth2.client.registration.google.client-secret=${GOOGLE_CLIENT_SECRET}
spring.security.oauth2.client.registration.google.scope=email
spring.security.oauth2.client.registration.google.authorization-grant-type=authorization_code
spring.security.oauth2.client.registration.google.client-name=Google

# Google Provider 설정
spring.security.oauth2.client.provider.google.authorization-uri=https://accounts.google.com/o/oauth2/auth
spring.security.oauth2.client.provider.google.token-uri=https://oauth2.googleapis.com/token
spring.security.oauth2.client.provider.google.user-info-uri=https://www.googleapis.com/oauth2/v3/userinfo

# Kakao 설정
spring.security.oauth2.client.registration.kakao.client-id=2970ceb3a1fcecf9371e8018846dbbc0
spring.security.oauth2.client.registration.kakao.client-secret=HKrAb2QgaIc0SKIZEPKzM0wnLOiVJiy3
spring.security.oauth2.client.registration.kakao.authorization-grant-type=authorization_code
spring.security.oauth2.client.registration.kakao.scope= account_email
spring.security.oauth2.client.registration.kakao.client-name=Kakao

# Kakao Provider 설정
spring.security.oauth2.client.provider.kakao.authorization-uri=https://kauth.kakao.com/oauth/authorize
spring.security.oauth2.client.provider.kakao.token-uri=https://kauth.kakao.com/oauth/token
spring.security.oauth2.client.provider.kakao.user-info-uri=https://kapi.kakao.com/v2/user/me
spring.security.oauth2.client.provider.kakao.user-info-authentication-method=header
spring.security.oauth2.client.registration.kakao.client-authentication-method=client_secret_post
spring.security.oauth2.client.provider.kakao.user-name-attribute=id



# Naver 설정
spring.security.oauth2.client.registration.naver.client-id=your-naver-client-id
spring.security.oauth2.client.registration.naver.client-secret=your-naver-client-secret
spring.security.oauth2.client.registration.naver.authorization-grant-type=authorization_code
spring.security.oauth2.client.registration.naver.scope=name, email
spring.security.oauth2.client.registration.naver.client-name=Naver

# Naver Provider 설정
spring.security.oauth2.client.provider.naver.authorization-uri=https://nid.naver.com/oauth2.0/authorize
spring.security.oauth2.client.provider.naver.token-uri=https://nid.naver.com/oauth2.0/token
spring.security.oauth2.client.provider.naver.user-info-uri=https://openapi.naver.com/v1/nid/me

# JWT 생성 비밀키 설정
jwt.secret_key={secretKey}

```

react .env
```
REACT_APP_BASE_URL={REACT_APP_BASE_URL}

REACT_APP_FCM_APIKEY={REACT_APP_FCM_APIKEY}
REACT_APP_FCM_AUTH_DOMAIN={REACT_APP_FCM_AUTH_DOMAIN}
REACT_APP_FCM_PROJECT_ID={REACT_APP_FCM_PROJECT_ID}
REACT_APP_FCM_STORAGE_BUCKET={REACT_APP_FCM_STORAGE_BUCKET}
REACT_APP_FCM_MESSAGING_SENDERID={ID}
REACT_APP_FCM_APPID={APPID}
REACT_APP_FCM_MEASUREMENT_ID={MEASUREMENT_ID}

REACT_APP_FCM_VAPID={FCM_VAPID}

REACT_APP_KAKAO_MAP={KAKAO_MAP}
REACT_APP_KAKAO_REST={REST}

REACT_APP_IMG_SERVER_BASE_URL={IMG_SERVER_BASE_URL}

REACT_APP_IMPORT = {APP_IMPORT}
```

```
REACT_APP_BASE_URL=${REACT_APP_BASE_URL}
REACT_APP_KAKAO_MAP=${REACT_APP_KAKAO_MAP}
REACT_APP_KAKAO_REST=${REACT_APP_KAKAO_REST}
REACT_APP_FCM_APIKEY=${REACT_APP_FCM_APIKEY}
REACT_APP_FCM_AUTH_DOMAIN=${REACT_APP_FCM_AUTH_DOMAIN}
REACT_APP_FCM_PROJECT_ID=${REACT_APP_FCM_PROJECT_ID}
REACT_APP_FCM_STORAGE_BUCKET=${REACT_APP_FCM_STORAGE_BUCKET}
REACT_APP_FCM_MESSAGING_SENDERID=${REACT_APP_FCM_MESSAGING_SENDERID}
REACT_APP_FCM_APPID=${REACT_APP_FCM_APPID}
REACT_APP_FCM_MEASUREMENT_ID=${REACT_APP_FCM_MEASUREMENT_ID}
REACT_APP_FCM_VAPID=${REACT_APP_FCM_VAPID}
```
