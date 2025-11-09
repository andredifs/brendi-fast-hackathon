# Multi-stage build para otimizar o tamanho da imagem
FROM node:20-alpine AS base

# Instalar dependências necessárias
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
COPY nuxt.config.ts ./
COPY tsconfig.json ./

# Instalar dependências
RUN npm ci --only=production && npm cache clean --force

# Stage de build
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar package files
COPY package*.json ./
COPY nuxt.config.ts ./
COPY tsconfig.json ./

# Instalar todas as dependências (incluindo dev)
RUN npm ci && npm cache clean --force

# Copiar código fonte
COPY app ./app
COPY public ./public
COPY server ./server

# Build da aplicação
RUN npm run build

# Stage de produção
FROM node:20-alpine AS runner

WORKDIR /app

# Criar usuário não-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nuxtjs

# Copiar apenas o necessário para rodar
COPY --from=builder --chown=nuxtjs:nodejs /app/.output /app/.output
COPY --from=builder --chown=nuxtjs:nodejs /app/package.json /app/package.json

USER nuxtjs

# Configurar variáveis de ambiente
ENV NODE_ENV=production
ENV PORT=8080
ENV HOST=0.0.0.0
ENV NITRO_PORT=8080
ENV NITRO_HOST=0.0.0.0

EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8080/', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Comando para iniciar a aplicação
CMD ["node", ".output/server/index.mjs"]
