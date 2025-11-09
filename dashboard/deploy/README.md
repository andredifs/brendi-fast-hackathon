# 🚀 Quick Deploy Guide

## Deploy Rápido

```bash
# Da raiz do projeto
npm run deploy
```

## Requisitos

1. **Google Cloud CLI** instalado e configurado
   ```bash
   gcloud config set project fast-hackathon-andre
   gcloud auth login
   ```

2. **APIs habilitadas** (rodar uma vez)
   ```bash
   gcloud services enable cloudbuild.googleapis.com
   gcloud services enable run.googleapis.com
   gcloud services enable containerregistry.googleapis.com
   ```

## Comandos Disponíveis

```bash
# Deploy produção
npm run deploy

# Deploy staging
npm run deploy:dashboard:staging

# Ver logs
gcloud run logs tail brendi-fast-hackathon --region us-central1

# Ver URL do serviço
gcloud run services describe brendi-fast-hackathon \
  --region us-central1 \
  --format 'value(status.url)'
```

## 📖 Documentação Completa

Veja [DEPLOY.md](./DEPLOY.md) para instruções detalhadas, troubleshooting e comandos avançados.

## ⚡ Deploy Manual Rápido

```bash
# Build e deploy em um comando
gcloud builds submit --config dashboard/deploy/cloudbuild.yaml .
```

## 🔧 Customizar Deploy

```bash
gcloud builds submit \
  --config dashboard/deploy/cloudbuild.yaml \
  --substitutions=_MEMORY=1Gi,_MIN_INSTANCES=1,_MAX_INSTANCES=20 \
  .
```

## ❓ Problemas Comuns

**Erro de permissão**: 
```bash
gcloud auth login
gcloud auth application-default login
```

**Build falha**:
```bash
gcloud builds list --limit 5
gcloud builds log <BUILD_ID>
```

**Ver status do serviço**:
```bash
gcloud run services describe brendi-fast-hackathon --region us-central1
```

