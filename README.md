# 성향 테스트 프로젝트 (Personality Test)

간단한 질문들을 통해 사용자의 성향을 분석하는 웹 애플리케이션입니다. React로 제작된 프론트엔드와 Python 기반의 백엔드 API로 구성되어 있으며, Docker와 Kubernetes를 통해 AWS EC2 환경에 배포됩니다.

## ✨ 주요 기능

*   **성향 테스트**: 성향을 분석하기 위한 질문지를 제공하고 결과를 분석합니다.
*   **컨테이너 기반**: Docker를 사용하여 개발 및 배포 환경을 일치시킵니다.
*   **쿠버네티스 배포**: Kubernetes를 통해 안정적이고 확장 가능한 서비스 운영이 가능합니다.
*   **CI/CD 자동화**: GitHub Actions를 활용하여 프론트엔드와 백엔드의 CI/CD 파이프라인을 구축합니다.
*   **모니터링**: Prometheus와 Grafana을 이용해 쿠버네티스 클러스터의 상태를 모니터링합니다.
*   **오토스케일링**: 지정한 리밋을 기준으로 Pod를 오토스케일링 합니다.

**CI/CD 흐름**
*   **Frontend**: `main` 브랜치 Push -> GitHub Actions 실행 -> React 앱 빌드 -> AWS S3 버킷에 업로드
*   **Backend**: `main` 브랜치 Push -> GitHub Actions 실행 -> Docker 이미지 빌드 및 Push

## 🛠️ 기술 스택

### Frontend
*   React.js

### Backend
*   Python (FastAPI)

### DevOps & Infrastructure
*   AWS S3 (Frontend)
*   AWS EC2
*   Kubernetes
*   Docker & Docker Compose
*   Prometheus (모니터링)
*   GitHub Actions (CI/CD)
*   HPA

## 🚢 배포

이 프로젝트는 GitHub Actions를 통해 프론트엔드와 백엔드가 각각 다른 방식으로 자동 배포됩니다.

*   **Frontend**: React 애플리케이션은 빌드된 후 정적 파일 형태로 **AWS S3 버킷**에 업로드되어 정적 웹 사이트 호스팅을 통해 제공됩니다.
*   **Backend**: Python 애플리케이션은 Docker 이미지로 빌드되어 컨테이너 레지스트리에 푸시된 후, **AWS EC2 기반의 Kubernetes 클러스터**에 배포됩니다.

### 세부 설정
*   **CI/CD 워크플로우**: `.github/workflows` 디렉토리의 `frontend-ci.yml`과 `backend-ci.yml` 파일에 각 배포 파이프라인이 정의되어 있습니다.
*   **Kubernetes 설정**: `k8s` 디렉토리의 YAML 파일들을 통해 백엔드 Pod, Service 등이 관리됩니다.
*   **모니터링 설정**: `install_helm_prometheus.sh` 스크립트를 사용하여 클러스터에 Prometheus를 설치하고, `k8s/prometheus.yaml` 설정으로 모니터링 대상을 지정합니다.

## 📁 디렉토리 구조

```
.
├── backend/         # Python 백엔드 소스코드 및 Dockerfile
├── frontend/        # React 프론트엔드 소스코드 및 Nginx 설정
├── k8s/             # Kubernetes 배포용 YAML 파일
├── .github/         # GitHub Actions CI/CD 워크플로우
├── docker-compose.yml # 로컬 개발 환경 설정
└── README.md        # 프로젝트 소개
```
