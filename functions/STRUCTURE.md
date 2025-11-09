# Estrutura do Projeto

## 📁 Visão Geral da Estrutura

```
functions/
├── src/
│   ├── api/                              # Módulos da API
│   │   └── products/                     # Exemplo: CRUD de produtos
│   │       ├── controller.ts             # HTTP handlers (camada de apresentação)
│   │       ├── service.ts                # Lógica de negócio (camada de serviço)
│   │       ├── validator.ts              # Schemas Zod (camada de validação)
│   │       └── routes.ts                 # Definição de rotas Express
│   │
│   ├── middleware/                       # Middlewares Express
│   │   ├── auth.example.ts               # Exemplo de autenticação (copie e adapte)
│   │   ├── errorHandler.ts               # Tratamento centralizado de erros
│   │   └── validateRequest.ts            # Validação usando Zod schemas
│   │
│   ├── types/                            # Tipos TypeScript compartilhados
│   │   └── index.ts                      # Interfaces e tipos
│   │
│   └── index.ts                          # Entry point - Cloud Function
│
├── lib/                                  # Build output (gerado)
│   ├── index.js
│   └── index.js.map
│
├── node_modules/                         # Dependências (gerado)
│
├── .eslintignore                         # Arquivos ignorados pelo ESLint
├── .eslintrc.js                          # Configuração do ESLint
├── .gitignore                            # Arquivos ignorados pelo Git
├── API_EXAMPLES.md                       # Exemplos de uso da API
├── package.json                          # Dependências e scripts
├── README.md                             # Documentação principal
├── STRUCTURE.md                          # Este arquivo
└── tsconfig.json                         # Configuração TypeScript
```

## 🏗️ Arquitetura em Camadas

### 1. **Camada de Rotas** (`routes.ts`)
- Define os endpoints HTTP
- Registra middlewares
- Conecta URLs aos controllers

**Responsabilidades:**
- Definir métodos HTTP (GET, POST, PUT, DELETE)
- Aplicar middlewares (validação, autenticação)
- Mapear URLs para handlers

**Exemplo:**
```typescript
productRoutes.post(
  "/",
  validateRequest(createProductSchema),  // Middleware de validação
  asyncHandler(controller.create)         // Handler do controller
);
```

### 2. **Camada de Validação** (`validator.ts`)
- Define schemas Zod para validação
- Exporta tipos TypeScript
- Valida body, query params e URL params

**Responsabilidades:**
- Validar estrutura dos dados
- Definir regras de negócio básicas (ex: email válido)
- Transformar dados (ex: string -> number)

**Exemplo:**
```typescript
export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(100),
    price: z.number().positive(),
  }),
});
```

### 3. **Camada de Controller** (`controller.ts`)
- Recebe requisições HTTP
- Chama services
- Formata respostas

**Responsabilidades:**
- Extrair dados da requisição
- Chamar métodos do service
- Formatar resposta JSON
- Definir status HTTP

**Exemplo:**
```typescript
create = async (req: ApiRequest, res: Response) => {
  const product = await this.productService.create(req.body);
  return res.status(201).json({
    success: true,
    data: product,
  });
};
```

### 4. **Camada de Service** (`service.ts`)
- Lógica de negócio
- Interação com banco de dados
- Validações complexas

**Responsabilidades:**
- CRUD no Firestore
- Regras de negócio
- Tratamento de erros de negócio
- Cálculos e transformações

**Exemplo:**
```typescript
async create(data: CreateProductInput): Promise<Product> {
  const now = admin.firestore.Timestamp.now();
  const productData = {
    ...data,
    createdAt: now,
    updatedAt: now,
  };
  
  const docRef = await this.collection.add(productData);
  return {id: docRef.id, ...productData};
}
```

### 5. **Camada de Middleware**
- Intercepta requisições
- Validação, autenticação, logging
- Tratamento de erros

**Tipos de Middleware:**

#### a) **Error Handler** (`errorHandler.ts`)
```typescript
- ApiError: Erros customizados
- errorHandler: Middleware global de erros
- asyncHandler: Wrapper para async/await
- notFoundHandler: 404 handler
```

#### b) **Validation** (`validateRequest.ts`)
```typescript
- validateRequest: Valida usando Zod schemas
```

#### c) **Authentication** (`auth.example.ts`)
```typescript
- requireAuth: Requer autenticação
- optionalAuth: Autenticação opcional
- requireRole: Requer role específica
- requireOwnership: Verifica propriedade do recurso
- rateLimit: Limita taxa de requisições
```

## 📊 Fluxo de Dados

```
Cliente
   ↓
   ↓ HTTP Request
   ↓
Express App (index.ts)
   ↓
   ↓ Middleware (logging, parsing)
   ↓
Routes (routes.ts)
   ↓
   ↓ Validação (validateRequest)
   ↓
Validator (validator.ts) ← Schemas Zod
   ↓
   ↓ Se válido
   ↓
Controller (controller.ts)
   ↓
   ↓ Chama método
   ↓
Service (service.ts)
   ↓
   ↓ Operação CRUD
   ↓
Firestore Database
   ↓
   ↓ Retorna dados
   ↓
Service (processa)
   ↓
   ↓ Retorna resultado
   ↓
Controller (formata resposta)
   ↓
   ↓ JSON Response
   ↓
Express (middleware de erro se necessário)
   ↓
   ↓ HTTP Response
   ↓
Cliente
```

## 🎯 Responsabilidades por Camada

| Camada | Deve Fazer | NÃO Deve Fazer |
|--------|-----------|----------------|
| **Routes** | Mapear URLs, aplicar middlewares | Lógica de negócio, acesso ao DB |
| **Validator** | Validar estrutura, tipos | Lógica de negócio complexa |
| **Controller** | Extrair dados, formatar resposta | Lógica de negócio, acesso direto ao DB |
| **Service** | Lógica de negócio, CRUD | Lidar com HTTP, formatar respostas |
| **Middleware** | Interceptar, validar, autenticar | Lógica de negócio específica |

## 🔧 Como Adicionar Nova Entidade

### Passo 1: Criar estrutura de pastas
```bash
mkdir -p src/api/users
```

### Passo 2: Criar validator
```typescript
// src/api/users/validator.ts
import {z} from "zod";

export const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    email: z.string().email(),
  }),
});

export type CreateUserInput = z.infer<typeof createUserSchema>["body"];
```

### Passo 3: Criar service
```typescript
// src/api/users/service.ts
import * as admin from "firebase-admin";

export class UserService {
  private collection: admin.firestore.CollectionReference;

  constructor() {
    if (!admin.apps.length) {
      admin.initializeApp();
    }
    this.collection = admin.firestore().collection("users");
  }

  async create(data: CreateUserInput) {
    const docRef = await this.collection.add(data);
    return {id: docRef.id, ...data};
  }
}
```

### Passo 4: Criar controller
```typescript
// src/api/users/controller.ts
import {Response} from "express";
import {ApiRequest} from "../../types";
import {UserService} from "./service";

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  create = async (req: ApiRequest, res: Response) => {
    const user = await this.userService.create(req.body);
    return res.status(201).json({
      success: true,
      data: user,
    });
  };
}
```

### Passo 5: Criar routes
```typescript
// src/api/users/routes.ts
import {Router} from "express";
import {UserController} from "./controller";
import {validateRequest} from "../../middleware/validateRequest";
import {asyncHandler} from "../../middleware/errorHandler";
import {createUserSchema} from "./validator";

export const userRoutes = Router();
const controller = new UserController();

userRoutes.post(
  "/",
  validateRequest(createUserSchema),
  asyncHandler(controller.create)
);
```

### Passo 6: Registrar no index.ts
```typescript
// src/index.ts
import {userRoutes} from "./api/users/routes";

// Dentro do createApp()
app.use("/api/users", userRoutes);
```

## 📦 Dependências

### Produção
- `express`: Framework web
- `firebase-admin`: SDK do Firebase
- `firebase-functions`: Cloud Functions
- `zod`: Validação de schemas

### Desenvolvimento
- `@types/express`: Tipos TypeScript para Express
- `typescript`: Compilador TypeScript
- `eslint`: Linter JavaScript/TypeScript

## 🔒 Segurança

### Adicionar Autenticação

1. **Renomear arquivo de exemplo:**
```bash
cp src/middleware/auth.example.ts src/middleware/auth.ts
```

2. **Usar nas rotas:**
```typescript
import {requireAuth} from "../../middleware/auth";

productRoutes.post(
  "/",
  requireAuth,  // Adiciona autenticação
  validateRequest(createProductSchema),
  asyncHandler(controller.create)
);
```

3. **Usar com roles:**
```typescript
import {requireAuth, requireRole} from "../../middleware/auth";

productRoutes.delete(
  "/:id",
  requireAuth,
  requireRole(["admin"]),  // Apenas admins
  asyncHandler(controller.delete)
);
```

## 🧪 Testing

### Estrutura recomendada
```
functions/
├── src/
│   ├── api/
│   │   └── products/
│   │       ├── controller.ts
│   │       ├── controller.test.ts    ← Testes unitários
│   │       ├── service.ts
│   │       └── service.test.ts       ← Testes unitários
│   └── __tests__/
│       ├── integration/              ← Testes de integração
│       │   └── products.test.ts
│       └── e2e/                      ← Testes end-to-end
│           └── api.test.ts
```

## 📝 Convenções de Código

### Nomenclatura
- **Arquivos**: camelCase ou kebab-case
- **Classes**: PascalCase
- **Funções/Métodos**: camelCase
- **Constantes**: UPPER_SNAKE_CASE
- **Interfaces**: PascalCase com I prefix (opcional)

### Estrutura de Arquivo
```typescript
// 1. Imports
import {z} from "zod";

// 2. Types/Interfaces
export interface Product {
  id: string;
  name: string;
}

// 3. Constants
const MAX_PRODUCTS = 100;

// 4. Classes/Functions
export class ProductService {
  // ...
}

// 5. Exports
export {ProductService};
```

### Comentários
```typescript
/**
 * JSDoc para funções públicas
 * @param data - Descrição do parâmetro
 * @returns Descrição do retorno
 */
export async function create(data: CreateInput): Promise<Product> {
  // Comentários inline para lógica complexa
  const result = await processData(data);
  return result;
}
```

## 🚀 Deploy

### Build
```bash
npm run build
```

### Deploy
```bash
npm run deploy
```

### Deploy específico
```bash
firebase deploy --only functions:api
```

## 📚 Recursos

- [Firebase Cloud Functions](https://firebase.google.com/docs/functions)
- [Express.js](https://expressjs.com/)
- [Zod](https://zod.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Firestore](https://firebase.google.com/docs/firestore)

