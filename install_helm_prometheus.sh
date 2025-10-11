#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# --- 0. Helm 설치 ---
echo "================================================="
echo "--- 0. Helm CLI 설치 시작 ---"
echo "================================================="

if ! command -v helm &> /dev/null
then
    echo "Helm CLI가 설치되어 있지 않습니다. 설치를 진행합니다."
    # 최신 버전의 Helm 설치 스크립트 다운로드 및 실행 (Linux/amd64 기준)
    curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3
    chmod 700 get_helm.sh
    ./get_helm.sh

    # 설치 스크립트 파일 삭제
    rm get_helm.sh
else
    echo "Helm CLI가 이미 설치되어 있습니다. 설치를 건너뜁니다."
fi

echo "✅ Helm CLI 설치 완료. 버전 확인:"
helm version

# --- 변수 설정 ---
NAMESPACE="monitoring"
RELEASE_NAME="prometheus-stack"
CHART_NAME="kube-prometheus-stack"
REPO_NAME="prometheus-community"
REPO_URL="https://prometheus-community.github.io/helm-charts"

# --- 1. Helm Repository 추가 및 업데이트 ---
echo "================================================="
echo "--- 1. Prometheus Helm Repository 추가 및 업데이트 ---"
echo "================================================="
helm repo add ${REPO_NAME} ${REPO_URL}
helm repo update

# --- 2. 네임스페이스 생성 ---
echo "================================================="
echo "--- 2. 네임스페이스 ${NAMESPACE} 생성 ---"
echo "================================================="
# 이미 존재하면 오류를 발생시키지 않도록 dry-run을 사용합니다.
kubectl create namespace ${NAMESPACE} --dry-run=client -o yaml | kubectl apply -f -

# --- 3. Prometheus Stack 설치 ---
echo "================================================="
echo "--- 3. ${CHART_NAME} (Prometheus/Grafana/Alertmanager) 설치 ---"
echo "================================================="

# --set 옵션을 사용하여 ServiceMonitor 연동에 필요한 레이블을 설정합니다.
helm install ${RELEASE_NAME} ${REPO_NAME}/${CHART_NAME} \
    --namespace ${NAMESPACE} \
    --set prometheus.prometheusSpec.serviceMonitorSelector.matchLabels.release=${RELEASE_NAME} \
    --wait # 모든 리소스가 준비될 때까지 대기

echo "================================================="
echo "✅ Prometheus Stack 설치가 완료되었습니다."
echo "================================================="

# --- 4. 설치된 리소스 확인 ---
echo "--- 4. 설치된 Pod 확인 ---"
kubectl get pods -n ${NAMESPACE}

# --- 5. Grafana 관리자 비밀번호 출력 ---
echo "--- 5. Grafana 관리자 비밀번호 (Admin Password) ---"
# base64 디코딩으로 비밀번호를 추출합니다.
GRAFANA_PASSWORD=$(kubectl get secret --namespace ${NAMESPACE} ${RELEASE_NAME}-grafana -o jsonpath="{.data.admin-password}" | base64 --decode)
echo "Username: admin"
echo "Password: ${GRAFANA_PASSWORD}"

# --- 6. 접근 명령어 안내 ---
echo ""
echo "--- 6. Prometheus와 Grafana 웹 UI 접속 명령어 (별도 실행 필요) ---"
echo "Prometheus UI (localhost:9090):"
echo "  kubectl --namespace ${NAMESPACE} port-forward svc/${RELEASE_NAME}-kube-prom-prometheus 9090:9090"
echo ""
echo "Grafana UI (localhost:3000):"
echo "  kubectl --namespace ${NAMESPACE} port-forward svc/${RELEASE_NAME}-grafana 3000:80"
echo "================================================="