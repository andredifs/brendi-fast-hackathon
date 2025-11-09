# Cloud Functions - CRUD API Template

Template de API CRUD usando Firebase Cloud Functions, Express, e Zod com arquitetura em camadas.

## 🏗️ Arquitetura

O projeto segue uma arquitetura em camadas para melhor organização e manutenibilidade:

```
functions/
├── src/
│   ├── api/                      # Endpoints da API
│   │   └── products/             # Exemplo: CRUD de produtos
│   │       ├── controller.ts     # Controladores (HTTP handlers)
│   │       ├── service.ts        # Lógica de negócio
│   │       ├── validator.ts      # Schemas de validação (Zod)
│   │       └── routes.ts         # Definição de rotas
│   ├── middleware/               # Middlewares do Express
│   │   ├── errorHandler.ts      # Tratamento de erros
│   │   └── validateRequest.ts   # Validação de requests
│   ├── types/                    # Tipos TypeScript compartilhados
│   │   └── index.ts
│   └── index.ts                  # Entry point da Cloud Function
├── package.json
└── tsconfig.json
```

## 🚀 Tecnologias

- **Firebase Cloud Functions**: Plataforma serverless
- **Express**: Framework web
- **Zod**: Validação de schemas e tipos
- **TypeScript**: Tipagem estática
- **Firestore**: Banco de dados NoSQL

## 📦 Instalação

```bash
cd functions
npm install
```

## 🔧 Desenvolvimento

### Build

```bash
npm run build
```

### Watch mode

```bash
npm run build:watch
```

### Emulador local

```bash
npm run serve
```

A API estará disponível em: `http://localhost:5001/<project-id>/<region>/api`

### Deploy

```bash
npm run deploy
```

## 📚 API Endpoints

### Health Check

```
GET /health
```

Verifica se a API está funcionando.

### Products (Exemplo)

#### Criar produto

```
POST /api/products
Content-Type: application/json

{
  "name": "Produto Exemplo",
  "description": "Descrição do produto",
  "price": 99.99,
  "category": "electronics",
  "stock": 100,
  "isActive": true
}
```

#### Listar produtos

```
GET /api/products?page=1&limit=10&category=electronics&search=termo
```

Query parameters:
- `page` (opcional): Número da página (padrão: 1)
- `limit` (opcional): Itens por página (padrão: 10)
- `category` (opcional): Filtrar por categoria
- `isActive` (opcional): Filtrar por status (true/false)
- `search` (opcional): Buscar por nome

#### Buscar produto por ID

```
GET /api/products/:id
```

#### Atualizar produto

```
PUT /api/products/:id
Content-Type: application/json

{
  "name": "Nome Atualizado",
  "price": 89.99,
  "stock": 50
}
```

#### Deletar produto (soft delete)

```
DELETE /api/products/:id
```

#### Deletar produto permanentemente

```
DELETE /api/products/:id/hard
```

## 🎯 Como usar este template

### 1. Criar uma nova entidade

Para criar um novo CRUD (ex: "users"), siga este padrão:

```
src/api/users/
├── validator.ts    # Schemas Zod
├── service.ts      # Lógica de negócio
├── controller.ts   # HTTP handlers
└── routes.ts       # Rotas Express
```

### 2. Validator (validator.ts)

```typescript
import {z} from "zod";

export const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    email: z.string().email(),
  }),
});

export type CreateUserInput = z.infer<typeof createUserSchema>["body"];
```

### 3. Service (service.ts)

```typescript
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

  // ... outros métodos
}
```

### 4. Controller (controller.ts)

```typescript
import {Response} from "express";
import {ApiRequest} from "../../types";

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

  // ... outros métodos
}
```

### 5. Routes (routes.ts)

```typescript
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

### 6. Registrar rotas no index.ts

```typescript
import {userRoutes} from "./api/users/routes";

// Dentro do createApp()
app.use("/api/users", userRoutes);
```

## 🛡️ Tratamento de Erros

O template inclui tratamento de erros centralizado:

```typescript
// Lançar erro customizado
throw new ApiError(404, "Resource not found");

// Erros de validação Zod são automaticamente tratados
// Retornam 400 com detalhes dos campos inválidos
```

## 🔒 Segurança

### Adicionar autenticação

Crie um middleware de autenticação:

```typescript
// src/middleware/auth.ts
export const requireAuth = async (req, res, next) => {
  const token = req.headers.authorization?.split("Bearer ")[1];
  
  if (!token) {
    throw new ApiError(401, "Unauthorized");
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    throw new ApiError(401, "Invalid token");
  }
};
```

Use nas rotas:

```typescript
productRoutes.post(
  "/",
  requireAuth,  // Adicione aqui
  validateRequest(createProductSchema),
  asyncHandler(controller.create)
);
```

## 📝 Validação com Zod

Exemplos de schemas Zod úteis:

```typescript
// String com validações
z.string().min(3).max(50).email()

// Número
z.number().positive().int()

// Boolean com valor padrão
z.boolean().default(true)

// Opcional
z.string().optional()

// Enum
z.enum(["active", "inactive", "pending"])

// Array
z.array(z.string())

// Objeto aninhado
z.object({
  address: z.object({
    street: z.string(),
    city: z.string(),
  })
})

// Transform (converter tipo)
z.string().transform((val) => parseInt(val))

// Custom validation
z.string().refine((val) => val.length > 0, {
  message: "Cannot be empty"
})
```

## 🧪 Testing

Para adicionar testes, instale Vitest:

```bash
npm install -D vitest @vitest/ui
```

Crie arquivo `vitest.config.ts`:

```typescript
import {defineConfig} from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
  },
});
```

Exemplo de teste:

```typescript
// src/api/products/service.test.ts
import {describe, it, expect} from "vitest";
import {ProductService} from "./service";

describe("ProductService", () => {
  it("should create a product", async () => {
    const service = new ProductService();
    const product = await service.create({
      name: "Test Product",
      price: 99.99,
      category: "test",
      stock: 10,
    });
    
    expect(product).toHaveProperty("id");
    expect(product.name).toBe("Test Product");
  });
});
```

## 📖 Boas Práticas

1. **Separação de responsabilidades**: Mantenha as camadas separadas
   - Controller: apenas lida com HTTP
   - Service: lógica de negócio
   - Validator: validação de dados

2. **Validação**: Sempre valide inputs usando Zod

3. **Error handling**: Use `asyncHandler` em todas as rotas async

4. **Logging**: Use `firebase-functions/logger` para logs estruturados

5. **Tipos**: Defina interfaces TypeScript para suas entidades

6. **Soft delete**: Considere soft delete (isActive: false) ao invés de deletar permanentemente

7. **Paginação**: Sempre implemente paginação em listagens

8. **CORS**: Configure CORS apropriadamente para produção

9. **Rate limiting**: Considere adicionar rate limiting para produção

10. **Autenticação**: Proteja rotas sensíveis com autenticação

## 🔍 Troubleshooting

### Erro: "Cannot find module"
```bash
npm run build
```

### Erro: "Firebase app not initialized"
Certifique-se de que o Firebase Admin está inicializado no service:
```typescript
if (!admin.apps.length) {
  admin.initializeApp();
}
```

### Erro de validação não está funcionando
Verifique se você está usando `validateRequest` antes do controller na rota.

## 📞 Suporte

Para mais informações sobre:
- [Firebase Cloud Functions](https://firebase.google.com/docs/functions)
- [Express](https://expressjs.com/)
- [Zod](https://zod.dev/)
- [TypeScript](https://www.typescriptlang.org/)

