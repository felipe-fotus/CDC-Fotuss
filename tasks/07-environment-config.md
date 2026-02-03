# 07 - Environment Config

## Objetivo
Configurar variaveis de ambiente, secrets e configuracoes de deploy para todos os ambientes.

## Status: Pendente

---

## Tarefas

### 7.1 Configuracao de ambiente local
- [ ] Criar `.env.example` na raiz
- [ ] Criar `.env.example` no frontend
- [ ] Criar `.env.example` no backend
- [ ] Documentar todas as variaveis

### 7.2 Configuracao de producao
- [ ] Criar `.env.production.example`
- [ ] Configurar variaveis de banco de dados
- [ ] Configurar variaveis de seguranca
- [ ] Configurar URLs de servicos

### 7.3 Git e seguranca
- [ ] Atualizar `.gitignore`
- [ ] Verificar que secrets nao estao commitados
- [ ] Adicionar pre-commit hook para verificar secrets

### 7.4 Documentacao
- [ ] Documentar processo de setup local
- [ ] Documentar variaveis obrigatorias vs opcionais
- [ ] Criar script de validacao de ambiente

---

## Arquivos a Criar

### .env.example (raiz)
```env
# ============================================
# CDC Fotus - Variaveis de Ambiente
# ============================================

# Ambiente
NODE_ENV=development

# ============================================
# Database
# ============================================
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/cdc_fotus

# ============================================
# Redis (opcional)
# ============================================
REDIS_URL=redis://localhost:6379

# ============================================
# Backend
# ============================================
BACKEND_PORT=3000
BACKEND_HOST=0.0.0.0

# JWT (se implementar autenticacao)
# JWT_SECRET=your-super-secret-key-change-in-production
# JWT_EXPIRES_IN=7d

# ============================================
# Frontend
# ============================================
VITE_API_URL=http://localhost:3000/api

# ============================================
# Logging
# ============================================
LOG_LEVEL=debug

# ============================================
# Docker
# ============================================
COMPOSE_PROJECT_NAME=cdc-fotus
```

### frontend/.env.example
```env
# Frontend Environment Variables
# Copie para .env e ajuste os valores

# URL da API Backend
VITE_API_URL=http://localhost:3000/api

# Ambiente (development | production)
VITE_APP_ENV=development

# Habilitar modo debug (true | false)
VITE_DEBUG=true
```

### backend/.env.example
```env
# Backend Environment Variables
# Copie para .env e ajuste os valores

# ============================================
# Servidor
# ============================================
NODE_ENV=development
PORT=3000
HOST=0.0.0.0

# ============================================
# Database
# ============================================
# PostgreSQL connection string
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/cdc_fotus

# ============================================
# Redis (cache, opcional)
# ============================================
REDIS_URL=redis://localhost:6379

# ============================================
# Logging
# ============================================
LOG_LEVEL=debug
# Valores: fatal, error, warn, info, debug, trace

# ============================================
# CORS
# ============================================
CORS_ORIGIN=http://localhost:5173

# ============================================
# Rate Limiting (opcional)
# ============================================
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW_MS=60000
```

### .gitignore (atualizado)
```gitignore
# Dependencies
node_modules/
.pnpm-store/

# Build outputs
dist/
build/
.next/
out/

# Environment files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
.env.*.local

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Testing
coverage/
.nyc_output/

# Cache
.cache/
.turbo/
.eslintcache
*.tsbuildinfo

# Docker
.docker/

# Prisma
prisma/migrations/.migration_lock.toml

# Secrets (NUNCA commitar)
*.pem
*.key
*.crt
secrets/
credentials.json
service-account.json
```

### scripts/validate-env.ts
```typescript
#!/usr/bin/env tsx

/**
 * Script para validar variaveis de ambiente
 * Uso: pnpm validate-env
 */

import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

interface EnvVar {
  name: string;
  required: boolean;
  description: string;
}

const requiredVars: EnvVar[] = [
  { name: 'DATABASE_URL', required: true, description: 'PostgreSQL connection string' },
  { name: 'NODE_ENV', required: false, description: 'Environment (development/production)' },
  { name: 'PORT', required: false, description: 'Backend server port' },
];

function validateEnv() {
  console.log('🔍 Validando variaveis de ambiente...\n');

  const errors: string[] = [];
  const warnings: string[] = [];

  for (const envVar of requiredVars) {
    const value = process.env[envVar.name];

    if (!value && envVar.required) {
      errors.push(`❌ ${envVar.name} - ${envVar.description} (OBRIGATORIO)`);
    } else if (!value) {
      warnings.push(`⚠️  ${envVar.name} - ${envVar.description} (opcional)`);
    } else {
      console.log(`✅ ${envVar.name} = ${maskValue(value)}`);
    }
  }

  if (warnings.length > 0) {
    console.log('\n⚠️  Variaveis opcionais nao definidas:');
    warnings.forEach(w => console.log(`   ${w}`));
  }

  if (errors.length > 0) {
    console.log('\n❌ Variaveis obrigatorias faltando:');
    errors.forEach(e => console.log(`   ${e}`));
    console.log('\n💡 Copie .env.example para .env e configure as variaveis');
    process.exit(1);
  }

  console.log('\n✅ Todas as variaveis obrigatorias estao configuradas!');
}

function maskValue(value: string): string {
  if (value.length <= 8) return '****';
  return value.substring(0, 4) + '****' + value.substring(value.length - 4);
}

validateEnv();
```

### docs/SETUP.md
```markdown
# Setup do Ambiente de Desenvolvimento

## Pre-requisitos

- Node.js >= 20.0.0
- pnpm >= 9.0.0
- Docker e Docker Compose (opcional, recomendado)
- PostgreSQL 16+ (se nao usar Docker)
- Redis 7+ (opcional, se nao usar Docker)

## Instalacao Rapida (com Docker)

```bash
# 1. Clone o repositorio
git clone <repo-url>
cd cdc-fotus

# 2. Copie os arquivos de ambiente
cp .env.example .env
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env

# 3. Inicie os servicos com Docker
docker-compose -f docker-compose.dev.yml up -d

# 4. Instale as dependencias
pnpm install

# 5. Execute as migrations
pnpm --filter backend db:migrate

# 6. (Opcional) Popule com dados de exemplo
pnpm --filter backend db:seed

# 7. Inicie o desenvolvimento
pnpm dev
```

## Instalacao Manual (sem Docker)

### 1. Banco de Dados

Instale PostgreSQL e crie o banco:

```sql
CREATE DATABASE cdc_fotus;
```

### 2. Configuracao

```bash
# Copie e configure os arquivos de ambiente
cp .env.example .env

# Edite .env com suas configuracoes
# DATABASE_URL=postgresql://user:pass@localhost:5432/cdc_fotus
```

### 3. Instalacao

```bash
# Instale dependencias
pnpm install

# Gere o client Prisma
pnpm --filter backend db:generate

# Execute migrations
pnpm --filter backend db:migrate
```

### 4. Desenvolvimento

```bash
# Inicie todos os servicos
pnpm dev

# Ou individualmente:
pnpm dev:frontend  # http://localhost:5173
pnpm dev:backend   # http://localhost:3000
```

## Validacao

```bash
# Verifique se o ambiente esta configurado
pnpm validate-env

# Teste a conexao com banco
pnpm --filter backend db:push --dry-run
```

## Portas Utilizadas

| Servico | Porta | Descricao |
|---------|-------|-----------|
| Frontend | 5173 | Vite dev server |
| Backend | 3000 | API REST |
| PostgreSQL | 5432 | Banco de dados |
| Redis | 6379 | Cache (opcional) |

## Troubleshooting

### Erro de conexao com banco
- Verifique se PostgreSQL esta rodando
- Verifique DATABASE_URL no .env
- Verifique se o banco existe

### Erro de permissao no Docker
- Execute: `docker-compose down -v` e tente novamente
- Verifique permissoes da pasta

### Porta ja em uso
- Verifique processos: `lsof -i :3000`
- Mate o processo ou mude a porta no .env
```

---

## Estrutura de Arquivos de Ambiente

```
cdc-fotus/
├── .env                    # Variaveis da raiz (nao commitado)
├── .env.example            # Template com todas as variaveis
├── .gitignore              # Ignora arquivos .env
│
├── frontend/
│   ├── .env                # Variaveis do frontend (nao commitado)
│   └── .env.example        # Template frontend
│
├── backend/
│   ├── .env                # Variaveis do backend (nao commitado)
│   └── .env.example        # Template backend
│
├── scripts/
│   └── validate-env.ts     # Script de validacao
│
└── docs/
    └── SETUP.md            # Documentacao de setup
```

---

## Validacao

- [ ] `.env.example` criados para todos os projetos
- [ ] `.gitignore` atualizado corretamente
- [ ] Nenhum secret commitado no repositorio
- [ ] Script de validacao funciona
- [ ] Documentacao de setup completa
- [ ] `pnpm dev` funciona apos seguir o setup

---

## Dependencias
- 01-monorepo-structure

## Bloqueia
- 02-docker-setup
- 04-backend-setup
