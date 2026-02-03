# 03 - Design System

## Objetivo
Criar um Design System documentado e reutilizavel para o projeto CDC Fotus.

## Status: Pendente

---

## Tarefas

### 3.1 Estrutura do Design System
- [ ] Criar pasta `packages/design-system/`
- [ ] Configurar package.json
- [ ] Configurar TypeScript
- [ ] Configurar build (tsup ou vite library mode)

### 3.2 Design Tokens
- [ ] Criar tokens de cores (light/dark)
- [ ] Criar tokens de tipografia
- [ ] Criar tokens de espacamento
- [ ] Criar tokens de bordas e sombras
- [ ] Criar tokens de breakpoints
- [ ] Exportar como CSS variables e JS objects

### 3.3 Componentes Base
- [ ] Button (variants: primary, secondary, ghost, danger)
- [ ] Input (text, search, number)
- [ ] Select (single, multi)
- [ ] Badge (status, criticality)
- [ ] Table (sortable, clickable rows)
- [ ] Card
- [ ] Modal/Dialog
- [ ] Tooltip
- [ ] EmptyState
- [ ] Skeleton/Loading

### 3.4 Componentes de Layout
- [ ] Container
- [ ] Stack (vertical/horizontal)
- [ ] Grid
- [ ] Sidebar
- [ ] Header/Navbar

### 3.5 Documentacao
- [ ] Criar `docs/DESIGN-SYSTEM.md`
- [ ] Documentar todos os tokens
- [ ] Documentar props de cada componente
- [ ] Adicionar exemplos de uso
- [ ] (Opcional) Setup Storybook

---

## Arquivos a Criar

### packages/design-system/package.json
```json
{
  "name": "@cdc-fotus/design-system",
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
    },
    "./styles": "./dist/styles.css",
    "./tokens": {
      "import": "./dist/tokens.mjs",
      "require": "./dist/tokens.js",
      "types": "./dist/tokens.d.ts"
    }
  },
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "lint": "eslint src/",
    "typecheck": "tsc --noEmit"
  },
  "peerDependencies": {
    "react": ">=18.0.0",
    "react-dom": ">=18.0.0"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "tsup": "^8.0.0",
    "typescript": "~5.9.3"
  }
}
```

### packages/design-system/src/tokens/colors.ts
```typescript
export const colors = {
  // Brand
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },

  // Neutral
  slate: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  },

  // Semantic
  success: {
    light: '#f0fdf4',
    main: '#22c55e',
    dark: '#15803d',
  },
  warning: {
    light: '#fefce8',
    main: '#eab308',
    dark: '#a16207',
  },
  error: {
    light: '#fef2f2',
    main: '#ef4444',
    dark: '#b91c1c',
  },
  info: {
    light: '#eff6ff',
    main: '#3b82f6',
    dark: '#1d4ed8',
  },

  // Criticality (specific to CDC Fotus)
  criticality: {
    low: {
      bg: { light: '#f0fdf4', dark: 'rgba(34, 197, 94, 0.15)' },
      text: { light: '#15803d', dark: '#4ade80' },
    },
    medium: {
      bg: { light: '#fefce8', dark: 'rgba(234, 179, 8, 0.15)' },
      text: { light: '#a16207', dark: '#facc15' },
    },
    high: {
      bg: { light: '#fff7ed', dark: 'rgba(249, 115, 22, 0.15)' },
      text: { light: '#c2410c', dark: '#fb923c' },
    },
    critical: {
      bg: { light: '#fef2f2', dark: 'rgba(239, 68, 68, 0.15)' },
      text: { light: '#b91c1c', dark: '#f87171' },
    },
  },
} as const;

export type Colors = typeof colors;
```

### packages/design-system/src/tokens/typography.ts
```typescript
export const typography = {
  fontFamily: {
    sans: 'Inter, system-ui, -apple-system, sans-serif',
    mono: 'JetBrains Mono, Consolas, monospace',
  },

  fontSize: {
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    '2xl': '1.5rem',   // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
  },

  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },

  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  },
} as const;

export type Typography = typeof typography;
```

### packages/design-system/src/tokens/spacing.ts
```typescript
export const spacing = {
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
} as const;

export type Spacing = typeof spacing;
```

### packages/design-system/src/tokens/index.ts
```typescript
export * from './colors';
export * from './typography';
export * from './spacing';

// CSS variables generator
export function generateCSSVariables(theme: 'light' | 'dark'): string {
  // Implementation
}
```

### packages/design-system/src/components/Button/Button.tsx
```typescript
import { forwardRef, ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
    // Implementation
  }
);

Button.displayName = 'Button';
```

---

## Estrutura Final

```
packages/design-system/
├── src/
│   ├── tokens/
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   ├── spacing.ts
│   │   ├── shadows.ts
│   │   ├── borders.ts
│   │   └── index.ts
│   │
│   ├── components/
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.styles.ts
│   │   │   └── index.ts
│   │   ├── Input/
│   │   ├── Select/
│   │   ├── Badge/
│   │   ├── Table/
│   │   ├── Card/
│   │   ├── Modal/
│   │   └── index.ts
│   │
│   ├── hooks/
│   │   ├── useTheme.ts
│   │   └── index.ts
│   │
│   ├── styles/
│   │   └── globals.css
│   │
│   └── index.ts
│
├── package.json
├── tsconfig.json
└── tsup.config.ts
```

---

## Validacao

- [ ] Package compila sem erros
- [ ] Tokens exportados corretamente
- [ ] Componentes funcionam no frontend
- [ ] CSS variables aplicadas corretamente
- [ ] Tema light/dark funciona
- [ ] Documentacao completa

---

## Dependencias
- 01-monorepo-structure
- 06-shared-packages

## Bloqueia
- Nenhuma
