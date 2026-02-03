# 01 - Estrutura Monorepo

## Objetivo
Reestruturar o projeto em um monorepo com separacao clara entre frontend, backend e pacotes compartilhados.

## Status: Concluido

---

## Tarefas

### 1.1 Criar estrutura de diretorios raiz
- [x] Criar pasta `frontend/`
- [x] Criar pasta `backend/`
- [x] Criar pasta `packages/`
- [x] Criar pasta `docker/`

### 1.2 Configurar workspace root
- [x] Criar `package.json` raiz com workspaces
- [x] Criar `pnpm-workspace.yaml`
- [x] Configurar scripts globais no package.json raiz

### 1.3 Mover frontend existente
- [x] Mover conteudo de `src/` para `frontend/src/`
- [x] Mover `public/` para `frontend/public/`
- [x] Mover arquivos de configuracao (vite, tsconfig, eslint)
- [x] Atualizar `package.json` do frontend
- [x] Atualizar paths e imports

### 1.4 Configurar TypeScript do monorepo
- [x] Criar `tsconfig.base.json` na raiz
- [x] Configurar references entre projetos
- [x] Configurar paths aliases

---

## Arquivos a Criar

### package.json (raiz)
```json
{
  "name": "cdc-fotus",
  "private": true,
  "version": "1.0.0",
  "scripts": {
    "dev": "pnpm -r --parallel run dev",
    "dev:frontend": "pnpm --filter frontend dev",
    "dev:backend": "pnpm --filter backend dev",
    "build": "pnpm -r run build",
    "lint": "pnpm -r run lint",
    "test": "pnpm -r run test",
    "docker:dev": "docker-compose -f docker-compose.dev.yml up",
    "docker:build": "docker-compose build",
    "docker:up": "docker-compose up -d"
  },
  "devDependencies": {
    "typescript": "~5.9.3"
  },
  "engines": {
    "node": ">=20.0.0",
    "pnpm": ">=9.0.0"
  }
}
```

### pnpm-workspace.yaml
```yaml
packages:
  - 'frontend'
  - 'backend'
  - 'packages/*'
```

### tsconfig.base.json
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  }
}
```

---

## Comandos para Executar

```bash
# 1. Criar estrutura
mkdir -p frontend backend packages docker

# 2. Mover frontend
mv src frontend/
mv public frontend/
mv vite.config.ts frontend/
mv tsconfig.app.json frontend/
mv tsconfig.node.json frontend/
mv eslint.config.js frontend/
mv index.html frontend/

# 3. Atualizar package.json do frontend
# (renomear para @cdc-fotus/frontend)

# 4. Reinstalar dependencias
pnpm install
```

---

## Validacao

- [ ] `pnpm install` executa sem erros
- [ ] `pnpm dev:frontend` inicia o frontend
- [ ] Aplicacao funciona normalmente no browser
- [ ] TypeScript compila sem erros

---

## Dependencias
- Nenhuma (primeira task)

## Bloqueia
- 02-docker-setup
- 04-backend-setup
- 05-frontend-refactor
- 06-shared-packages
