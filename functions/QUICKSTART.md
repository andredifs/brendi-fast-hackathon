# 🚀 Quick Start Guide

Guia rápido para começar a usar o template de API CRUD.

## 📋 Pré-requisitos

- Node.js >= 20
- Firebase CLI instalado
- Projeto Firebase configurado

### Instalar Firebase CLI (se necessário)

```bash
npm install -g firebase-tools
firebase login
```

## ⚡ Início Rápido (5 minutos)

### 1. Instalar Dependências

```bash
cd functions
npm install
```

### 2. Iniciar Emulador Local

```bash
npm run serve
```

A API estará disponível em:
```
http://localhost:5001/<project-id>/<region>/api
```

### 3. Testar a API

#### Health Check

```bash
curl http://localhost:5001/<project-id>/<region>/api/health
```

#### Criar um Produto

```bash
curl -X POST http://localhost:5001/<project-id>/<region>/api/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Teste Product",
    "description": "Produto de teste",
    "price": 99.99,
    "category": "test",
    "stock": 10
  }'
```

#### Listar Produtos

```bash
curl http://localhost:5001/<project-id>/<region>/api/api/products
```

## 🎯 Próximos Passos

### Criar sua primeira entidade

Vamos criar um CRUD de "Tasks" como exemplo:

#### 1. Criar estrutura de pastas

```bash
mkdir -p src/api/tasks
```

#### 2. Criar o Validator

```typescript
// src/api/tasks/validator.ts
import {z} from "zod";

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    completed: z.boolean().default(false),
    dueDate: z.string().optional(),
  }),
});

export const updateTaskSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    completed: z.boolean().optional(),
    dueDate: z.string().optional(),
  }),
});

export const getTaskSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>["body"];
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>["body"];
```

#### 3. Criar o Service

```typescript
// src/api/tasks/service.ts
import * as admin from "firebase-admin";
import {ApiError} from "../../middleware/errorHandler";
import {CreateTaskInput, UpdateTaskInput} from "./validator";

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: string;
  createdAt: admin.firestore.Timestamp;
  updatedAt: admin.firestore.Timestamp;
}

export class TaskService {
  private collection: admin.firestore.CollectionReference;

  constructor() {
    if (!admin.apps.length) {
      admin.initializeApp();
    }
    this.collection = admin.firestore().collection("tasks");
  }

  async create(data: CreateTaskInput): Promise<Task> {
    const now = admin.firestore.Timestamp.now();
    const taskData = {
      ...data,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await this.collection.add(taskData);
    const doc = await docRef.get();

    return {id: docRef.id, ...doc.data()} as Task;
  }

  async findAll(): Promise<Task[]> {
    const snapshot = await this.collection
      .orderBy("createdAt", "desc")
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Task));
  }

  async findById(id: string): Promise<Task> {
    const doc = await this.collection.doc(id).get();

    if (!doc.exists) {
      throw new ApiError(404, "Task not found");
    }

    return {id: doc.id, ...doc.data()} as Task;
  }

  async update(id: string, data: UpdateTaskInput): Promise<Task> {
    const docRef = this.collection.doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      throw new ApiError(404, "Task not found");
    }

    await docRef.update({
      ...data,
      updatedAt: admin.firestore.Timestamp.now(),
    });

    const updatedDoc = await docRef.get();
    return {id: updatedDoc.id, ...updatedDoc.data()} as Task;
  }

  async delete(id: string): Promise<void> {
    const docRef = this.collection.doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      throw new ApiError(404, "Task not found");
    }

    await docRef.delete();
  }
}
```

#### 4. Criar o Controller

```typescript
// src/api/tasks/controller.ts
import {Response} from "express";
import {ApiRequest, ApiResponse} from "../../types";
import {TaskService, Task} from "./service";
import {CreateTaskInput, UpdateTaskInput} from "./validator";

export class TaskController {
  private taskService: TaskService;

  constructor() {
    this.taskService = new TaskService();
  }

  create = async (
    req: ApiRequest<CreateTaskInput>,
    res: Response
  ): Promise<Response> => {
    const task = await this.taskService.create(req.body);
    const response: ApiResponse<Task> = {
      success: true,
      data: task,
      message: "Task created successfully",
    };
    return res.status(201).json(response);
  };

  findAll = async (req: ApiRequest, res: Response): Promise<Response> => {
    const tasks = await this.taskService.findAll();
    const response: ApiResponse<Task[]> = {
      success: true,
      data: tasks,
    };
    return res.status(200).json(response);
  };

  findById = async (
    req: ApiRequest<any, any, {id: string}>,
    res: Response
  ): Promise<Response> => {
    const task = await this.taskService.findById(req.params.id);
    const response: ApiResponse<Task> = {
      success: true,
      data: task,
    };
    return res.status(200).json(response);
  };

  update = async (
    req: ApiRequest<UpdateTaskInput, any, {id: string}>,
    res: Response
  ): Promise<Response> => {
    const task = await this.taskService.update(req.params.id, req.body);
    const response: ApiResponse<Task> = {
      success: true,
      data: task,
      message: "Task updated successfully",
    };
    return res.status(200).json(response);
  };

  delete = async (
    req: ApiRequest<any, any, {id: string}>,
    res: Response
  ): Promise<Response> => {
    await this.taskService.delete(req.params.id);
    const response: ApiResponse = {
      success: true,
      message: "Task deleted successfully",
    };
    return res.status(200).json(response);
  };
}
```

#### 5. Criar as Routes

```typescript
// src/api/tasks/routes.ts
import {Router} from "express";
import {TaskController} from "./controller";
import {validateRequest} from "../../middleware/validateRequest";
import {asyncHandler} from "../../middleware/errorHandler";
import {
  createTaskSchema,
  updateTaskSchema,
  getTaskSchema,
} from "./validator";

export const taskRoutes = Router();
const controller = new TaskController();

taskRoutes.post(
  "/",
  validateRequest(createTaskSchema),
  asyncHandler(controller.create)
);

taskRoutes.get("/", asyncHandler(controller.findAll));

taskRoutes.get(
  "/:id",
  validateRequest(getTaskSchema),
  asyncHandler(controller.findById)
);

taskRoutes.put(
  "/:id",
  validateRequest(updateTaskSchema),
  asyncHandler(controller.update)
);

taskRoutes.delete(
  "/:id",
  validateRequest(getTaskSchema),
  asyncHandler(controller.delete)
);
```

#### 6. Registrar as Routes no index.ts

```typescript
// src/index.ts
import {taskRoutes} from "./api/tasks/routes";

// Dentro do createApp(), adicione:
app.use("/api/tasks", taskRoutes);
```

#### 7. Rebuild e Teste

```bash
npm run build
# Em outro terminal
npm run serve

# Testar
curl -X POST http://localhost:5001/<project-id>/<region>/api/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Minha primeira task", "completed": false}'
```

## 🔒 Adicionar Autenticação

### 1. Renomear arquivo de exemplo

```bash
cd src/middleware
cp auth.example.ts auth.ts
```

### 2. Usar nas rotas

```typescript
import {requireAuth} from "../../middleware/auth";

// Proteger rotas
taskRoutes.post(
  "/",
  requireAuth,  // Adiciona autenticação
  validateRequest(createTaskSchema),
  asyncHandler(controller.create)
);
```

### 3. Testar com token

```bash
# Obter token do Firebase Auth
TOKEN="seu-token-aqui"

curl -X POST http://localhost:5001/<project-id>/<region>/api/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title": "Task autenticada"}'
```

## 📊 Adicionar Paginação

Se você precisa de paginação, use o exemplo do Products:

```typescript
// No validator
export const listTasksSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).default("1"),
    limit: z.string().regex(/^\d+$/).transform(Number).default("10"),
  }),
});

// No service
async findAll(query: {page: number; limit: number}) {
  const offset = (query.page - 1) * query.limit;
  
  const snapshot = await this.collection
    .orderBy("createdAt", "desc")
    .limit(query.limit)
    .offset(offset)
    .get();

  const total = (await this.collection.get()).size;

  return {
    tasks: snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()})),
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.ceil(total / query.limit),
    },
  };
}
```

## 🧪 Adicionar Testes

### 1. Instalar Vitest

```bash
npm install -D vitest @vitest/ui
```

### 2. Adicionar script no package.json

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}
```

### 3. Criar teste

```typescript
// src/api/tasks/service.test.ts
import {describe, it, expect, beforeEach} from "vitest";
import {TaskService} from "./service";

describe("TaskService", () => {
  let service: TaskService;

  beforeEach(() => {
    service = new TaskService();
  });

  it("should create a task", async () => {
    const task = await service.create({
      title: "Test Task",
      completed: false,
    });

    expect(task).toHaveProperty("id");
    expect(task.title).toBe("Test Task");
    expect(task.completed).toBe(false);
  });
});
```

### 4. Rodar testes

```bash
npm test
```

## 🚀 Deploy para Produção

### 1. Build

```bash
npm run build
```

### 2. Deploy

```bash
npm run deploy
```

### 3. Testar em produção

```bash
curl https://<region>-<project-id>.cloudfunctions.net/api/health
```

## 📚 Recursos Úteis

- [README.md](./README.md) - Documentação completa
- [STRUCTURE.md](./STRUCTURE.md) - Estrutura do projeto
- [API_EXAMPLES.md](./API_EXAMPLES.md) - Exemplos de uso da API

## ❓ Dúvidas Comuns

### Como adicionar CORS específico?

```typescript
// src/index.ts
export const api = onRequest({
  cors: {
    origin: ["https://meusite.com", "https://app.meusite.com"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
}, createApp());
```

### Como adicionar rate limiting?

```typescript
import {rateLimit} from "./middleware/auth";

// No createApp()
app.use(rateLimit(100, 15 * 60 * 1000)); // 100 req / 15 min
```

### Como adicionar logging customizado?

```typescript
import * as logger from "firebase-functions/logger";

// No service
logger.info("Creating task", {title: data.title});
logger.error("Error creating task", {error});
```

### Como tratar erros específicos?

```typescript
import {ApiError} from "../../middleware/errorHandler";

// No service
if (!isValid) {
  throw new ApiError(400, "Invalid data");
}
```

## 🎉 Pronto!

Você agora tem uma API CRUD completa com:
- ✅ Express
- ✅ Zod para validação
- ✅ Arquitetura em camadas
- ✅ Tratamento de erros
- ✅ TypeScript
- ✅ Firebase Cloud Functions

Divirta-se construindo sua API! 🚀

