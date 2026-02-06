// === ENTIDADES PRINCIPAIS ===

export interface Cliente {
  id: string;
  nome: string;
  cpfCnpj: string;
  email: string;
  telefone: string;
  endereco: Endereco;
}

export interface Endereco {
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
}

export interface Parcela {
  numero: number;
  dataVencimento: string;
  dataPagamento?: string;
  valorOriginal: number;
  valorAtualizado: number;
  valorPago?: number;
  status: ParcelaStatus;
  diasAtraso: number;
  // Limites de cobranca (desconto permitido)
  limiteDescontoMin: number; // Valor minimo que pode cobrar
  limiteDescontoMax: number; // Valor maximo de desconto em %
}

export type ParcelaStatus = 'paga' | 'em_atraso' | 'a_vencer';

export interface ContractDetail {
  id: string;
  // Dados do contrato
  dataContratacao: string;
  valorTotal: number;
  valorEntrada: number;
  quantidadeParcelas: number;
  taxaJuros: number;
  origemContrato: string;
  status: string;
  // Dados do cliente
  cliente: Cliente;
  // Integrador
  integrador: string;
  integradorCnpj: string;
  integradorTelefone: string;
  integradorEmail: string;
  // Parcelas
  parcelas: Parcela[];
  // Resumo de atraso
  parcelasEmAtraso: number;
  valorTotalAtraso: number;
  diasAtrasoMaisAntigo: number;
  dataVencimentoMaisAntigo: string;
}

// === TIPO SIMPLIFICADO PARA LISTAGEM ===

export interface Contract {
  id: string;
  clientePagante: string;
  clienteCpfCnpj: string;
  integrador: string;
  integradorCpfCnpj: string;
  dataVencimento: string; // Data da parcela mais antiga inadimplente
  diasAtraso: number;
  saldoDevedor: number;
  tratado: boolean;
  quantidadeAnotacoes: number;
}

// === ANOTAÇÕES ===

export interface Anotacao {
  id: string;
  contratoId: string;
  texto: string;
  autor: string;
  createdAt: string;
}

// === INDICADORES / METRICAS ===

export interface InadimplenciaMetrics {
  totalContratos: number;
  saldoDevedorTotal: number;
}

// === FILTROS E ORDENACAO ===

export type ContractSortField = 'diasAtraso' | 'saldoDevedor' | 'dataVencimento';
export type SortDirection = 'asc' | 'desc';

export interface ContractFilters {
  faixasAtraso: number[];
  clienteBusca: string; // Busca por nome ou CPF/CNPJ
  integradorBusca: string; // Busca por nome ou CPF/CNPJ
  statusTratamento: 'todos' | 'tratados' | 'pendentes';
}

export interface ContractSorting {
  field: ContractSortField;
  direction: SortDirection;
}

// === CRITICIDADE ===

export type CriticalityLevel = 'low' | 'medium' | 'high' | 'critical';

// === LINHA DO TEMPO ===

export type TimelineEventType =
  | 'inicio_inadimplencia'
  | 'mudanca_faixa_atraso'
  | 'mudanca_responsabilidade'
  | 'parcela_paga'
  | 'pagamento_parcial'
  | 'acao_cobranca'
  | 'boleto_gerado';

export interface TimelineEvent {
  id: string;
  type: TimelineEventType;
  date: string;
  title: string;
  description?: string;
  author: string;
  metadata?: {
    parcelaNumero?: number;
    valor?: number;
    valorPago?: number;
    diasAtraso?: number;
    faixaAnterior?: number;
    faixaAtual?: number;
    responsavelAnterior?: string;
    responsavelAtual?: string;
    tipoContato?: string;
    resultadoContato?: string;
  };
}
