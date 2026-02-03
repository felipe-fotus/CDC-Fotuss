# 06 - Shared Packages

## Objetivo
Criar pacotes compartilhados entre frontend e backend para types, utils e validacoes.

## Status: Pendente

---

## Tarefas

### 6.1 Package de Types
- [ ] Criar `packages/types/`
- [ ] Definir interfaces compartilhadas
- [ ] Configurar build e exports
- [ ] Documentar tipos

### 6.2 Package de Utils
- [ ] Criar `packages/utils/`
- [ ] Mover funcoes de formatacao
- [ ] Mover funcoes de datas
- [ ] Mover validacoes

### 6.3 Package de Validators
- [ ] Criar `packages/validators/`
- [ ] Criar schemas Zod compartilhados
- [ ] Validacoes de contrato
- [ ] Validacoes de cliente

### 6.4 Configurar exports
- [ ] Configurar package.json de cada pacote
- [ ] Configurar TypeScript
- [ ] Testar imports no frontend e backend

---

## Arquivos a Criar

### packages/types/package.json
```json
{
  "name": "@cdc-fotus/types",
  "version": "1.0.0",
  "private": true,
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "scripts": {
    "build": "tsup src/index.ts --format cjs,esm --dts",
    "dev": "tsup src/index.ts --format cjs,esm --dts --watch"
  },
  "devDependencies": {
    "tsup": "^8.0.0",
    "typescript": "~5.9.3"
  }
}
```

### packages/types/src/index.ts
```typescript
// ============================================
// Entidades Base
// ============================================

export interface Endereco {
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

export interface Cliente {
  id: string;
  nome: string;
  cpfCnpj: string;
  email?: string;
  telefone?: string;
  endereco?: Endereco;
}

export interface Parcela {
  id: string;
  numero: number;
  dataVencimento: string;
  dataPagamento?: string;
  valorOriginal: number;
  valorAtualizado: number;
  valorPago?: number;
  status: ParcelaStatus;
  diasAtraso: number;
}

export type ParcelaStatus = 'paga' | 'em_atraso' | 'a_vencer';

// ============================================
// Contrato
// ============================================

export interface Contract {
  id: string;
  clientePagante: string;
  integrador: string;
  origemContrato: string;
  dataVencimento: string;
  diasAtraso: number;
  valorAtraso: number;
  status: string;
}

export interface ContractDetail {
  id: string;
  dataContratacao: string;
  valorTotal: number;
  valorEntrada: number;
  quantidadeParcelas: number;
  taxaJuros: number;
  origemContrato: string;
  status: string;
  cliente: Cliente;
  integrador: string;
  integradorCnpj: string;
  parcelas: Parcela[];
  parcelasEmAtraso: number;
  valorTotalAtraso: number;
  diasAtrasoMaisAntigo: number;
  dataVencimentoMaisAntigo: string;
}

// ============================================
// Filtros e Ordenacao
// ============================================

export interface ContractFilters {
  search?: string;
  delayRanges?: string[];
  origins?: string[];
  statuses?: string[];
}

export interface SortConfig {
  field: keyof Contract;
  direction: 'asc' | 'desc';
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ============================================
// Criticidade
// ============================================

export type CriticalityLevel = 'low' | 'medium' | 'high' | 'critical';

export interface CriticalityConfig {
  level: CriticalityLevel;
  label: string;
  minDays?: number;
  maxDays?: number;
  minValue?: number;
}

// ============================================
// API Responses
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

// ============================================
// Metricas
// ============================================

export interface ContractMetrics {
  totalContracts: number;
  totalValueInDelay: number;
  averageDelayDays: number;
  criticalCount: number;
}
```

### packages/utils/package.json
```json
{
  "name": "@cdc-fotus/utils",
  "version": "1.0.0",
  "private": true,
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "scripts": {
    "build": "tsup src/index.ts --format cjs,esm --dts",
    "dev": "tsup src/index.ts --format cjs,esm --dts --watch",
    "test": "vitest"
  },
  "devDependencies": {
    "tsup": "^8.0.0",
    "typescript": "~5.9.3",
    "vitest": "^3.0.0"
  }
}
```

### packages/utils/src/index.ts
```typescript
export * from './formatters';
export * from './dates';
export * from './criticality';
```

### packages/utils/src/formatters.ts
```typescript
/**
 * Formata valor em reais (BRL)
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

/**
 * Formata CPF (000.000.000-00)
 */
export function formatCPF(cpf: string): string {
  const cleaned = cpf.replace(/\D/g, '');
  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

/**
 * Formata CNPJ (00.000.000/0000-00)
 */
export function formatCNPJ(cnpj: string): string {
  const cleaned = cnpj.replace(/\D/g, '');
  return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}

/**
 * Formata CPF ou CNPJ baseado no tamanho
 */
export function formatCPFCNPJ(value: string): string {
  const cleaned = value.replace(/\D/g, '');
  return cleaned.length <= 11 ? formatCPF(cleaned) : formatCNPJ(cleaned);
}

/**
 * Formata telefone
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
}

/**
 * Formata numero com separador de milhar
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('pt-BR').format(value);
}

/**
 * Formata porcentagem
 */
export function formatPercent(value: number, decimals = 2): string {
  return `${value.toFixed(decimals)}%`;
}
```

### packages/utils/src/dates.ts
```typescript
/**
 * Formata data para exibicao (DD/MM/YYYY)
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('pt-BR');
}

/**
 * Formata data completa (DD/MM/YYYY HH:mm)
 */
export function formatDateTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('pt-BR');
}

/**
 * Calcula dias de atraso a partir de uma data
 */
export function calculateDelayDays(dueDate: string | Date): number {
  const due = typeof dueDate === 'string' ? new Date(dueDate) : dueDate;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - due.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return Math.max(0, diffDays);
}

/**
 * Verifica se uma data esta vencida
 */
export function isOverdue(dueDate: string | Date): boolean {
  return calculateDelayDays(dueDate) > 0;
}

/**
 * Retorna data formatada para API (YYYY-MM-DD)
 */
export function toAPIDate(date: Date): string {
  return date.toISOString().split('T')[0];
}
```

### packages/utils/src/criticality.ts
```typescript
import type { CriticalityLevel } from '@cdc-fotus/types';

interface CriticalityInput {
  diasAtraso: number;
  valorAtraso: number;
}

/**
 * Determina o nivel de criticidade baseado em dias e valor
 */
export function getCriticalityLevel(input: CriticalityInput): CriticalityLevel {
  const { diasAtraso, valorAtraso } = input;

  // Critico: dias >= 180 OU valor >= 50000
  if (diasAtraso >= 180 || valorAtraso >= 50000) {
    return 'critical';
  }

  // Alto: dias >= 90 OU valor >= 20000
  if (diasAtraso >= 90 || valorAtraso >= 20000) {
    return 'high';
  }

  // Medio: dias >= 30 OU valor >= 5000
  if (diasAtraso >= 30 || valorAtraso >= 5000) {
    return 'medium';
  }

  // Baixo: default
  return 'low';
}

/**
 * Retorna label em portugues para criticidade
 */
export function getCriticalityLabel(level: CriticalityLevel): string {
  const labels: Record<CriticalityLevel, string> = {
    low: 'Baixo',
    medium: 'Medio',
    high: 'Alto',
    critical: 'Critico',
  };
  return labels[level];
}

/**
 * Determina faixa de atraso baseado em dias
 */
export function getDelayRange(days: number): string {
  if (days <= 30) return 'D+30';
  if (days <= 60) return 'D+60';
  if (days <= 90) return 'D+90';
  if (days <= 120) return 'D+120';
  if (days <= 150) return 'D+150';
  if (days <= 180) return 'D+180';
  if (days <= 360) return 'D+360';
  if (days <= 540) return 'D+540';
  if (days <= 720) return 'D+720';
  if (days <= 900) return 'D+900';
  return 'D+1080';
}
```

---

## Estrutura Final

```
packages/
├── types/
│   ├── src/
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
│
├── utils/
│   ├── src/
│   │   ├── index.ts
│   │   ├── formatters.ts
│   │   ├── dates.ts
│   │   └── criticality.ts
│   ├── tests/
│   │   ├── formatters.test.ts
│   │   └── dates.test.ts
│   ├── package.json
│   └── tsconfig.json
│
└── design-system/
    └── ... (ver task 03)
```

---

## Uso nos Projetos

### No Frontend
```typescript
import type { Contract, ContractDetail } from '@cdc-fotus/types';
import { formatCurrency, formatDate, getCriticalityLevel } from '@cdc-fotus/utils';
```

### No Backend
```typescript
import type { Contract, PaginatedResponse } from '@cdc-fotus/types';
import { calculateDelayDays, getCriticalityLevel } from '@cdc-fotus/utils';
```

---

## Validacao

- [ ] Packages compilam sem erros
- [ ] Types importados corretamente no frontend
- [ ] Types importados corretamente no backend
- [ ] Utils funcionam em ambos os projetos
- [ ] Testes passam

---

## Dependencias
- 01-monorepo-structure

## Bloqueia
- 03-design-system
- 05-frontend-refactor
