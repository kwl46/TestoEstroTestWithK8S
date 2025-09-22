# --- 1단계: React 앱 빌드 ---
FROM node:16-alpine as build

# 작업 디렉토리 설정
WORKDIR /app

# 의존성 설치를 위해 package.json과 package-lock.json 복사
COPY package.json ./
COPY package-lock.json ./

# npm 의존성 설치
RUN npm install

# 나머지 소스코드 복사
COPY . .

# React 앱 빌드
RUN npm run build

# --- 2단계: Nginx로 앱 서비스 ---
FROM nginx:stable-alpine

# 빌드 단계에서 생성된 결과물을 Nginx의 기본 html 디렉토리로 복사
COPY --from=build /app/build /usr/share/nginx/html

# 커스텀 Nginx 설정 파일 복사
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 80번 포트 노출
EXPOSE 80

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]
