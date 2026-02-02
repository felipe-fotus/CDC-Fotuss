# CDC Fotus - Monitoramento de Inadimplencia

## Documentacao Tecnica e Funcional v2.0

---

## 1. Visao Geral

**Aplicacao**: CDC Fotus - Monitoramento de Inadimplencia

**Objetivo**: Aplicacao de consulta para monitoramento de contratos inadimplentes, com foco em leitura, priorizacao e navegacao.

**Escopo**: Exclusivamente consulta. Nao ha acoes de cobranca, edicao, exportacao, alertas ou automacoes.

**Stack**: React 19 + TypeScript + Vite + React Router DOM

**Atualizacao de Dados**: Assumidos como D-1 (atualizacao diaria).

---

## 2. Funcionalidades Principais

### 2.1 Navbar Compacta
- Logo "CDC Fotus" com link para home
- Botao de atualizar pagina (refresh)
- Toggle de tema Light/Dark mode
- Altura fixa de 48px

### 2.2 Sistema de Temas
- **Light Mode**: Fundo claro, textos escuros
- **Dark Mode**: Fundo escuro (#0f172a), textos claros
- Persistencia via localStorage
- Detecta preferencia do sistema automaticamente

### 2.3 Painel de Filtros Colapsavel
- Busca unificada (cliente ou integrador)
- Chips selecionaveis para:
  - Faixa de atraso (D+30 a D+1080)
  - Origem do contrato
  - Status
- Botao de toggle estilo ChatGPT/Claude (seta lateral)
- Botao "Limpar" quando ha filtros ativos

### 2.4 Indicadores Inline
- Total de contratos
- Valor total em atraso
- Media de atraso (D+)
- Situacoes criticas (D+180)

### 2.5 Tabela de Contratos
- Colunas: ID, Cliente, Integrador, Origem, Vencimento, D+, Valor, Status
- Linhas clicaveis (navega para detalhe)
- Indicador visual de criticidade por cor
- Ordenacao configuravel

### 2.6 Tela de Detalhe (Layout Split)
- **Sidebar esquerda** (colapsavel):
  - Resumo do atraso (destacado)
  - Dados do contrato
  - Dados do cliente
  - Integrador
- **Area principal**:
  - Tabela de parcelas
  - Destaque visual para parcelas em atraso

---

## 3. Estrutura do Projeto

```
src/
  app/
    routes.tsx              # Rotas da aplicacao
    AppShell.tsx            # Layout com Navbar

  contexts/
    ThemeContext.tsx        # Contexto de tema (light/dark)

  modules/
    inadimplencia/
      pages/
        InadimplenciaListPage.tsx    # Tela principal
      components/
        FiltersPanel.tsx             # Filtros colapsaveis
        SortControl.tsx              # Ordenacao compacta
        ContractsTable.tsx           # Tabela de contratos
        ContractRow.tsx              # Linha da tabela
        CriticalityTag.tsx           # Badge D+XX
        MetricsPanel.tsx             # Indicadores inline
      hooks/
        useContracts.ts
        useFilters.ts
        useSorting.ts
      types/
        contract.ts
      utils/
        criticality.ts
        formatters.ts
      services/
        contractsService.ts

    contratos/
      pages/
        ContractDetailPage.tsx       # Detalhe com sidebar

  components/
    layout/
      Navbar.tsx                     # Navbar compacta
    ui/
      Button.tsx
      Input.tsx
      Select.tsx
      Badge.tsx
      Table.tsx
      EmptyState.tsx

  styles/
    globals.css                      # Temas light/dark

  lib/
    dates.ts
```

---

## 4. Rotas

| Rota | Componente | Descricao |
|------|------------|-----------|
| `/` | Redirect | Redireciona para `/inadimplencia` |
| `/inadimplencia` | InadimplenciaListPage | Listagem de contratos |
| `/contratos/:id` | ContractDetailPage | Detalhe do contrato |

---

## 5. Sistema de Cores

### 5.1 Light Mode
```css
--color-bg: #f8fafc
--color-surface: #ffffff
--color-text-primary: #0f172a
--color-text-secondary: #475569
--color-primary: #3b82f6
```

### 5.2 Dark Mode
```css
--color-bg: #0f172a
--color-surface: #1e293b
--color-text-primary: #f1f5f9
--color-text-secondary: #94a3b8
--color-primary: #60a5fa
```

### 5.3 Criticidade
| Nivel | Light BG | Dark BG | Faixa |
|-------|----------|---------|-------|
| Low | #f0fdf4 | rgba(34, 197, 94, 0.15) | Ate D+60 |
| Medium | #fefce8 | rgba(234, 179, 8, 0.15) | D+61-70 |
| High | #fff7ed | rgba(249, 115, 22, 0.15) | D+71-89 |
| Critical | #fef2f2 | rgba(239, 68, 68, 0.15) | D+90+ |

---

## 6. Componentes de Interface

### 6.1 Navbar
- Altura: 48px
- Logo com icone + texto "CDC Fotus"
- Acoes: Refresh, Theme Toggle

### 6.2 Filtros (Sidebar)
- Largura aberta: 260px
- Largura fechada: 0px (com botao de toggle visivel)
- Chips para selecao multipla
- Input para busca textual

### 6.3 Indicadores
- Layout horizontal com flex-wrap
- Valores em fonte monospace
- Criticos destacados em vermelho

### 6.4 Tabela
- Header fixo
- Scroll horizontal em telas pequenas
- Hover effect nas linhas
- Click navega para detalhe

### 6.5 Detalhe do Contrato
- Sidebar: 280px (colapsavel)
- Secoes compactas com informacoes-chave
- Tabela de parcelas ocupa area principal

---

## 7. Interacoes

| Acao | Local | Comportamento |
|------|-------|---------------|
| Click logo | Navbar | Navega para /inadimplencia |
| Click refresh | Navbar | Recarrega a pagina |
| Click tema | Navbar | Alterna light/dark |
| Click seta filtros | Sidebar | Abre/fecha painel |
| Click chip | Filtros | Toggle selecao |
| Digitar busca | Filtros | Filtra com debounce 300ms |
| Click "Limpar" | Filtros | Remove todos os filtros |
| Click linha tabela | Tabela | Navega para /contratos/:id |
| Click seta resumo | Detalhe | Abre/fecha sidebar |
| Click "Voltar" | Detalhe | Navega para listagem |

---

## 8. Modelo de Dados

### Contract (Listagem)
```typescript
interface Contract {
  id: string;
  clientePagante: string;
  integrador: string;
  origemContrato: string;
  dataVencimento: string;
  diasAtraso: number;
  valorAtraso: number;
  status: string;
}
```

### ContractDetail (Detalhe)
```typescript
interface ContractDetail {
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
```

### Cliente
```typescript
interface Cliente {
  id: string;
  nome: string;
  cpfCnpj: string;
  email: string;
  telefone: string;
  endereco: Endereco;
}
```

### Parcela
```typescript
interface Parcela {
  numero: number;
  dataVencimento: string;
  dataPagamento?: string;
  valorOriginal: number;
  valorAtualizado: number;
  valorPago?: number;
  status: 'paga' | 'em_atraso' | 'a_vencer';
  diasAtraso: number;
}
```

---

## 9. Faixas de Filtro

| Chip | Intervalo |
|------|-----------|
| D+30 | 1-30 dias |
| D+60 | 31-60 dias |
| D+90 | 61-90 dias |
| D+120 | 91-120 dias |
| D+150 | 121-150 dias |
| D+180 | 151-180 dias |
| D+360 | 181-360 dias |
| D+540 | 361-540 dias |
| D+720 | 541-720 dias |
| D+900 | 721-900 dias |
| D+1080 | 901-1080 dias |

---

## 10. Como Executar

```bash
# Instalar dependencias
npm install

# Desenvolvimento
npm run dev

# Build
npm run build

# Preview
npm run preview
```

URL padrao: `http://localhost:5173` → redireciona para `/inadimplencia`

---

## 11. Arquivos Principais

| Arquivo | Funcao |
|---------|--------|
| `src/main.tsx` | Entry point com ThemeProvider |
| `src/app/routes.tsx` | Configuracao de rotas |
| `src/contexts/ThemeContext.tsx` | Gerenciamento de tema |
| `src/components/layout/Navbar.tsx` | Navbar compacta |
| `src/modules/inadimplencia/pages/InadimplenciaListPage.tsx` | Tela principal |
| `src/modules/contratos/pages/ContractDetailPage.tsx` | Detalhe do contrato |
| `src/styles/globals.css` | Variaveis CSS e temas |

---

## 12. Fora do Escopo

- Graficos/dashboards
- Acoes de cobranca
- Exportacao (CSV, PDF)
- Notificacoes/alertas
- Edicao de dados
- Autenticacao

---

*Documentacao atualizada em 02/02/2026 - v2.0*
