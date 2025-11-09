# Quick Start

Guia rápido para começar a desenvolver no projeto.

## Primeiros Passos

1. **Clone o repositório** (se ainda não fez):
```bash
git clone <seu-repo>
cd brendi-fast-hackathon
```

2. **Instale as dependências**:
```bash
npm run install:all
```

3. **Configure o Firebase**:
Edite [.firebaserc](.firebaserc) e coloque seu project ID:
```json
{
  "projects": {
    "default": "seu-projeto-id"
  }
}
```

## Desenvolvimento

### Frontend (Dashboard Nuxt)

```bash
npm run dev
```
Acesse: http://localhost:3000

### Backend (Cloud Functions)

```bash
npm run dev:functions
```

## Estrutura Rápida

```
├── dashboard/       → Frontend Nuxt (porta 3000)
│   └── app/        → Código Vue (pages, components, layouts)
│
└── functions/      → Backend TypeScript
    └── src/        → Código das Cloud Functions
```

## Próximos Passos

- **Dashboard**: Edite arquivos em `dashboard/app/pages/` para criar novas páginas
- **Functions**: Adicione functions em `functions/src/index.ts`
- **Deploy**: `npm run firebase:deploy` (build + deploy completo)

## Dúvidas?

Consulte o [README.md](README.md) completo para mais detalhes.
