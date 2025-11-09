# API Examples - Exemplos de Uso

Este arquivo contém exemplos práticos de como usar a API.

## 🔗 Base URL

Desenvolvimento local:
```
http://localhost:5001/<project-id>/<region>/api
```

Produção:
```
https://<region>-<project-id>.cloudfunctions.net/api
```

## 📋 Exemplos com cURL

### Health Check

```bash
curl -X GET http://localhost:5001/<project-id>/<region>/api/health
```

Response:
```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### Criar Produto

```bash
curl -X POST http://localhost:5001/<project-id>/<region>/api/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "MacBook Pro 16",
    "description": "Laptop profissional da Apple",
    "price": 2499.99,
    "category": "electronics",
    "stock": 50,
    "isActive": true
  }'
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "abc123",
    "name": "MacBook Pro 16",
    "description": "Laptop profissional da Apple",
    "price": 2499.99,
    "category": "electronics",
    "stock": 50,
    "isActive": true,
    "createdAt": {
      "_seconds": 1704110400,
      "_nanoseconds": 0
    },
    "updatedAt": {
      "_seconds": 1704110400,
      "_nanoseconds": 0
    }
  },
  "message": "Product created successfully"
}
```

### Listar Produtos

```bash
# Listar todos (paginado)
curl -X GET "http://localhost:5001/<project-id>/<region>/api/api/products?page=1&limit=10"

# Filtrar por categoria
curl -X GET "http://localhost:5001/<project-id>/<region>/api/api/products?category=electronics"

# Buscar por nome
curl -X GET "http://localhost:5001/<project-id>/<region>/api/api/products?search=MacBook"

# Filtrar ativos
curl -X GET "http://localhost:5001/<project-id>/<region>/api/api/products?isActive=true"
```

Response:
```json
{
  "success": true,
  "data": [
    {
      "id": "abc123",
      "name": "MacBook Pro 16",
      "price": 2499.99,
      "category": "electronics",
      "stock": 50,
      "isActive": true
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

### Buscar Produto por ID

```bash
curl -X GET http://localhost:5001/<project-id>/<region>/api/api/products/abc123
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "abc123",
    "name": "MacBook Pro 16",
    "description": "Laptop profissional da Apple",
    "price": 2499.99,
    "category": "electronics",
    "stock": 50,
    "isActive": true,
    "createdAt": {
      "_seconds": 1704110400,
      "_nanoseconds": 0
    },
    "updatedAt": {
      "_seconds": 1704110400,
      "_nanoseconds": 0
    }
  }
}
```

### Atualizar Produto

```bash
curl -X PUT http://localhost:5001/<project-id>/<region>/api/api/products/abc123 \
  -H "Content-Type: application/json" \
  -d '{
    "price": 2299.99,
    "stock": 45
  }'
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "abc123",
    "name": "MacBook Pro 16",
    "price": 2299.99,
    "stock": 45,
    "isActive": true
  },
  "message": "Product updated successfully"
}
```

### Deletar Produto (Soft Delete)

```bash
curl -X DELETE http://localhost:5001/<project-id>/<region>/api/api/products/abc123
```

Response:
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

### Deletar Produto Permanentemente

```bash
curl -X DELETE http://localhost:5001/<project-id>/<region>/api/api/products/abc123/hard
```

Response:
```json
{
  "success": true,
  "message": "Product permanently deleted"
}
```

## 📋 Exemplos com JavaScript/TypeScript

### Usando Fetch API

```typescript
const API_BASE_URL = "http://localhost:5001/<project-id>/<region>/api";

// Criar produto
async function createProduct() {
  const response = await fetch(`${API_BASE_URL}/api/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: "MacBook Pro 16",
      description: "Laptop profissional da Apple",
      price: 2499.99,
      category: "electronics",
      stock: 50,
      isActive: true,
    }),
  });

  const data = await response.json();
  console.log(data);
}

// Listar produtos
async function listProducts() {
  const response = await fetch(
    `${API_BASE_URL}/api/products?page=1&limit=10`
  );
  const data = await response.json();
  console.log(data);
}

// Buscar produto
async function getProduct(id: string) {
  const response = await fetch(`${API_BASE_URL}/api/products/${id}`);
  const data = await response.json();
  console.log(data);
}

// Atualizar produto
async function updateProduct(id: string) {
  const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      price: 2299.99,
      stock: 45,
    }),
  });

  const data = await response.json();
  console.log(data);
}

// Deletar produto
async function deleteProduct(id: string) {
  const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
    method: "DELETE",
  });

  const data = await response.json();
  console.log(data);
}
```

### Usando Axios

```typescript
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5001/<project-id>/<region>/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Criar produto
async function createProduct() {
  const {data} = await api.post("/api/products", {
    name: "MacBook Pro 16",
    description: "Laptop profissional da Apple",
    price: 2499.99,
    category: "electronics",
    stock: 50,
    isActive: true,
  });
  return data;
}

// Listar produtos
async function listProducts(page = 1, limit = 10) {
  const {data} = await api.get("/api/products", {
    params: {page, limit},
  });
  return data;
}

// Buscar produto
async function getProduct(id: string) {
  const {data} = await api.get(`/api/products/${id}`);
  return data;
}

// Atualizar produto
async function updateProduct(id: string, updates: any) {
  const {data} = await api.put(`/api/products/${id}`, updates);
  return data;
}

// Deletar produto
async function deleteProduct(id: string) {
  const {data} = await api.delete(`/api/products/${id}`);
  return data;
}
```

## 🔒 Exemplos com Autenticação

Se você adicionar autenticação JWT/Firebase Auth:

```typescript
// Com Fetch
const response = await fetch(`${API_BASE_URL}/api/products`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${idToken}`,
  },
  body: JSON.stringify(productData),
});

// Com Axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para adicionar token
api.interceptors.request.use((config) => {
  const token = getAuthToken(); // Sua função para obter o token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

## 🎯 Exemplos de Validação

### Erro de Validação (400 Bad Request)

Request:
```bash
curl -X POST http://localhost:5001/<project-id>/<region>/api/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "",
    "price": -10
  }'
```

Response:
```json
{
  "success": false,
  "error": "Validation Error",
  "errors": [
    {
      "field": "name",
      "message": "Name is required"
    },
    {
      "field": "price",
      "message": "Price must be positive"
    },
    {
      "field": "category",
      "message": "Category is required"
    }
  ]
}
```

### Recurso Não Encontrado (404 Not Found)

Request:
```bash
curl -X GET http://localhost:5001/<project-id>/<region>/api/api/products/invalid-id
```

Response:
```json
{
  "success": false,
  "error": "Product not found"
}
```

### Rota Não Encontrada (404 Not Found)

Request:
```bash
curl -X GET http://localhost:5001/<project-id>/<region>/api/api/invalid-route
```

Response:
```json
{
  "success": false,
  "error": "Route not found",
  "message": "Cannot GET /api/invalid-route"
}
```

## 🧪 Testando com Postman

### Importar Collection

Crie uma collection no Postman com as seguintes requests:

1. **Health Check**
   - Method: GET
   - URL: `{{baseUrl}}/health`

2. **Create Product**
   - Method: POST
   - URL: `{{baseUrl}}/api/products`
   - Body (JSON):
   ```json
   {
     "name": "{{$randomProductName}}",
     "description": "{{$randomLoremSentence}}",
     "price": {{$randomPrice}},
     "category": "electronics",
     "stock": {{$randomInt}},
     "isActive": true
   }
   ```

3. **List Products**
   - Method: GET
   - URL: `{{baseUrl}}/api/products`
   - Params: page=1, limit=10

4. **Get Product**
   - Method: GET
   - URL: `{{baseUrl}}/api/products/{{productId}}`

5. **Update Product**
   - Method: PUT
   - URL: `{{baseUrl}}/api/products/{{productId}}`

6. **Delete Product**
   - Method: DELETE
   - URL: `{{baseUrl}}/api/products/{{productId}}`

### Environment Variables

```json
{
  "baseUrl": "http://localhost:5001/<project-id>/<region>/api",
  "productId": ""
}
```

## 📊 Exemplos de Filtros Avançados

```bash
# Produtos eletrônicos ativos, página 2, 20 itens
curl -X GET "http://localhost:5001/<project-id>/<region>/api/api/products?category=electronics&isActive=true&page=2&limit=20"

# Buscar produtos que começam com "Mac"
curl -X GET "http://localhost:5001/<project-id>/<region>/api/api/products?search=Mac"

# Combinar múltiplos filtros
curl -X GET "http://localhost:5001/<project-id>/<region>/api/api/products?category=electronics&search=MacBook&isActive=true&page=1&limit=5"
```

