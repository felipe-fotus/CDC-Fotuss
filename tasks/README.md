# CDC Fotus - Tasks de Estruturacao do Projeto

## Visao Geral

Este diretorio contem todas as tarefas necessarias para estruturar o projeto CDC Fotus em uma arquitetura profissional com separacao frontend/backend, containerizacao e Design System.

## Estrutura de Tasks

| Arquivo | Categoria | Prioridade |
|---------|-----------|------------|
| [01-monorepo-structure.md](./01-monorepo-structure.md) | Arquitetura | Alta |
| [02-docker-setup.md](./02-docker-setup.md) | DevOps | Alta |
| [03-design-system.md](./03-design-system.md) | Frontend | Media |
| [04-backend-setup.md](./04-backend-setup.md) | Backend | Alta |
| [05-frontend-refactor.md](./05-frontend-refactor.md) | Frontend | Media |
| [06-shared-packages.md](./06-shared-packages.md) | Arquitetura | Media |
| [07-environment-config.md](./07-environment-config.md) | DevOps | Alta |

## Ordem de Execucao Recomendada

```
1. 01-monorepo-structure    -> Criar estrutura de pastas
2. 07-environment-config    -> Configurar variaveis de ambiente
3. 04-backend-setup         -> Estruturar backend
4. 05-frontend-refactor     -> Mover frontend para nova estrutura
5. 06-shared-packages       -> Criar pacotes compartilhados
6. 03-design-system         -> Documentar e padronizar Design System
7. 02-docker-setup          -> Containerizar aplicacao
```

## Estrutura Final do Projeto

```
cdc-fotus/
├── frontend/                 # Aplicacao React
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   ├── Dockerfile
│   └── ...
│
├── backend/                  # API Node.js
│   ├── src/
│   ├── package.json
│   ├── Dockerfile
│   └── ...
│
├── packages/                 # Pacotes compartilhados
│   ├── design-system/       # Componentes e tokens
│   ├── types/               # TypeScript types compartilhados
│   └── utils/               # Utilitarios compartilhados
│
├── docs/                     # Documentacao
│   ├── DOCUMENTACAO.md
│   ├── API.md
│   └── DESIGN-SYSTEM.md
│
├── docker/                   # Configuracoes Docker
│   ├── frontend.Dockerfile
│   ├── backend.Dockerfile
│   └── nginx.conf
│
├── tasks/                    # Tasks de desenvolvimento
│
├── docker-compose.yml
├── docker-compose.dev.yml
├── package.json             # Workspace root
├── pnpm-workspace.yaml
└── README.md
```

## Progresso

- [x] 01 - Estrutura Monorepo (Concluido)
- [ ] 02 - Docker Setup
- [~] 03 - Design System (Tokens criados, falta componentes)
- [x] 04 - Backend Setup (Concluido)
- [ ] 05 - Frontend Refactor
- [x] 06 - Shared Packages (Concluido)
- [~] 07 - Environment Config (.env.example criados)

---

*Ultima atualizacao: 03/02/2026*
