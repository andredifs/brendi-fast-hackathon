# 🚀 Deploy do Brendi Fast Hackathon Dashboard

Este documento descreve como fazer deploy da aplicação no Google Cloud Run.

## 📋 Pré-requisitos

- [Google Cloud SDK](https://cloud.google.com/sdk/docs/install) instalado
- [Docker](https://docs.docker.com/get-docker/) instalado (para testes locais)
- Acesso ao projeto `fast-hackathon-andre` no Google Cloud
- Autenticação configurada: `gcloud auth login`

## 🔧 Configuração Inicial

### 1. Configurar projeto
```bash
gcloud config set project fast-hackathon-andre
```

### 2. Habilitar APIs necessárias
```bash
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
gcloud services enable artifactregistry.googleapis.com
```

### 3. Configurar autenticação do Docker
```bash
gcloud auth configure-docker
```

## 🚀 Deploy

### Método 1: Deploy via Cloud Build (Recomendado)

```bash
# Deploy para produção (da raiz do projeto)
gcloud builds submit --config dashboard/deploy/cloudbuild.yaml .

# Deploy para staging
gcloud builds submit \
  --config dashboard/deploy/cloudbuild.yaml \
  --substitutions=_ENVIRONMENT=staging,_ENVIRONMENT_SUFFIX=-staging,_MEMORY=512Mi,_MIN_INSTANCES=0 \
  .
```

### Método 2: Deploy via Scripts npm

Adicione estes scripts ao `package.json` da raiz do projeto:

```json
{
  "scripts": {
    "deploy:dashboard": "gcloud builds submit --config dashboard/deploy/cloudbuild.yaml .",
    "deploy:dashboard:staging": "gcloud builds submit --config dashboard/deploy/cloudbuild.yaml --substitutions=_ENVIRONMENT=staging,_ENVIRONMENT_SUFFIX=-staging,_MEMORY=512Mi,_MIN_INSTANCES=0 ."
  }
}
```

Então execute:
```bash
npm run deploy:dashboard
```

### Método 3: Build e Deploy Manual

```bash
# 1. Build da imagem localmente
cd dashboard
docker build -f deploy/Dockerfile -t brendi-fast-hackathon-dashboard .

# 2. Tag da imagem
docker tag brendi-fast-hackathon-dashboard \
  gcr.io/fast-hackathon-andre/brendi-fast-hackathon-dashboard:latest

# 3. Push para Container Registry
docker push gcr.io/fast-hackathon-andre/brendi-fast-hackathon-dashboard:latest

# 4. Deploy no Cloud Run
gcloud run deploy brendi-fast-hackathon \
  --image gcr.io/fast-hackathon-andre/brendi-fast-hackathon-dashboard:latest \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10
```

## 🌐 URLs

Após o deploy, a aplicação estará disponível em:
- **Produção**: `https://brendi-fast-hackathon-<hash>.us-central1.run.app`
- **Staging**: `https://brendi-fast-hackathon-staging-<hash>.us-central1.run.app`

Para obter a URL exata:
```bash
gcloud run services describe brendi-fast-hackathon --region us-central1 --format 'value(status.url)'
```

## 🧪 Teste Local com Docker

```bash
# Build da imagem
cd dashboard
docker build -f deploy/Dockerfile -t brendi-dashboard-local .

# Rodar localmente
docker run -p 8080:8080 \
  -e NODE_ENV=production \
  brendi-dashboard-local

# Testar
curl http://localhost:8080
```

## 🔧 Environments

### Produção (default)
- **Serviço**: `brendi-fast-hackathon`
- **Memória**: 512Mi
- **CPU**: 1
- **Instâncias**: 0-10 (auto-scaling)
- **Concorrência**: 80 requests por instância

### Staging
- **Serviço**: `brendi-fast-hackathon-staging`
- **Memória**: 512Mi
- **CPU**: 1
- **Instâncias**: 0-5 (auto-scaling)
- **Concorrência**: 80 requests por instância

### Personalizando o Deploy

Use `--substitutions` para customizar:

```bash
gcloud builds submit \
  --config dashboard/deploy/cloudbuild.yaml \
  --substitutions=_ENVIRONMENT=dev,\
_ENVIRONMENT_SUFFIX=-dev,\
_MEMORY=256Mi,\
_CPU=1,\
_MIN_INSTANCES=0,\
_MAX_INSTANCES=5,\
_CONCURRENCY=50 \
  .
```

## 📊 Monitoramento

### Ver Logs em Tempo Real
```bash
gcloud run logs tail brendi-fast-hackathon --region us-central1
```

### Ver Logs Históricos
```bash
gcloud run logs read brendi-fast-hackathon \
  --region us-central1 \
  --limit 100
```

### Ver Métricas
```bash
# Status do serviço
gcloud run services describe brendi-fast-hackathon --region us-central1

# Listar revisões
gcloud run revisions list \
  --service brendi-fast-hackathon \
  --region us-central1
```

## 🔄 Rollback

```bash
# Listar revisões
gcloud run revisions list \
  --service brendi-fast-hackathon \
  --region us-central1

# Fazer rollback para revisão específica
gcloud run services update-traffic brendi-fast-hackathon \
  --to-revisions <REVISION_NAME>=100 \
  --region us-central1
```

## 🛠️ Troubleshooting

### Build Falha

1. **Verificar logs do Cloud Build**:
   ```bash
   gcloud builds list --limit 5
   gcloud builds log <BUILD_ID>
   ```

2. **Limpar cache local**:
   ```bash
   cd dashboard
   rm -rf node_modules .output .nuxt
   npm install
   npm run build
   ```

### Erro de Permissões

```bash
# Adicionar permissões necessárias
gcloud projects add-iam-policy-binding fast-hackathon-andre \
  --member="user:seu-email@gmail.com" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding fast-hackathon-andre \
  --member="user:seu-email@gmail.com" \
  --role="roles/cloudbuild.builds.editor"
```

### Serviço Não Responde

1. **Verificar logs**:
   ```bash
   gcloud run logs tail brendi-fast-hackathon --region us-central1
   ```

2. **Verificar health check**:
   ```bash
   curl https://<SERVICE_URL>/
   ```

3. **Aumentar recursos**:
   ```bash
   gcloud run services update brendi-fast-hackathon \
     --memory 1Gi \
     --cpu 2 \
     --region us-central1
   ```

## 🧹 Limpeza

### Deletar Serviço
```bash
gcloud run services delete brendi-fast-hackathon --region us-central1
```

### Deletar Imagens Antigas
```bash
# Listar imagens
gcloud container images list-tags \
  gcr.io/fast-hackathon-andre/brendi-fast-hackathon-dashboard

# Deletar imagem específica
gcloud container images delete \
  gcr.io/fast-hackathon-andre/brendi-fast-hackathon-dashboard:TAG
```

## 📚 Comandos Úteis

```bash
# Status completo do serviço
gcloud run services describe brendi-fast-hackathon \
  --region us-central1 \
  --format yaml

# Listar todos os serviços
gcloud run services list --region us-central1

# Ver IAM policies
gcloud run services get-iam-policy brendi-fast-hackathon \
  --region us-central1

# Atualizar variáveis de ambiente
gcloud run services update brendi-fast-hackathon \
  --update-env-vars KEY=VALUE \
  --region us-central1

# Escalar manualmente
gcloud run services update brendi-fast-hackathon \
  --min-instances 1 \
  --max-instances 20 \
  --region us-central1
```

## 🔗 Links Úteis

- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Cloud Build Documentation](https://cloud.google.com/build/docs)
- [Nuxt on Cloud Run](https://nuxt.com/deploy/google-cloud)
- [Container Registry](https://cloud.google.com/container-registry/docs)
