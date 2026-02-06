# Escopos - Detalhes do Contrato Inadimplente

## Visão Geral

Este documento descreve os dois principais escopos da tela de detalhes do contrato inadimplente no CDC Fotus: o **Bloco de Resumo e Identificação** e a **Linha do Tempo**. Juntos, eles formam a base para análise e acompanhamento de contratos em situação de inadimplência.

---

## Escopo 1: Bloco de Resumo e Identificação

### Descrição

O Bloco de Resumo e Identificação é o primeiro elemento visual que o usuário encontra ao acessar os detalhes de um contrato inadimplente. Seu propósito é fornecer uma **visão imediata e completa** do contexto do contrato, permitindo que o analista compreenda em segundos:

- **Quem** é o cliente e o integrador envolvidos
- **Qual** contrato está sendo analisado
- **Quão crítica** é a situação atual

Este bloco elimina a necessidade de navegação adicional ou leitura excessiva antes de qualquer entendimento real, acelerando significativamente o processo de análise.

### Funcionalidades Implementadas

#### 1. Identificação do Contrato
- Exibição clara e destacada do **ID do contrato** no topo da tela
- Formato padronizado para fácil reconhecimento (ex: `CTR-2024-001234`)
- Botão de **copiar** para facilitar uso em comunicações e sistemas externos

#### 2. Dados do Cliente Pagante
- **Nome completo** do cliente responsável pelo pagamento
- **Informações de contato** (telefone, email) para ações de cobrança
- Apresentação hierarquizada com destaque para o nome

#### 3. Dados do Integrador
- **Nome/Razão social** do integrador vinculado ao contrato
- **Informações de contato** do integrador
- Relevante para casos onde o contato inicial passa pelo parceiro

#### 4. Indicadores de Status e Criticidade
- **Status atual** do contrato com badge visual colorido
- **Indicador D+** (dias em atraso) com código de cores por criticidade:
  - D+30: Verde (baixa criticidade)
  - D+60: Amarelo (média criticidade)
  - D+90: Laranja (alta criticidade)
  - D+120+: Vermelho (crítico)
- Percepção visual imediata do nível de urgência

#### 5. Informações Temporais
- **Data de início** do contrato
- **Data da parcela mais antiga** em atraso
- Cálculo automático dos **dias em atraso** seguindo regra padronizada

#### 6. Situação das Parcelas
- **Número total** de parcelas em atraso
- **Identificação individual** das parcelas (ex: Parcela 05, 06, 07)
- Visualização clara de quais parcelas compõem a inadimplência

#### 7. Limites de Cobrança
- Exibição dos **limites de desconto** conforme tabela de crédito
- **Valor mínimo** permitido para negociação
- **Valor máximo** (valor integral da dívida)
- Base para negociação de acordos dentro das políticas da empresa

#### 8. Seleção de Parcelas para Boleto
- Checkboxes para **selecionar parcelas** específicas
- Permite escolher quais parcelas terão boletos gerados
- Seleção múltipla ou individual conforme necessidade

#### 9. Registro de Contato
- Opção para **marcar que o contato foi realizado**
- Registro de que a equipe de cobrança já interagiu com o cliente
- Atualização do status de tratamento do contrato

#### 10. Funcionalidade de Cópia
- Botões de **copiar** para dados importantes
- Feedback visual ao copiar (ícone muda para checkmark)
- Facilita transferência de informações para outros sistemas

### Características Técnicas

- **Somente leitura**: Todas as informações são apenas para consulta
- **Dados consolidados**: Reflete o estado mais recente disponível
- **Sem ações operacionais**: O bloco não executa ações de cobrança
- **Leitura imediata**: Não exige interação para cumprir seu objetivo

---

## Escopo 2: Linha do Tempo

### Descrição

A Linha do Tempo é a **fonte única de verdade** do histórico do contrato inadimplente. Ela apresenta uma visualização cronológica de todos os eventos relevantes, permitindo que o usuário compreenda como o contrato chegou à situação atual e quais ações já foram tomadas.

Como o CDC nasce como um novo sistema, a linha do tempo foi projetada para ser **clara, previsível e confiável** desde o início, estabelecendo um padrão de rastreabilidade para todos os contratos.

### Funcionalidades Implementadas

#### 1. Eventos do Contrato

##### a) Início da Inadimplência
- Marco que registra quando a **primeira parcela entrou em atraso**
- Ponto de partida da situação de inadimplência
- Data exata e identificação da parcela

##### b) Mudanças de Faixa de Atraso
- Registro automático quando o contrato **muda de faixa**:
  - Entrada em D+60
  - Entrada em D+70
  - Entrada em D+80
  - Entrada em D+90+
- Cada mudança é um evento na linha do tempo
- Permite acompanhar a evolução da criticidade

##### c) Mudança de Status ou Responsabilidade
- Registro de alterações no **status do contrato**
- Transferências de responsabilidade entre equipes
- Marcos administrativos relevantes

#### 2. Eventos Financeiros

##### a) Marco de Responsabilidade Fotus (D+90)
- Registro do momento em que o contrato **passa para responsabilidade da Fotus**
- Aplicável conforme regras de negócio
- Marco importante para acompanhamento interno

##### b) Pagamento da Dívida
- Registro de **quitação total** da dívida
- Data e valor do pagamento
- Encerramento da situação de inadimplência

##### c) Pagamento Parcial
- Registro de **pagamentos parciais**
- Valor recebido e saldo remanescente
- Histórico de tentativas de regularização

#### 3. Ações de Cobrança Registradas

- Consolidação de **registros manuais** de ações de cobrança
- Contatos telefônicos realizados
- Emails enviados
- Negociações e acordos propostos
- Cada ação contém: data, tipo e responsável

#### 4. Estrutura de Cada Evento

Cada evento na linha do tempo contém, no mínimo:

| Campo | Descrição |
|-------|-----------|
| **Data** | Data e hora do evento |
| **Tipo** | Categoria do evento (contrato, financeiro, cobrança) |
| **Descrição** | Detalhamento do que ocorreu |
| **Responsável** | Quem gerou ou registrou o evento |

#### 5. Ordenação e Visualização

- Ordenação **cronológica** do mais antigo para o mais recente
- Visualização em formato de timeline vertical
- Ícones diferenciados por tipo de evento
- Cores que indicam a natureza do evento

### Características Técnicas

- **Somente leitura**: Eventos são apenas para consulta
- **Imutabilidade**: Eventos registrados não podem ser editados ou excluídos
- **Consolidação única**: Todos os eventos em uma única visualização
- **Escalabilidade**: Legível mesmo com grande volume de eventos

---

## Benefícios da Implementação

### Para o Analista de Cobrança

1. **Agilidade**: Compreensão do contexto em segundos
2. **Precisão**: Todas as informações necessárias em um único lugar
3. **Rastreabilidade**: Histórico completo e confiável
4. **Eficiência**: Menos navegação, mais ação

### Para a Gestão

1. **Padronização**: Processos uniformes de análise
2. **Auditoria**: Histórico imutável de eventos
3. **Métricas**: Base para indicadores de desempenho
4. **Transparência**: Visibilidade total do ciclo de inadimplência

### Para o Negócio

1. **Redução de erros**: Informações claras evitam equívocos
2. **Velocidade de resposta**: Análise mais rápida = ação mais rápida
3. **Conformidade**: Registro adequado de todas as ações
4. **Escalabilidade**: Processo preparado para crescimento

---

## Fora do Escopo

Os seguintes itens **não fazem parte** destes escopos e são tratados em features específicas:

- Detalhamento financeiro completo da dívida
- Registro e edição de ações de cobrança (feature separada)
- Automação de eventos
- Filtros avançados na linha do tempo
- Navegação para outras telas a partir destes blocos
- Tela de geração de boleto (feature separada)

---

## Critérios de Aceite Validados

### Bloco de Resumo e Identificação

- [x] Usuário entende rapidamente qual contrato está analisando
- [x] Nível de atraso e criticidade imediatamente perceptível
- [x] Informações principais se destacam sem poluição visual
- [x] Bloco não exige interação para cumprir seu objetivo

### Linha do Tempo

- [x] Usuário consegue entender a evolução do contrato ao longo do tempo
- [x] Eventos relevantes são facilmente identificáveis
- [x] Ordem cronológica é clara e inequívoca
- [x] Linha do tempo permanece legível mesmo com muitos eventos
