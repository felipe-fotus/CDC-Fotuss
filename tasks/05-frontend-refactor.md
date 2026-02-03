# 05 - Frontend Refactor

## Objetivo
Mover o frontend existente para a nova estrutura do monorepo e atualizar para consumir a API real.

## Status: Pendente

---

## Tarefas

### 5.1 Mover para nova estrutura
- [ ] Mover todos os arquivos de `src/` para `frontend/src/`
- [ ] Mover arquivos de configuracao
- [ ] Atualizar package.json
- [ ] Atualizar imports e paths

### 5.2 Configurar consumo da API
- [ ] Criar cliente HTTP (axios ou fetch wrapper)
- [ ] Configurar base URL da API
- [ ] Criar hooks de data fetching (React Query ou SWR)
- [ ] Implementar error handling

### 5.3 Atualizar services
- [ ] Atualizar `contractsService.ts` para usar API real
- [ ] Criar tipos compartilhados
- [ ] Implementar caching

### 5.4 Configurar ambiente
- [ ] Criar `.env` com variaveis
- [ ] Configurar VITE_API_URL
- [ ] Criar `.env.example`

### 5.5 Usar Design System
- [ ] Importar componentes do Design System
- [ ] Substituir componentes locais
- [ ] Aplicar tokens de cores/spacing

### 5.6 Melhorias
- [ ] Adicionar loading states
- [ ] Adicionar error boundaries
- [ ] Implementar retry logic
- [ ] Adicionar testes

---

## Arquivos a Atualizar/Criar

### frontend/package.json
```json
{
  "name": "@cdc-fotus/frontend",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint src/",
    "preview": "vite preview",
    "test": "vitest",
    "test:cov": "vitest --coverage"
  },
  "dependencies": {
    "@cdc-fotus/design-system": "workspace:*",
    "@cdc-fotus/types": "workspace:*",
    "@tanstack/react-query": "^5.0.0",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "react-router-dom": "^7.13.0"
  },
  "devDependencies": {
    "@eslint/js": "^9.39.1",
    "@types/react": "^19.2.5",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^5.1.1",
    "eslint": "^9.39.1",
    "typescript": "~5.9.3",
    "vite": "^7.2.4",
    "vitest": "^3.0.0"
  }
}
```

### frontend/src/lib/api.ts
```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { params, ...init } = options;

    let url = `${this.baseUrl}${endpoint}`;
    if (params) {
      const searchParams = new URLSearchParams(params);
      url += `?${searchParams.toString()}`;
    }

    const response = await fetch(url, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...init.headers,
      },
    });

    if (!response.ok) {
      throw new ApiError(response.status, await response.text());
    }

    return response.json();
  }

  get<T>(endpoint: string, options?: RequestOptions) {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  post<T>(endpoint: string, data?: unknown, options?: RequestOptions) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export const api = new ApiClient(API_URL);
```

### frontend/src/lib/query-client.ts
```typescript
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
});
```

### frontend/src/modules/inadimplencia/hooks/useContracts.ts (atualizado)
```typescript
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { Contract, ContractFilters } from '@cdc-fotus/types';

export function useContracts(filters?: ContractFilters) {
  return useQuery({
    queryKey: ['contracts', filters],
    queryFn: () => api.get<Contract[]>('/contracts', { params: filters }),
  });
}

export function useContract(id: string) {
  return useQuery({
    queryKey: ['contracts', id],
    queryFn: () => api.get<ContractDetail>(`/contracts/${id}`),
    enabled: !!id,
  });
}
```

### frontend/.env.example
```env
VITE_API_URL=http://localhost:3000/api
```

### frontend/vite.config.ts (atualizado)
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
```

---

## Estrutura Final

```
frontend/
├── src/
│   ├── app/
│   │   ├── routes.tsx
│   │   └── AppShell.tsx
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   └── Navbar.tsx
│   │   └── ui/           # Pode ser removido se usar design-system
│   │
│   ├── contexts/
│   │   └── ThemeContext.tsx
│   │
│   ├── lib/
│   │   ├── api.ts
│   │   ├── query-client.ts
│   │   └── dates.ts
│   │
│   ├── modules/
│   │   ├── inadimplencia/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── pages/
│   │   │   ├── services/
│   │   │   ├── types/
│   │   │   └── utils/
│   │   │
│   │   └── contratos/
│   │       └── pages/
│   │
│   ├── styles/
│   │   └── globals.css
│   │
│   ├── App.tsx
│   └── main.tsx
│
├── public/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── .env
└── .env.example
```

---

## Validacao

- [ ] `pnpm dev:frontend` inicia sem erros
- [ ] Aplicacao carrega no browser
- [ ] Conexao com API funciona
- [ ] Filtros funcionam
- [ ] Navegacao funciona
- [ ] Tema light/dark funciona
- [ ] Design System integrado

---

## Dependencias
- 01-monorepo-structure
- 04-backend-setup
- 06-shared-packages

## Bloqueia
- Nenhuma
