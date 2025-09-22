# Personality Test 프로젝트 요약 및 할 일 목록

## 완료된 작업

### 1. 프로젝트 초기 설정
- React 기반의 프론트엔드 애플리케이션으로 프로젝트를 시작했습니다.

### 2. 백엔드 구현
- **FastAPI**를 사용하여 Python으로 백엔드 서버를 구축했습니다.
- 심리검사 점수를 받아 결과를 반환하는 `/result` API 엔드포인트를 구현했습니다.
- 결과는 '테토남', '테토녀', '에겐남', '에겐녀' 중 하나로 결정됩니다.

### 3. 프론트엔드-백엔드 연동
- 테스트 완료 후, React 앱이 백엔드 API를 호출하도록 수정했습니다.
- 백엔드로부터 받은 결과를 화면에 동적으로 표시하도록 연동했습니다.

### 4. 코드 및 설정 분리
- 유지보수 편의성을 위해 8개의 심리검사 질문을 `src/questions.json` 파일로 분리했습니다.

### 5. Docker 컨테이너화
- **`Dockerfile.backend`**: FastAPI 백엔드 서버용 Dockerfile을 작성했습니다.
- **`Dockerfile.frontend`**: React 프론트엔드 앱 빌드 및 Nginx 서빙을 위한 Multi-stage Dockerfile을 작성했습니다.
- **`nginx.conf`**: API 요청을 백엔드로 전달하는 리버스 프록시 설정을 추가하여 쿠버네티스 환경에 최적화했습니다.

### 6. 쿠버네티스(Kubernetes) 배포 준비
- `k8s` 디렉토리를 생성하고, 내부에 아래의 배포 설정 파일들을 작성하여 향후 쿠버네티스 환경으로 확장할 수 있는 기반을 마련했습니다.
  - `backend-deployment.yaml` / `backend-service.yaml`
  - `frontend-deployment.yaml` / `frontend-service.yaml`

---

## 앞으로 해야 할 일

### 1. Docker 이미지 빌드 및 푸시
- 각 디렉토리를 빌드 컨텍스트로 지정하여 프론트엔드와 백엔드 이미지를 빌드합니다.
- 빌드된 이미지를 Docker Hub와 같은 컨테이너 레지스트리에 푸시해야 합니다.

  - **백엔드 이미지 빌드 및 푸시:**
    ```bash
    docker build -t <your-registry>/personality-test-backend:latest -f backend/Dockerfile.backend backend/
    docker push <your-registry>/personality-test-backend:latest
    ```

  - **프론트엔드 이미지 빌드 및 푸시:**
    ```bash
    docker build -t <your-registry>/personality-test-frontend:latest -f frontend/Dockerfile.frontend frontend/
    docker push <your-registry>/personality-test-frontend:latest
    ```

### 2. 쿠버네티스 배포
- `k8s` 디렉토리의 `*-deployment.yaml` 파일들(`image` 필드)을 컨테이너 레지스트리에 푸시한 실제 이미지 주소로 수정해야 합니다.
- `kubectl apply -f k8s/` 명령어를 사용하여 준비된 매니페스트로 쿠버네티스 클러스터에 애플리케이션을 배포합니다.

### 3. 기능 개선
- **성별 선택 기능 추가**: 현재 백엔드에서 '남'/'녀'를 임의로 붙여주는 로직을 실제 사용자에게 성별을 입력받아 처리하도록 고도화할 수 있습니다.
- **결과 로직 정교화**: 현재는 T와 E 점수 단순 비교 로직입니다. 더 복합적인 기준을 적용하여 결과 유형을 정교화할 수 있습니다.
- **결과 저장**: 테스트 결과를 데이터베이스에 저장하여 통계를 내거나 사용자가 이전 결과를 다시 볼 수 있는 기능을 추가할 수 있습니다.

### 4. CI/CD 파이프라인 구축
- GitHub Actions, Jenkins 등을 사용하여 테스트, 이미지 빌드, 배포 과정을 자동화하는 CI/CD 파이프라인을 구축할 수 있습니다.
