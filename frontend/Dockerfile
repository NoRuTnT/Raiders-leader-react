# 고정된 이미지를 기반으로 시작
FROM node:20.15.0

# 작업 디렉토리 설정
WORKDIR /usr/src/app

# 패키지 관리 파일만 COPY (코드보다 먼저 복사)
COPY package*.json ./

# 의존성 설치 (캐싱 활용 가능)
RUN npm install

# 애플리케이션 소스 코드 복사
COPY . .

# 실행 명령어 설정
CMD ["npm", "start"]
EXPOSE 3000