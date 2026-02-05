# CDC Fotuss - Sistema de Gestão de Inadimplência

## Resumo Executivo

O **CDC Fotuss** é um sistema completo de gestão de inadimplência para contratos de energia solar. O projeto foi desenvolvido em 3 escopos progressivos, evoluindo desde a infraestrutura base até funcionalidades operacionais completas como geração de boletos e acompanhamento de tratativas.

---

## ESCOPO 1: Fundação e Infraestrutura Core

### Objetivo
Estabelecer a base técnica sólida do projeto, criando toda a estrutura necessária para desenvolvimento escalável e profissional. Este escopo visa garantir que o time tenha um ambiente de desenvolvimento padronizado e que a arquitetura suporte crescimento futuro.

### O que foi implementado:

**Estrutura Monorepo com pnpm Workspaces**
- Organização do código em pacotes isolados: `frontend/`, `backend/`, `packages/`
- Configuração do `pnpm-workspace.yaml` permitindo compartilhamento de código entre projetos
- Gerenciamento centralizado de dependências evitando duplicação

**Infraestrutura Docker Completa**
- `docker-compose.dev.yml` - Ambiente de desenvolvimento com hot-reload
- `docker-compose.yml` - Ambiente de produção otimizado
- PostgreSQL 16 containerizado com volumes persistentes
- Redis 7 para cache e sessões
- Health checks automáticos em todos os serviços

**Backend API com Fastify**
- Estrutura modular seguindo padrões de camadas (routes → services → repositories)
- Integração com Prisma ORM para acesso ao banco de dados
- Validação de schemas com Zod
- Sistema de logging estruturado
- Endpoint de health check básico e detalhado

**Frontend Base com React 19 e Vite**
- Configuração TypeScript 5.9 com strict mode
- React Router 7 para navegação SPA
- Estrutura de módulos preparada para features

**Schema do Banco de Dados (Prisma)**
- Modelo `Cliente`: dados cadastrais, CPF/CNPJ, contato, endereço
- Modelo `Contrato`: referência ao cliente, integrador, valores, status
- Modelo `Parcela`: vencimentos, valores originais/atualizados, status de pagamento
- Modelo `Anotacao`: registro de observações por contrato
- Relacionamentos 1:N entre Cliente→Contratos→Parcelas/Anotações

---

## ESCOPO 2: Design System e Monitoramento de Componentes

### Objetivo
Criar uma biblioteca de componentes reutilizáveis que garanta consistência visual em toda a aplicação, além de ferramentas para monitorar e manter a qualidade do sistema de design ao longo do tempo.

### O que foi implementado:

**Design System (`@cdc-fotus/design-system`)**

Os 11 componentes React desenvolvidos formam a base visual de toda a aplicação:

- **Button**: Botões com variantes primary/secondary/ghost, suporte a loading state e ícones
- **Input**: Campos de texto com validação, estados de erro e suporte a máscaras
- **Select**: Dropdown com busca, multi-seleção e opções agrupadas
- **Badge**: Indicadores de status com variantes por criticidade (low/medium/high/critical)
- **Table**: Tabela de dados com sorting, seleção de linhas e paginação
- **Modal**: Diálogos modais com overlay, fechamento por ESC e click-fora
- **Card**: Containers de conteúdo com header, body e footer opcionais
- **Tooltip**: Dicas contextuais com posicionamento automático
- **Skeleton**: Placeholders animados para estados de carregamento
- **EmptyState**: Mensagens padronizadas para listas vazias
- **Layout**: Wrapper estrutural com sidebar e header

**Design Tokens Exportáveis**

Sistema de variáveis CSS para padronização:
- **Cores**: Paleta primária, superfícies, bordas, textos, e níveis de criticidade
- **Espaçamento**: Escala consistente (xs: 4px → lg: 24px)
- **Tipografia**: Tamanhos de texto responsivos (text-xs → text-xl)
- **Bordas**: Radius padronizados (sm: 4px → full: 9999px)
- **Sombras**: Elevações para cards e modais

**DS Monitor CLI (`@cdc-fotus/ds-monitor`)**

Ferramenta de linha de comando para análise do design system:
- `pnpm ds:monitor` - Gera relatório no console mostrando uso dos componentes
- `pnpm ds:monitor save` - Salva relatório em `docs/design-system-report.md`
- `pnpm ds:monitor check` - Modo CI que falha se houver componentes duplicados
- Detecta imports do design system vs componentes locais
- Calcula porcentagem de cobertura do design system

**Pacotes Compartilhados**

- **@cdc-fotus/types**: Interfaces TypeScript compartilhadas (Cliente, Contrato, Parcela, etc.)
- **@cdc-fotus/utils**: Funções utilitárias (formatadores de moeda, data, criticidade)

---

## ESCOPO 3: Funcionalidades de Gestão de Inadimplência

### Objetivo
Implementar as features de negócio que permitem aos operadores gerenciar contratos inadimplentes: visualizar, filtrar, ordenar, registrar tratativas e gerar boletos para cobrança.

### O que foi implementado:

**Módulo de Inadimplência - Listagem Principal**

A tela principal (`InadimplenciaListPage`) centraliza a operação diária:

- **Painel de Filtros Lateral**
  - Busca por cliente (nome ou CPF/CNPJ)
  - Busca por integrador (nome ou CNPJ)
  - Chips de faixa de atraso clicáveis: 30, 60, 90, 120, 180, 360, 720, 1080 dias
  - Botão para limpar todos os filtros
  - Painel colapsável para otimizar espaço

- **Tabela de Contratos**
  - Colunas: Cliente, Contrato, Dias Atraso, Saldo Devedor, Vencimento, Status
  - Indicador visual de criticidade por cor
  - Ações inline: ver detalhes, adicionar anotação
  - Paginação com controle de itens por página

- **Painel de Métricas**
  - Total de contratos inadimplentes
  - Soma total do saldo devedor
  - Atualização em tempo real conforme filtros

- **Filtros Rápidos de Status**
  - "Todos" - Exibe todos os contratos
  - "Tratados" - Apenas contratos já trabalhados
  - "Pendentes" - Contratos aguardando tratativa

- **Controle de Ordenação**
  - Por dias em atraso (crescente/decrescente)
  - Por saldo devedor (maior/menor)
  - Por data de vencimento (mais antigo/recente)

**Módulo de Contratos - Visualização Detalhada**

A tela de detalhes (`ContractDetailPage`) permite análise profunda:

- **Sidebar de Resumo (Colapsável)**
  - Resumo do atraso: dias, saldo total, parcela mais antiga
  - Dados do contrato: data, valor original, parcelas, origem
  - Card do cliente: nome, CPF/CNPJ, telefone, email (com botão copiar)
  - Card do integrador: razão social, CNPJ, contato (com botão copiar)

- **Tabela de Parcelas**
  - Checkbox para seleção múltipla (geração de boleto)
  - Colunas: Parcela, Vencimento, Valor Original, Valor Atualizado, Status
  - Limite de desconto por faixa de atraso:
    - 30-89 dias: até 5%
    - 90-179 dias: até 10%
    - 180-359 dias: até 20%
    - 360+ dias: até 30%
  - Ordenação inteligente: atrasadas → a vencer → pagas

- **Ações Disponíveis**
  - Botão "Gerar Boleto" ativo quando parcelas selecionadas
  - Badge de status (Tratado/Pendente) clicável
  - Acesso ao modal de anotações

**Sistema de Anotações**

Modal dedicado para registro de tratativas:
- Listagem de todas as anotações do contrato
- Exibição de autor e data/hora de cada registro
- Campo para adicionar nova observação
- Toggle para marcar contrato como tratado/pendente
- Histórico preservado para auditoria

**Modal de Confirmação de Boleto**

Interface para geração de boletos:
- Lista as parcelas selecionadas com valores
- Campo para definir nova data de vencimento
- Resumo do valor total a gerar
- Botão de confirmação (preparado para integração com API)

**Lógica de Criticidade**

Sistema visual para priorização:
- **Baixa** (verde): 1-29 dias de atraso
- **Média** (amarelo): 30-89 dias de atraso
- **Alta** (laranja): 90-179 dias de atraso
- **Crítica** (vermelho): 180+ dias de atraso

**Serviço de Dados Mock**

Para desenvolvimento sem backend completo:
- Geração de 100-120 contratos realistas
- Distribuição ponderada de atrasos (35% entre 30-60 dias)
- Dados de clientes com CPF/CNPJ válidos
- Cache de anotações e status de tratativa em localStorage

---

## Conexão Entre os Escopos

O projeto segue uma evolução lógica onde cada escopo depende do anterior:

1. **Escopo 1** criou a fundação técnica - sem a estrutura monorepo, Docker e schema de banco, seria impossível desenvolver features complexas

2. **Escopo 2** estabeleceu a linguagem visual - os 11 componentes do design system são usados em todas as telas do Escopo 3, garantindo consistência e acelerando o desenvolvimento

3. **Escopo 3** entrega valor ao negócio - utilizando toda a infraestrutura (Escopo 1) e componentes visuais (Escopo 2), implementa as funcionalidades que os operadores realmente usarão no dia a dia

---

## Estado Atual e Próximos Passos

**Completo:**
- Listagem de contratos com filtros avançados
- Detalhamento de contratos com parcelas
- Sistema de anotações e tratativas
- Interface de geração de boletos
- Design system com monitoramento
- Infraestrutura Docker dev/prod

**Pendente para produção:**
- Integração da API de geração de boletos real
- Seed do banco com dados reais
- Sistema de autenticação/autorização
- Testes automatizados E2E
