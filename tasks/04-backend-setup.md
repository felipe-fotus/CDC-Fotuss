# 04 - Backend Setup

## Objetivo
Criar a estrutura inicial do backend com Node.js, Express/Fastify, e configuracoes de banco de dados.

## Status: Concluido

---

## Tarefas

### 4.1 Inicializar projeto backend
- [x] Criar pasta `backend/`
- [x] Inicializar package.json
- [x] Instalar dependencias principais
- [x] Configurar TypeScript
- [ ] Configurar ESLint e Prettier (opcional)

### 4.2 Estrutura de pastas
- [x] Criar estrutura de pastas (src/, etc)
- [x] Configurar paths aliases
- [x] Criar arquivos base (main.ts, app.ts)

### 4.3 Configurar framework web
- [x] Escolher framework (Fastify)
- [x] Configurar middlewares (cors, helmet, etc)
- [x] Configurar error handling global
- [x] Configurar logging (pino)

### 4.4 Configurar banco de dados
- [x] Escolher ORM (Prisma)
- [x] Criar schema inicial
- [x] Configurar migrations
- [x] Criar seed data

### 4.5 Criar modulos iniciais
- [x] Modulo de Health Check
- [x] Modulo de Contratos (CRUD)
- [x] Modulo de Clientes
- [x] Modulo de Parcelas (integrado em Contratos)

### 4.6 Configurar testes
- [ ] Setup Vitest (estrutura criada)
- [ ] Criar testes unitarios exemplo
- [ ] Criar testes de integracao exemplo

---

## Arquivos a Criar

### backend/package.json
```json
{
  "name": "@cdc-fotus/backend",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "tsx watch src/main.ts",
    "build": "tsup src/main.ts --format esm --dts",
    "start": "node dist/main.js",
    "lint": "eslint src/",
    "test": "vitest",
    "test:cov": "vitest --coverage",
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev",
    "db:push": "prisma db push",
    "db:seed": "tsx prisma/seed.ts"
  },
  "dependencies": {
    "@fastify/cors": "^10.0.0",
    "@fastify/helmet": "^13.0.0",
    "@prisma/client": "^6.0.0",
    "fastify": "^5.0.0",
    "pino": "^9.0.0",
    "zod": "^3.24.0"
  },
  "devDependencies": {
    "@types/node": "^24.0.0",
    "prisma": "^6.0.0",
    "tsup": "^8.0.0",
    "tsx": "^4.0.0",
    "typescript": "~5.9.3",
    "vitest": "^3.0.0"
  }
}
```

### backend/tsconfig.json
```json
{
  "extends": "../tsconfig.base.json",
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "outDir": "./dist",
    "rootDir": "./src",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### backend/src/main.ts
```typescript
import { createApp } from './app';
import { env } from './config/env';
import { logger } from './config/logger';

async function bootstrap() {
  const app = await createApp();

  try {
    await app.listen({ port: env.PORT, host: '0.0.0.0' });
    logger.info(`Server running on port ${env.PORT}`);
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
}

bootstrap();
```

### backend/src/app.ts
```typescript
import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import { healthRoutes } from './modules/health/health.routes';
import { contractsRoutes } from './modules/contracts/contracts.routes';
import { errorHandler } from './shared/errors/error-handler';

export async function createApp() {
  const app = Fastify({
    logger: true,
  });

  // Plugins
  await app.register(cors, { origin: true });
  await app.register(helmet);

  // Error handler
  app.setErrorHandler(errorHandler);

  // Routes
  await app.register(healthRoutes, { prefix: '/api/health' });
  await app.register(contractsRoutes, { prefix: '/api/contracts' });

  return app;
}
```

### backend/src/config/env.ts
```typescript
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string(),
  REDIS_URL: z.string().optional(),
});

export const env = envSchema.parse(process.env);
```

### backend/prisma/schema.prisma
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Cliente {
  id        String   @id @default(cuid())
  nome      String
  cpfCnpj   String   @unique @map("cpf_cnpj")
  email     String?
  telefone  String?
  endereco  Json?
  contratos Contrato[]
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("clientes")
}

model Contrato {
  id                String    @id @default(cuid())
  clienteId         String    @map("cliente_id")
  cliente           Cliente   @relation(fields: [clienteId], references: [id])
  integrador        String
  integradorCnpj    String    @map("integrador_cnpj")
  origemContrato    String    @map("origem_contrato")
  dataContratacao   DateTime  @map("data_contratacao")
  valorTotal        Decimal   @map("valor_total") @db.Decimal(12, 2)
  valorEntrada      Decimal   @map("valor_entrada") @db.Decimal(12, 2)
  quantidadeParcelas Int      @map("quantidade_parcelas")
  taxaJuros         Decimal   @map("taxa_juros") @db.Decimal(5, 2)
  status            String
  parcelas          Parcela[]
  createdAt         DateTime  @default(now()) @map("created_at")
  updatedAt         DateTime  @updatedAt @map("updated_at")

  @@map("contratos")
}

model Parcela {
  id              String    @id @default(cuid())
  contratoId      String    @map("contrato_id")
  contrato        Contrato  @relation(fields: [contratoId], references: [id])
  numero          Int
  dataVencimento  DateTime  @map("data_vencimento")
  dataPagamento   DateTime? @map("data_pagamento")
  valorOriginal   Decimal   @map("valor_original") @db.Decimal(12, 2)
  valorAtualizado Decimal   @map("valor_atualizado") @db.Decimal(12, 2)
  valorPago       Decimal?  @map("valor_pago") @db.Decimal(12, 2)
  status          String

  @@map("parcelas")
}
```

---

## Estrutura Final

```
backend/
├── src/
│   ├── config/
│   │   ├── env.ts
│   │   ├── logger.ts
│   │   └── database.ts
│   │
│   ├── modules/
│   │   ├── health/
│   │   │   ├── health.routes.ts
│   │   │   └── health.controller.ts
│   │   │
│   │   ├── contracts/
│   │   │   ├── contracts.routes.ts
│   │   │   ├── contracts.controller.ts
│   │   │   ├── contracts.service.ts
│   │   │   ├── contracts.repository.ts
│   │   │   └── contracts.schema.ts
│   │   │
│   │   ├── clients/
│   │   │   └── ...
│   │   │
│   │   └── installments/
│   │       └── ...
│   │
│   ├── shared/
│   │   ├── errors/
│   │   │   ├── error-handler.ts
│   │   │   └── app-error.ts
│   │   └── utils/
│   │       └── ...
│   │
│   ├── app.ts
│   └── main.ts
│
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
│
├── tests/
│   ├── unit/
│   └── integration/
│
├── package.json
├── tsconfig.json
└── .env.example
```

---

## Endpoints da API

| Metodo | Rota | Descricao |
|--------|------|-----------|
| GET | /api/health | Health check |
| GET | /api/contracts | Listar contratos inadimplentes |
| GET | /api/contracts/:id | Detalhe do contrato |
| GET | /api/contracts/:id/installments | Parcelas do contrato |
| GET | /api/clients/:id | Dados do cliente |

---

## Validacao

- [ ] `pnpm dev` inicia o servidor
- [ ] Health check responde em /api/health
- [ ] Prisma conecta ao banco
- [ ] Migrations funcionam
- [ ] Testes passam

---

## Dependencias
- 01-monorepo-structure

## Bloqueia
- 02-docker-setup
