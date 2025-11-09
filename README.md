# Brendi Fast Hackathon

[![Nuxt UI](https://img.shields.io/badge/Made%20with-Nuxt%20UI-00DC82?logo=nuxt&labelColor=020420)](https://ui.nuxt.com)

Monorepo Firebase com Dashboard (Nuxt 4 + Nuxt UI) e Cloud Functions (TypeScript).

## Stack

- [Nuxt 4](https://nuxt.com/) - Framework frontend SSR
- [Nuxt UI](https://ui.nuxt.com/) - Biblioteca de componentes UI
- [Firebase Hosting](https://firebase.google.com/docs/hosting) - Deploy frontend
- [Firebase Functions](https://firebase.google.com/docs/functions) - Backend serverless (Node.js 20 + TypeScript)

## Estrutura do Monorepo

```
brendi-fast-hackathon/
├── dashboard/              # Frontend Nuxt
│   ├── app/
│   │   ├── assets/        # CSS e arquivos estáticos
│   │   ├── components/    # Componentes Vue
│   │   ├── layouts/       # Layouts da aplicação
│   │   ├── pages/         # Páginas (rotas automáticas)
│   │   └── composables/   # Composables Vue
│   ├── public/            # Arquivos públicos estáticos
│   ├── server/            # API e server middleware do Nuxt
│   ├── nuxt.config.ts     # Configuração do Nuxt
│   └── package.json       # Dependências do dashboard
│
├── functions/             # Backend Cloud Functions
│   ├── src/
│   │   └── index.ts       # Entry point das functions
│   ├── lib/               # Código compilado (gerado)
│   ├── tsconfig.json      # Config TypeScript
│   └── package.json       # Dependências das functions
│
├── firebase.json          # Configuração Firebase (hosting + functions)
├── .firebaserc           # Projeto Firebase
└── package.json          # Scripts do monorepo
```

## Setup

### 1. Instalar dependências

Instale as dependências de todos os projetos:

```bash
npm run install:all
```

Ou individualmente:

```bash
# Dashboard (Nuxt)
cd dashboard && npm install

# Functions
cd functions && npm install
```

### 2. Configurar Firebase

Edite o arquivo `.firebaserc` e substitua `YOUR_PROJECT_ID` pelo ID do seu projeto Firebase:

```json
{
  "projects": {
    "default": "seu-projeto-id"
  }
}
```

### 3. Desenvolvimento

**Rodar o Dashboard (Nuxt):**

```bash
npm run dev
```

O dashboard estará disponível em `http://localhost:3000`

**Rodar Firebase Functions localmente:**

```bash
npm run dev:functions
```

As functions estarão disponíveis no emulador local.

## Deploy

### Primeira vez

1. Instale o Firebase CLI (se ainda não tiver):

```bash
npm install -g firebase-tools
```

2. Faça login no Firebase:

```bash
firebase login
```

### Deploy Completo

Deploy de tudo (dashboard + functions):

```bash
npm run firebase:deploy
```

### Deploy Parcial

**Apenas Dashboard:**

```bash
npm run firebase:deploy:hosting
```

**Apenas Functions:**

```bash
npm run firebase:deploy:functions
```

## Scripts Disponíveis

### Monorepo (raiz)

- `npm run dev` - Inicia servidor de desenvolvimento do dashboard
- `npm run dev:functions` - Inicia emulador das functions
- `npm run build` - Build do dashboard
- `npm run build:functions` - Build das functions
- `npm run build:all` - Build completo (dashboard + functions)
- `npm run install:all` - Instala dependências de tudo
- `npm run firebase:deploy` - Deploy completo
- `npm run firebase:deploy:hosting` - Deploy apenas hosting
- `npm run firebase:deploy:functions` - Deploy apenas functions
- `npm run lint` - Lint de todo o código
- `npm run clean` - Limpa builds e node_modules

### Dashboard

```bash
cd dashboard
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run preview      # Preview do build
npm run lint         # ESLint
npm run typecheck    # Verificação de tipos TypeScript
```

### Functions

```bash
cd functions
npm run build        # Compila TypeScript
npm run build:watch  # Compila em watch mode
npm run serve        # Emulador local
npm run deploy       # Deploy apenas functions
npm run logs         # Visualizar logs das functions
npm run lint         # ESLint
```

## Desenvolvimento das Functions

As Cloud Functions ficam em [functions/src/index.ts](functions/src/index.ts). Exemplo:

```typescript
import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

export const helloWorld = onRequest((request, response) => {
  logger.info("Hello logs!", {structuredData: true});
  response.json({result: "Hello from Firebase!"});
});
```

Para adicionar novas functions, crie exports no arquivo `index.ts` ou organize em módulos separados.

## Configuração Firebase

O arquivo [firebase.json](firebase.json) gerencia:

- **Hosting**: Aponta para `dashboard/.output/public` (build do Nuxt)
- **Functions**: Gerencia duas codebases:
  - `functions/` - Suas Cloud Functions TypeScript
  - `dashboard/.output/server` - SSR do Nuxt (função `server`)

## Recursos

- [Documentação do Nuxt](https://nuxt.com/docs)
- [Documentação do Nuxt UI](https://ui.nuxt.com/)
- [Documentação do Firebase Hosting](https://firebase.google.com/docs/hosting)
- [Documentação do Firebase Functions](https://firebase.google.com/docs/functions)
- [Template Original Nuxt UI](https://github.com/nuxt-ui-templates/dashboard)
