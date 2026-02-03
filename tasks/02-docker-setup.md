# 02 - Docker Setup

## Objetivo
Containerizar a aplicacao com Docker e Docker Compose para ambientes de desenvolvimento e producao.

## Status: Concluido

---

## Tarefas

### 2.1 Dockerfile do Frontend
- [x] Criar `docker/frontend/Dockerfile`
- [x] Configurar multi-stage build (build + nginx)
- [x] Otimizar para producao
- [x] Criar `docker/frontend/Dockerfile.dev` para desenvolvimento

### 2.2 Dockerfile do Backend
- [x] Criar `docker/backend/Dockerfile`
- [x] Configurar multi-stage build
- [x] Configurar healthcheck
- [x] Criar `docker/backend/Dockerfile.dev` para desenvolvimento

### 2.3 Nginx Configuration
- [x] Criar `docker/frontend/nginx.conf`
- [x] Configurar proxy reverso para API
- [x] Configurar cache de assets estaticos
- [x] Configurar gzip compression

### 2.4 Docker Compose - Producao
- [x] Criar `docker-compose.yml`
- [x] Configurar servicos: frontend, backend, postgres, redis
- [x] Configurar networks
- [x] Configurar volumes

### 2.5 Docker Compose - Desenvolvimento
- [x] Criar `docker-compose.dev.yml`
- [x] Configurar hot-reload para frontend e backend
- [x] Configurar volumes para codigo fonte

### 2.6 Arquivos auxiliares
- [x] Criar `.dockerignore`

---

## Arquivos a Criar

### docker/frontend.Dockerfile
```dockerfile
# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Instalar pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copiar arquivos de dependencias
COPY frontend/package.json frontend/pnpm-lock.yaml ./

# Instalar dependencias
RUN pnpm install --frozen-lockfile

# Copiar codigo fonte
COPY frontend/ .

# Build
RUN pnpm build

# Production stage
FROM nginx:alpine

# Copiar configuracao nginx
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Copiar arquivos buildados
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### docker/backend.Dockerfile
```dockerfile
# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY backend/package.json backend/pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY backend/ .

RUN pnpm build

# Production stage
FROM node:20-alpine

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY --from=builder /app/package.json /app/pnpm-lock.yaml ./
COPY --from=builder /app/dist ./dist

RUN pnpm install --frozen-lockfile --prod

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

CMD ["node", "dist/main.js"]
```

### docker/nginx.conf
```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml application/javascript;

    # Assets com cache longo
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Proxy para API
    location /api {
        proxy_pass http://backend:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### docker-compose.yml
```yaml
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: docker/frontend.Dockerfile
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - cdc-network
    restart: unless-stopped

  backend:
    build:
      context: .
      dockerfile: docker/backend.Dockerfile
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:postgres@postgres:5432/cdc_fotus
      - REDIS_URL=redis://redis:6379
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_started
    networks:
      - cdc-network
    restart: unless-stopped

  postgres:
    image: postgres:16-alpine
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=cdc_fotus
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5
    networks:
      - cdc-network
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    networks:
      - cdc-network
    restart: unless-stopped

networks:
  cdc-network:
    driver: bridge

volumes:
  postgres_data:
  redis_data:
```

### docker-compose.dev.yml
```yaml
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: docker/frontend.dev.Dockerfile
    ports:
      - "5173:5173"
    volumes:
      - ./frontend:/app
      - /app/node_modules
    environment:
      - VITE_API_URL=http://localhost:3000
    depends_on:
      - backend
    networks:
      - cdc-network

  backend:
    build:
      context: .
      dockerfile: docker/backend.dev.Dockerfile
    ports:
      - "3000:3000"
      - "9229:9229"
    volumes:
      - ./backend:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://postgres:postgres@postgres:5432/cdc_fotus
      - REDIS_URL=redis://redis:6379
    depends_on:
      - postgres
      - redis
    networks:
      - cdc-network

  postgres:
    image: postgres:16-alpine
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=cdc_fotus
    volumes:
      - postgres_data_dev:/var/lib/postgresql/data
    networks:
      - cdc-network

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    networks:
      - cdc-network

networks:
  cdc-network:
    driver: bridge

volumes:
  postgres_data_dev:
```

### .dockerignore
```
node_modules
dist
.git
.gitignore
*.md
.env*
.vscode
.idea
coverage
.nyc_output
```

---

## Validacao

- [x] `docker-compose build` executa sem erros
- [x] `docker-compose up` inicia todos os servicos
- [x] Frontend acessivel em http://localhost:5173 (dev)
- [x] Backend responde em http://localhost:3000/api/health
- [x] Hot-reload funciona no modo desenvolvimento
- [x] Database conectado e seed executado

---

## Dependencias
- 01-monorepo-structure
- 04-backend-setup

## Bloqueia
- Nenhuma (task final de DevOps)
