#!/bin/bash

# Script de deploy simplificado para Brendi Fast Hackathon
# Uso: ./deploy.sh [environment]
# environment: staging, production (default: production)

set -e

ENVIRONMENT=${1:-production}
PROJECT_ID="fast-hackathon-andre"
SERVICE_NAME="brendi-fast-hackathon"
REGION="us-central1"

# Configurações baseadas no environment
if [ "$ENVIRONMENT" = "staging" ]; then
    ENVIRONMENT_SUFFIX="-staging"
    MEMORY="512Mi"
    MIN_INSTANCES="0"
    MAX_INSTANCES="5"
elif [ "$ENVIRONMENT" = "production" ]; then
    ENVIRONMENT_SUFFIX=""
    MEMORY="512Mi"
    MIN_INSTANCES="0"
    MAX_INSTANCES="1"
else
    echo "❌ Ambiente inválido: $ENVIRONMENT"
    echo "   Use 'staging' ou 'production'"
    exit 1
fi

echo "🚀 Deploy: $SERVICE_NAME$ENVIRONMENT_SUFFIX"
echo "📋 Config: $MEMORY RAM, $MIN_INSTANCES-$MAX_INSTANCES instâncias"
echo ""

# Verificar gcloud
if ! command -v gcloud &> /dev/null; then
    echo "❌ gcloud CLI não encontrado"
    echo "   Instale: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Verificar autenticação
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo "❌ Não autenticado no gcloud"
    echo "   Execute: gcloud auth login"
    exit 1
fi

# Configurar projeto
gcloud config set project $PROJECT_ID

# Deploy via Cloud Build
echo "☁️ Iniciando deploy..."

gcloud builds submit \
  --config dashboard/deploy/cloudbuild.yaml \
  --substitutions=_ENVIRONMENT=$ENVIRONMENT,_ENVIRONMENT_SUFFIX=$ENVIRONMENT_SUFFIX,_MEMORY=$MEMORY,_MIN_INSTANCES=$MIN_INSTANCES,_MAX_INSTANCES=$MAX_INSTANCES \
  .

echo ""
echo "✅ Deploy concluído!"
echo "🌐 URL do serviço:"
gcloud run services describe $SERVICE_NAME$ENVIRONMENT_SUFFIX \
  --region $REGION \
  --format 'value(status.url)' 2>/dev/null || echo "   Execute: gcloud run services describe $SERVICE_NAME$ENVIRONMENT_SUFFIX --region $REGION"
