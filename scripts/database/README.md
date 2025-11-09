# Database Import Scripts

## Import Feedbacks

Este script importa os feedbacks do arquivo `feedbacks.json` para o Firestore.

### Configuração

1. Copie o arquivo `.env.example` para `.env` na raiz do projeto:

```bash
cp env.example .env
```

2. Adicione suas credenciais do Firebase no arquivo `.env`:

```env
FIREBASE_API_KEY=AIzaSyCdAc06QfsyCNOlre7HIflM5h2gIHbeoD0
FIREBASE_AUTH_DOMAIN=fast-hackathon-andre.firebaseapp.com
FIREBASE_PROJECT_ID=fast-hackathon-andre
FIREBASE_STORAGE_BUCKET=fast-hackathon-andre.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=876208269717
FIREBASE_APP_ID=1:876208269717:web:d09a7fd5a8508bdb8aee9c
```

### Uso

Execute o script com:

```bash
npm run import:feedbacks
```

Ou diretamente com:

```bash
npx ts-node scripts/database/import-feedbacks.ts
```

### Funcionalidades

- ✅ Lê as credenciais do Firebase do arquivo `.env`
- ✅ Importa todos os feedbacks do arquivo `feedbacks.json`
- ✅ Usa batch writes para melhor performance (500 documentos por batch)
- ✅ Converte as datas do formato ISO para Timestamp do Firestore
- ✅ Mostra progresso durante a importação
- ✅ Sistema de logging avançado (console + arquivo)
- ✅ Logs salvos em `scripts/database/database/logs/`
- ✅ Collection: `feedbacks`

### Estrutura dos Feedbacks

Cada feedback contém:

- `id`: ID único do feedback
- `store_consumer_id`: ID do consumidor
- `created_at`: Data de criação (Timestamp)
- `updated_at`: Data de atualização (Timestamp)
- `category`: Categoria do feedback
- `order_id`: ID do pedido
- `rated_response`: Resposta do consumidor
- `rating`: Nota (1-5)
- `store_id`: ID da loja

