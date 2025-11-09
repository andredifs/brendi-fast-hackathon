# 🧠 Gestão Web + Agent · Hackathon Brendi

> Dashboard web integrado com agente LLM para análise de dados e gestão inteligente de restaurantes.

[![Nuxt UI](https://img.shields.io/badge/Made%20with-Nuxt%20UI-00DC82?logo=nuxt&labelColor=020420)](https://ui.nuxt.com)

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Áreas de Gestão](#áreas-de-gestão)
- [Tecnologias Escolhidas](#tecnologias-escolhidas)
- [Arquitetura](#arquitetura)
- [Estrutura do Repositório](#estrutura-do-repositório)
- [Setup e Desenvolvimento](#setup-e-desenvolvimento)
- [Deploy](#deploy)
- [Decisões Técnicas](#decisões-técnicas)

---

## 📖 Sobre o Projeto

### Contexto

Este projeto foi desenvolvido para o Hackathon Brendi com foco em resolver uma dor crítica: **donos de restaurantes não têm conhecimento técnico para extrair insights profundos dos dados do próprio negócio**.

### Solução

Um sistema de gestão inteligente que:

1. **Dashboard Web**: Visualização clara e objetiva de métricas-chave do restaurante
2. **Agent LLM Reativo**: Chat inteligente para responder perguntas sobre o negócio em linguagem natural
3. **Agent LLM Proativo**: Disparos automáticos via WhatsApp com insights diários e alertas importantes

### Princípios de UX

- **"O que olhar hoje?"**: Insights priorizados por relevância sempre visíveis
- **Linguagem Simples**: Comunicação comparativa e acessível (vs período anterior, média histórica)
- **CTA Claro**: Ações objetivas ("ver detalhe", "abrir gráfico", "investigar causa")
- **Pensamento pela Pessoa**: O sistema analisa, compara e sugere — o dono decide

---

## 🎯 Áreas de Gestão

O sistema aborda 4 áreas fundamentais de gestão de restaurantes:

### 1. 📊 Vendas
**Perguntas-chave:**
- Estou vendendo mais ou menos que o período anterior?
- Qual canal/horário/produto está puxando o resultado?
- Há oportunidades ou problemas escondidos nos dados?

**Métricas:**
- Faturamento total e comparativo
- Ticket médio e evolução
- Volume de pedidos
- Performance por canal, horário, dia da semana

### 2. 💬 Feedbacks
**Perguntas-chave:**
- Como está a satisfação dos clientes?
- Quais são as principais reclamações?
- Há feedbacks críticos que precisam de ação imediata?

**Métricas:**
- NPS e distribuição de notas
- Volume e sentimento de feedbacks
- Tópicos mais mencionados
- Alertas de feedbacks negativos

### 3. 🍕 Cardápio
**Perguntas-chave:**
- Quais itens estão vendendo bem/mal?
- Há oportunidades de otimização do menu?
- Como os eventos de cardápio (visualizações, adições ao carrinho) se convertem em vendas?

**Métricas:**
- Eventos de cardápio (views, add_to_cart)
- Taxa de conversão por item
- Performance de categorias
- Itens mais/menos populares

### 4. 👥 Clientes
**Perguntas-chave:**
- Estou conquistando novos clientes ou dependendo de recorrentes?
- Como está a retenção e frequência de compra?
- Qual o perfil dos meus melhores clientes?

**Métricas:**
- Novos vs recorrentes
- Taxa de retenção
- Frequência de compra
- LTV (Lifetime Value)

---

## 🛠 Tecnologias Escolhidas

### Visão Geral

A stack foi escolhida priorizando **produtividade**, **robustez** e **escalabilidade**, mantendo baixa complexidade operacional.

### Frontend

#### **Nuxt 4 + Vue 3**
**Por quê:**
- Framework full-stack que une frontend e backend (server routes) em um único monólito bem estruturado
- SSR nativo para melhor performance e SEO
- Sistema de rotas automático baseado em arquivos
- TypeScript first-class
- Excelente DX (Developer Experience)

**Trade-offs:**
- ✅ Reduz drasticamente a complexidade de manter dois repositórios separados
- ✅ Compartilhamento de tipos entre cliente e servidor
- ✅ Deploy unificado e mais simples
- ⚠️ Menos modular que microsserviços (aceitável para o escopo)

#### **Nuxt UI**
**Por quê:**
- Biblioteca de componentes moderna e completa
- Design system consistente out-of-the-box
- Componentes otimizados para dashboards
- Integração perfeita com Nuxt
- Modo escuro nativo

**Trade-offs:**
- ✅ Acelera desenvolvimento de UI
- ✅ Mantém consistência visual sem esforço
- ✅ Acessibilidade built-in
- ⚠️ Menos customização visual que um design system próprio (não é problema para este projeto)

#### **Unovis + VueUse**
**Por quê:**
- **Unovis**: Biblioteca de visualização de dados leve e performática
- **VueUse**: Collection de composables Vue essenciais (date handling, window events, etc)

**Trade-offs:**
- ✅ Gráficos responsivos e bonitos com pouco código
- ✅ Composables reutilizáveis reduzem boilerplate
- ✅ Tree-shakeable para bundle menor

### Backend

#### **Firebase Functions (Cloud Functions)**
**Por quê:**
- Serverless: zero preocupação com infraestrutura
- Escala automaticamente
- Pay-per-use (ideal para hackathon e MVP)
- Integração nativa com Firestore
- Node.js 20 com suporte completo a TypeScript

**Trade-offs:**
- ✅ Deploy simples e rápido
- ✅ Custos baixos em produção
- ✅ Monitoramento integrado
- ⚠️ Cold start latency (mitigável com min instances)
- ⚠️ Menos controle sobre runtime (aceitável para o escopo)

#### **Express.js**
**Por quê:**
- Framework minimalista e robusto para APIs HTTP
- Ecosystem maduro
- Middleware pattern para separação de responsabilidades
- Fácil de testar

### Banco de Dados

#### **Firestore (GCP)**
**Por quê:**
- NoSQL document-based com consultas flexíveis
- Escala horizontal automaticamente
- Real-time subscriptions (útil para chat e notificações)
- Modelagem por namespace de restaurante natural
- Excelente para iteração rápida

**Trade-offs:**
- ✅ Schema-less permite evoluir modelo rapidamente
- ✅ Queries simples e previsíveis (sem JOINs complexos)
- ✅ Custo baseado em reads/writes (controlável)
- ⚠️ Denormalização necessária (design intencional)
- ⚠️ Não ideal para analytics complexo (resolvido com materializações)

**Estratégia de Modelagem:**
- Namespace por restaurante: `restaurants/{restaurantId}/...`
- Denormalização controlada para reduzir leituras
- Materializações de agregados (diários, semanais)
- Índices planejados para queries por período

### LLM & Agent

#### **Vercel AI SDK + OpenAI**
**Por quê:**
- **Vercel AI SDK**: Abstração provider-agnostic para LLMs (fácil trocar OpenAI → Anthropic → etc)
- **Tool Calling**: Padrão para LLM invocar funções no servidor (determinismo)
- **Streaming**: Respostas em tempo real para melhor UX
- **OpenAI**: Melhor custo-benefício para uso geral

**Trade-offs:**
- ✅ SDK abstrai complexidade de integração com LLMs
- ✅ Tool calling mantém lógica de negócio no servidor (testável, seguro)
- ✅ Fácil experimentar com diferentes providers
- ✅ Streaming melhora percepção de velocidade
- ⚠️ Dependência de API externa (mitigável com fallbacks)

**Arquitetura do Agent:**
- **Determinismo**: Regras e cálculos no servidor, LLM apenas para linguagem natural
- **Tools**: Funções TypeScript que o LLM pode invocar (getKPIs, getInsights, listEvents, etc)
- **Custo**: Prompts curtos, reusar insights já gerados, evitar regenerações desnecessárias

#### **WhatsApp (Z-API)**
**Por quê:**
- Canal preferido de comunicação dos donos de restaurante no Brasil
- Z-API é uma abstração robusta sobre WhatsApp Business API
- Permite envio de mensagens, templates e disparos em massa

**Trade-offs:**
- ✅ Alcance imediato (dono sempre tem WhatsApp aberto)
- ✅ UX familiar (não precisa aprender nova ferramenta)
- ✅ Notificações proativas sem app mobile
- ⚠️ Dependência de serviço terceiro (Z-API)
- ⚠️ Limitações de rate limit (aceitável para o volume)

### Deploy & CI/CD

#### **Google Cloud Run**
**Por quê:**
- Serverless containers
- Escala automaticamente de 0 a N
- Suporta qualquer linguagem/runtime (via Docker)
- Pay-per-use com controle fino (CPU, memória, min/max instances)
- Integração nativa com GCP (Cloud Build, Firestore, Secret Manager)

**Trade-offs:**
- ✅ Deploy simples via `gcloud builds submit`
- ✅ Zero downtime deployments
- ✅ Custom domains fácil
- ✅ Logs e monitoring integrados
- ⚠️ Lock-in GCP moderado (mitigável com Docker)

#### **Cloud Build**
**Por quê:**
- CI/CD nativo do GCP
- Build baseado em `cloudbuild.yaml` (infra as code)
- Cache de layers Docker
- Deploy automático para Cloud Run

**Trade-offs:**
- ✅ Configuração declarativa
- ✅ Fast builds com cache
- ✅ Secrets management integrado
- ⚠️ Menos features que GitHub Actions (suficiente para o escopo)

### Desenvolvimento

#### **TypeScript**
**Por quê:**
- Type safety em todo o stack (frontend, backend, functions)
- Refatoração segura
- Autocompletar e IntelliSense
- Documentação viva via tipos

#### **ESLint + Prettier**
**Por quê:**
- Código consistente
- Catch errors cedo
- Formato automático

#### **Monorepo Workspaces**
**Por quê:**
- Gerenciamento unificado de dependências
- Scripts centralizados
- Fácil compartilhar código entre dashboard e functions

---

## 🏗 Arquitetura

### Diagrama de Alto Nível

```
┌─────────────────────────────────────────────────────────────┐
│                         USUÁRIO                             │
│                    (Dono do Restaurante)                    │
└────────────┬────────────────────────────┬───────────────────┘
             │                            │
             │ Browser                    │ WhatsApp
             ▼                            ▼
┌────────────────────────┐   ┌──────────────────────────────┐
│   Dashboard (Nuxt 4)   │   │   Z-API (WhatsApp Gateway)   │
│                        │   │                              │
│  • Vue 3 + Nuxt UI     │   │  • Recebe mensagens          │
│  • Gráficos (Unovis)   │   │  • Envia disparos            │
│  • Chat Interface      │   └──────────────┬───────────────┘
│                        │                  │
│  Server Routes (API):  │                  │
│  • /api/events         │                  │
│  • /api/insights       │                  │
│  • /api/chat           │◄─────────────────┘
└────────────┬───────────┘
             │
             │ HTTP
             ▼
┌────────────────────────────────────────────────────────────┐
│              Firebase Functions (Serverless)               │
│                                                            │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐ │
│  │   Events     │  │  Messaging   │  │     Agent       │ │
│  │              │  │              │  │                 │ │
│  │ • List       │  │ • Send       │  │ • Tool Calling  │ │
│  │ • Get        │  │ • Receive    │  │ • LLM Router    │ │
│  │ • Filter     │  │ • Templates  │  │ • Tools:        │ │
│  └──────────────┘  └──────────────┘  │   - getKPIs     │ │
│                                       │   - getInsights │ │
│                                       │   - getEvents   │ │
│                                       └─────────────────┘ │
└────────────┬──────────────────────────────┬────────────────┘
             │                              │
             │ Firestore Client             │ OpenAI API
             ▼                              ▼
┌─────────────────────────┐    ┌──────────────────────────┐
│  Firestore (Database)   │    │   OpenAI GPT-4          │
│                         │    │                          │
│  restaurants/{id}/      │    │  • Chat Completions      │
│  • orders               │    │  • Tool Calling          │
│  • feedbacks            │    │  • Streaming             │
│  • menu_events          │    └──────────────────────────┘
│  • insights             │
│  • messages             │
└─────────────────────────┘
```

### Fluxo de Dados

#### 1. **Dashboard → Métricas**
```
User abre Dashboard
  → Nuxt SSR renderiza layout
  → Client faz fetch para /api/events
  → Server route consulta Firestore
  → Agrega dados em memória
  → Retorna JSON
  → Vue renderiza gráficos (Unovis)
```

#### 2. **Chat Reativo**
```
User envia mensagem no chat
  → POST /api/chat
  → Agent recebe pergunta
  → LLM analisa e decide tool(s) a usar
  → Server executa tool (ex: getKPIs)
  → Consulta Firestore
  → Retorna dados para LLM
  → LLM gera resposta em linguagem natural
  → Stream de texto para client
  → Vue renderiza resposta
```

#### 3. **WhatsApp Proativo**
```
Cloud Scheduler dispara HTTP (diariamente)
  → POST /messaging/send-daily-insights
  → Busca insights do período no Firestore
  → Prioriza por severidade/relevância
  → Formata mensagem curta e clara
  → POST para Z-API
  → Z-API envia para WhatsApp do dono
  → Dono recebe notificação
```

### Separação de Responsabilidades

#### **Dashboard (Nuxt)**
- **Frontend**: Componentes Vue, layouts, pages
- **Server Routes**: API endpoints leves (proxy para functions quando necessário)
- **Composables**: Lógica reutilizável (useDashboard, useChat)

#### **Functions**
- **Events**: CRUD de eventos de menu (views, add_to_cart, etc)
- **Messaging**: Integração com Z-API (send, receive, webhooks)
- **Agent**: Lógica do LLM agent (tools, routing, context management)
- **Clients**: Abstrações para serviços externos (Firestore, Z-API, OpenAI)

#### **Firestore**
- **Armazenamento**: Documentos JSON por entidade
- **Consultas**: Queries por período, restaurante, tipo
- **Materializações**: Agregados pré-calculados para performance

---

## 📁 Estrutura do Repositório

```
brendi-fast-hackathon/
│
├── dashboard/                      # Frontend Nuxt 4
│   ├── app/
│   │   ├── assets/
│   │   │   └── css/
│   │   │       └── main.css        # Estilos globais
│   │   │
│   │   ├── components/             # Componentes Vue
│   │   │   ├── home/               # Componentes da página inicial
│   │   │   │   ├── HomeChart.client.vue
│   │   │   │   ├── HomeDateRangePicker.vue
│   │   │   │   ├── HomePeriodSelect.vue
│   │   │   │   ├── HomeMenuEventsStats.vue
│   │   │   │   └── HomeMenuEventsTable.vue
│   │   │   ├── NotificationsSlideover.vue
│   │   │   ├── TeamsMenu.vue
│   │   │   └── UserMenu.vue
│   │   │
│   │   ├── composables/            # Composables Vue
│   │   │   └── useDashboard.ts
│   │   │
│   │   ├── layouts/                # Layouts
│   │   │   └── default.vue
│   │   │
│   │   ├── pages/                  # Páginas (rotas automáticas)
│   │   │   ├── index.vue           # Dashboard principal
│   │   │   └── settings/           # (páginas de configurações)
│   │   │
│   │   ├── types/                  # TypeScript types
│   │   │   └── index.d.ts
│   │   │
│   │   ├── utils/                  # Utilitários
│   │   │   ├── api-client.ts       # Cliente HTTP
│   │   │   └── index.ts
│   │   │
│   │   ├── app.config.ts           # Config da aplicação
│   │   └── app.vue                 # Root component
│   │
│   ├── server/                     # API Server Routes (Nuxt)
│   │   └── api/
│   │       ├── events.ts           # GET /api/events
│   │       └── events/
│   │           └── [id].ts         # GET /api/events/:id
│   │
│   ├── deploy/                     # Config de deploy
│   │   ├── cloudbuild.yaml         # Cloud Build config
│   │   ├── Dockerfile              # Container image
│   │   ├── DEPLOY.md               # Docs de deploy
│   │   └── README.md
│   │
│   ├── public/                     # Arquivos estáticos
│   │   └── favicon.ico
│   │
│   ├── scripts/                    # Scripts de deploy
│   │   └── deploy.sh
│   │
│   ├── nuxt.config.ts              # Configuração do Nuxt
│   ├── package.json
│   ├── tsconfig.json
│   └── eslint.config.mjs
│
├── functions/                      # Firebase Functions (Backend)
│   ├── src/
│   │   ├── agent/                  # LLM Agent
│   │   │   ├── handler/
│   │   │   │   ├── agent.ts        # Tool calling logic
│   │   │   │   ├── config.ts       # Agent config
│   │   │   │   └── index.ts
│   │   │   └── index.ts            # Entry point
│   │   │
│   │   ├── clients/                # Clientes de serviços externos
│   │   │   ├── events.ts           # Firestore events client
│   │   │   ├── messaging.ts        # Z-API client
│   │   │   └── index.ts
│   │   │
│   │   ├── config/                 # Configurações
│   │   │   └── env.ts              # Environment variables
│   │   │
│   │   ├── events/                 # API de eventos de menu
│   │   │   ├── api/
│   │   │   │   ├── controllers.ts  # Controllers
│   │   │   │   ├── routes.ts       # Express routes
│   │   │   │   ├── services.ts     # Business logic
│   │   │   │   ├── validators.ts   # Request validation (Zod)
│   │   │   │   └── index.ts
│   │   │   └── index.ts            # Cloud Function export
│   │   │
│   │   ├── messaging/              # API de mensagens (WhatsApp)
│   │   │   ├── api/
│   │   │   │   ├── clients/
│   │   │   │   │   └── zapi.ts     # Z-API integration
│   │   │   │   ├── config/
│   │   │   │   │   └── zapi.ts     # Z-API config
│   │   │   │   ├── controllers.ts
│   │   │   │   ├── routes.ts
│   │   │   │   ├── services.ts
│   │   │   │   ├── validators.ts
│   │   │   │   └── index.ts
│   │   │   └── index.ts            # Cloud Function export
│   │   │
│   │   └── index.ts                # Entry point (exporta todas functions)
│   │
│   ├── dist/                       # Código compilado (gerado)
│   ├── package.json
│   ├── tsconfig.json
│   └── deploy.sh                   # Script de deploy seguro
│
├── scripts/                        # Scripts utilitários
│   ├── data/                       # Dados de exemplo (JSON)
│   │   ├── campaigns.json
│   │   ├── feedbacks.json
│   │   ├── menu_events_last_30_days.json
│   │   ├── orders.json
│   │   ├── store_consumers.json
│   │   └── store.json
│   │
│   ├── database/                   # Scripts de banco
│   │   ├── import-menu-events.ts   # Importar eventos para Firestore
│   │   ├── logs/                   # Logs de import
│   │   └── README.md
│   │
│   ├── development/                # Scripts de dev
│   │   └── kill.js                 # Matar processos pendentes
│   │
│   └── utils/
│       └── logger.ts               # Logger utilitário
│
├── docs/                           # Documentação
│   └── briefing.md                 # Contexto e fundamentos
│
├── firebase.json                   # Config Firebase (emulators, functions)
├── .firebaserc                     # Projeto Firebase
├── package.json                    # Scripts do monorepo
├── env.example                     # Exemplo de variáveis de ambiente
└── README.md                       # Este arquivo
```

### Convenções

#### Nomenclatura
- **Componentes Vue**: PascalCase (`HomeStats.vue`)
- **Composables**: camelCase com prefixo `use` (`useDashboard.ts`)
- **Utils**: camelCase (`api-client.ts`)
- **Tipos**: PascalCase para interfaces/types

#### Organização
- **Por Feature**: Componentes agrupados por área (home, settings)
- **Por Responsabilidade**: Functions separadas por domínio (events, messaging, agent)
- **Colocation**: Tipos e utils próximos ao código que os usa

---

## 🚀 Setup e Desenvolvimento

### Pré-requisitos

- **Node.js 20+** (recomendado via [nvm](https://github.com/nvm-sh/nvm))
- **npm** ou **pnpm**
- **Firebase CLI**: `npm install -g firebase-tools`
- **Google Cloud SDK** (para deploy): [Instalar gcloud](https://cloud.google.com/sdk/docs/install)

### 1. Clonar o Repositório

```bash
git clone <repository-url>
cd brendi-fast-hackathon
```

### 2. Instalar Dependências

#### Opção 1: Instalar tudo de uma vez
```bash
npm run install:all
```

#### Opção 2: Instalar individualmente
```bash
# Dashboard
cd dashboard && npm install

# Functions
cd functions && npm install
```

### 3. Configurar Variáveis de Ambiente

#### Dashboard
Crie `dashboard/.env`:
```bash
# Firestore
FIRESTORE_PROJECT_ID=your-project-id
FIRESTORE_EMULATOR_HOST=localhost:9093  # Para desenvolvimento local

# Functions URL (produção)
FUNCTIONS_BASE_URL=https://your-region-your-project.cloudfunctions.net
```

#### Functions
Crie `functions/.env`:
```bash
# OpenAI
OPENAI_API_KEY=sk-...

# Z-API (WhatsApp)
ZAPI_INSTANCE_ID=your-instance-id
ZAPI_TOKEN=your-token
ZAPI_BASE_URL=https://api.z-api.io

# Firestore
FIRESTORE_PROJECT_ID=your-project-id
```

### 4. Configurar Firebase

Edite `.firebaserc` com seu projeto:
```json
{
  "projects": {
    "default": "your-project-id"
  }
}
```

### 5. Importar Dados de Exemplo

```bash
# Inicia emuladores Firebase (Firestore)
npm run firebase

# Em outro terminal, importa dados
npm run import:menu-events
```

### 6. Desenvolvimento

#### Opção 1: Ambiente Completo (Dashboard + Functions + Emulators)

**Terminal 1**: Firebase Emulators
```bash
npm run firebase
```

Abre:
- Firestore Emulator: `localhost:9093`
- Functions Emulator: `localhost:5001`
- Emulator UI: `http://localhost:4000`

**Terminal 2**: Dashboard
```bash
cd dashboard
npm run dev
```

Abre: `http://localhost:3000`

#### Opção 2: Apenas Dashboard (conecta a functions em produção)

```bash
cd dashboard
npm run dev
```

### 7. Parar Processos Pendentes

Se ficar algum processo travado:
```bash
npm run kill
```

---

## 🚢 Deploy

### Pré-requisitos de Deploy

1. **Google Cloud SDK** instalado e autenticado:
```bash
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

2. **Habilitar APIs no GCP:**
```bash
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable firestore.googleapis.com
```

3. **Configurar Secrets no GCP:**
```bash
# OpenAI
echo -n "sk-..." | gcloud secrets create OPENAI_API_KEY --data-file=-

# Z-API
echo -n "your-token" | gcloud secrets create ZAPI_TOKEN --data-file=-
echo -n "your-instance-id" | gcloud secrets create ZAPI_INSTANCE_ID --data-file=-
```

### Deploy do Dashboard (Cloud Run)

#### Produção
```bash
npm run deploy:dashboard
```

Isso irá:
1. Build do Nuxt em modo produção
2. Criar imagem Docker
3. Push para Google Container Registry
4. Deploy no Cloud Run
5. URL: `https://brendi-dashboard-HASH-uc.a.run.app`

#### Staging
```bash
npm run deploy:dashboard:staging
```

Diferenças do staging:
- Menos memória (512Mi vs 1Gi)
- Min instances: 0 (vs 1 em prod)
- URL: `https://brendi-dashboard-staging-HASH-uc.a.run.app`

### Deploy das Functions

```bash
cd functions
npm run deploy
```

Ou para deploy seguro (com confirmação):
```bash
cd functions
npm run deploy:safe
```

### Verificar Deploy

```bash
# Listar serviços Cloud Run
gcloud run services list

# Ver logs do dashboard
gcloud run services logs read brendi-dashboard --limit=50

# Ver logs das functions
cd functions && npm run logs
```

---

## 🧠 Decisões Técnicas

### 1. Monolito Nuxt vs Microsserviços

**Decisão**: Monolito Nuxt (frontend + server routes) + Functions separadas

**Raciocínio**:
- ✅ **Menor complexidade**: Um repositório, um deploy, tipos compartilhados
- ✅ **Produtividade**: Iterar rápido sem coordenar múltiplos serviços
- ✅ **Suficiente para escala**: Nuxt server routes escala bem até 10k+ req/min
- ⚠️ **Trade-off**: Menos modular que microsserviços, mas acceptable para o escopo

**Quando migrar**: Se diferentes áreas precisarem escalar independentemente ou ter times separados

### 2. Firestore vs PostgreSQL/Supabase

**Decisão**: Firestore

**Raciocínio**:
- ✅ **Iteração rápida**: Schema-less permite mudar modelo sem migrations
- ✅ **Serverless**: Zero gestão de infra
- ✅ **Real-time**: Útil para chat e notificações
- ✅ **Namespace natural**: `restaurants/{id}/` organiza dados por tenant
- ⚠️ **Trade-off**: Denormalização necessária (mas simplifica queries)
- ⚠️ **Trade-off**: Não é ideal para analytics complexo (resolvido com materializações)

**Quando migrar**: Se queries relacionais complexas ou analytics pesado virarem necessidade

### 3. Server Routes (Nuxt) vs Functions Puras

**Decisão**: Híbrido - Server routes para proxy/agregações leves, Functions para lógica pesada

**Raciocínio**:
- ✅ **Server routes**: Menor latência, compartilha tipos com frontend, fácil SSR
- ✅ **Functions**: Isolamento, escala independente, runtime Node.js puro
- ✅ **Melhor dos dois mundos**: Simples no Nuxt, complexo nas Functions

**Separação clara**:
- **Server Routes**: `/api/events` (lista e filtra), `/api/insights` (cache e agregação)
- **Functions**: Agent (LLM), Messaging (WhatsApp), Jobs (scheduled)

### 4. Vercel AI SDK vs Integração Direta com OpenAI

**Decisão**: Vercel AI SDK

**Raciocínio**:
- ✅ **Provider-agnostic**: Trocar OpenAI → Anthropic → Gemini é trivial
- ✅ **Tool calling abstrato**: API consistente entre providers
- ✅ **Streaming built-in**: Melhor UX sem complexidade
- ✅ **Type-safe**: Zod schemas para tools
- ⚠️ **Trade-off**: Uma dependência extra (mas é leve e bem mantida)

### 5. Denormalização vs Normalização no Firestore

**Decisão**: Denormalização controlada + Materializações

**Raciocínio**:
- ✅ **Leituras baratas**: Agregados pré-calculados evitam scans
- ✅ **Queries simples**: Buscar por período é O(1)
- ✅ **Previsível**: Custo por query é conhecido
- ⚠️ **Trade-off**: Escritas mais caras (escrever dados + agregados)
- ⚠️ **Trade-off**: Eventual consistency (aceitável para analytics)

**Exemplo**:
```
restaurants/{id}/menu_events/{eventId}       ← Evento individual
restaurants/{id}/daily_stats/{dateKey}       ← Agregado diário
restaurants/{id}/insights/{insightId}        ← Insight gerado
```

### 6. Cloud Run vs Cloud Functions vs App Engine

**Decisão**: Cloud Run para dashboard, Cloud Functions para backend

**Raciocínio**:
- ✅ **Cloud Run**: Container = flexibilidade total, Nuxt SSR funciona perfeito
- ✅ **Cloud Functions**: Ideal para event-driven e HTTP simples (agent, messaging)
- ✅ **Escala**: Ambos escalam de 0 a N automaticamente
- ✅ **Custo**: Pay-per-use eficiente
- ⚠️ **Trade-off**: Não é AWS Lambda (mas GCP é mais simples)

### 7. Material UI vs Nuxt UI vs Shadcn/ui

**Decisão**: Nuxt UI

**Raciocínio**:
- ✅ **Integração nativa**: Feito para Nuxt
- ✅ **Componentes de dashboard**: Sidebar, Navbar, Tables, Charts prontos
- ✅ **Design moderno**: UI/UX de alta qualidade out-of-the-box
- ✅ **Acessibilidade**: ARIA labels e keyboard navigation built-in
- ⚠️ **Trade-off**: Menos customização que Tailwind puro (não é problema)

### 8. Monorepo (Workspaces) vs Multi-repo

**Decisão**: Monorepo com npm workspaces

**Raciocínio**:
- ✅ **Compartilhamento**: Tipos TypeScript entre dashboard e functions
- ✅ **Scripts centralizados**: `npm run dev`, `npm run deploy`
- ✅ **Versionamento atômico**: Um commit = mudança em tudo
- ✅ **Simples**: Não precisa de tooling complexo (Nx, Turborepo)
- ⚠️ **Trade-off**: node_modules duplicados (aceitável)

### 9. TypeScript Strict Mode

**Decisão**: Strict mode ON

**Raciocínio**:
- ✅ **Catch errors cedo**: Type safety completo
- ✅ **Refatoração segura**: Confiança ao mudar código
- ✅ **Documentação viva**: Tipos são documentação
- ⚠️ **Trade-off**: Código mais verboso (mas vale a pena)

### 10. RESTful API vs GraphQL

**Decisão**: RESTful API simples

**Raciocínio**:
- ✅ **Simplicidade**: Endpoints HTTP padrão
- ✅ **Cache fácil**: HTTP caching funciona out-of-the-box
- ✅ **Menor overhead**: Sem runtime GraphQL
- ⚠️ **Trade-off**: Mais endpoints que GraphQL (não é problema para o escopo)

**Quando migrar**: Se frontend precisar de queries muito complexas ou under/over-fetching virar problema

---

## 📊 Próximos Passos

### MVP Funcional (Core)
- [x] Setup do repositório
- [x] Dashboard básico com visualização de eventos de menu
- [ ] API de insights (agregações e cálculos)
- [ ] Agent LLM com tool calling
- [ ] Integração WhatsApp (Z-API)
- [ ] Deploy em produção

### Polimento
- [ ] Testes unitários (Vitest)
- [ ] Error boundaries e tratamento de erros
- [ ] Loading states e skeletons
- [ ] Autenticação (Firebase Auth)
- [ ] Multi-restaurante (namespace por usuário)

### Features Avançadas
- [ ] Insights proativos diários (Cloud Scheduler)
- [ ] Recomendações de ação
- [ ] Comparações entre períodos
- [ ] Alertas customizáveis
- [ ] Export de relatórios

---

## 📚 Recursos e Documentação

### Documentação Oficial
- [Nuxt 4](https://nuxt.com/docs)
- [Nuxt UI](https://ui.nuxt.com/)
- [Firebase Functions](https://firebase.google.com/docs/functions)
- [Firestore](https://firebase.google.com/docs/firestore)
- [Vercel AI SDK](https://sdk.vercel.ai/docs)
- [OpenAI API](https://platform.openai.com/docs)
- [Cloud Run](https://cloud.google.com/run/docs)

### Arquivos Importantes
- [`docs/briefing.md`](docs/briefing.md) - Contexto completo e fundamentos do projeto
- [`dashboard/deploy/DEPLOY.md`](dashboard/deploy/DEPLOY.md) - Guia de deploy detalhado
- [`scripts/database/README.md`](scripts/database/README.md) - Scripts de importação de dados

---

## 🤝 Contribuindo

Este é um projeto de hackathon com foco em entrega rápida e qualidade técnica. Princípios:

1. **Baixo Cognitive Load**: Código fácil de ler e entender
2. **Baixo Overengineering**: Abstrações enxutas e pragmáticas
3. **Racional Explícito**: Toda decisão técnica documentada
4. **Produto Funcional**: Valor real para o usuário final

---

## 📝 Licença

Este projeto foi desenvolvido para o Hackathon Brendi.

---

**Desenvolvido com ❤️ para o Hackathon Brendi**
