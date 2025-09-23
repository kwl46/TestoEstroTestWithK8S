# 1. Python 3.9-slim 버전을 기반으로 이미지를 생성합니다.
FROM python:3.9-slim

# 2. 컨테이너 내의 작업 디렉토리를 /app으로 설정합니다.
WORKDIR /app

# 3. requirements.txt 파일을 컨테이너의 작업 디렉토리로 복사합니다.
COPY requirements.txt .

# 4. requirements.txt에 명시된 패키지들을 설치합니다.
RUN pip install --no-cache-dir -r requirements.txt

# 5. 백엔드 소스코드(main.py)를 컨테이너의 작업 디렉토리로 복사합니다.
COPY main.py .

# 6. 컨테이너의 8000번 포트를 외부에 노출합니다.
EXPOSE 8000

# 7. 컨테이너가 시작될 때 실행할 명령어를 정의합니다. Uvicorn 서버를 실행합니다.
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
