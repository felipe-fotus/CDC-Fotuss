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
  integrador: string;
  origemContrato: string;
  dataVencimento: string;
  diasAtraso: number;
  valorAtraso: number;
  status: string;
}

// === INDICADORES / METRICAS ===

export interface InadimplenciaMetrics {
  totalContratos: number;
  valorTotalAtraso: number;
  mediaAtraso: number;
  situacoesCriticas: number; // D+180 ou mais
}

// === FILTROS E ORDENACAO ===

export type ContractSortField = 'diasAtraso' | 'valorAtraso' | 'dataVencimento';
export type SortDirection = 'asc' | 'desc';

export interface ContractFilters {
  faixasAtraso: number[];
  clientePagante: string;
  integrador: string;
  status: string;
  origemContrato: string;
}

export interface ContractSorting {
  field: ContractSortField;
  direction: SortDirection;
}

// === CRITICIDADE ===

export type CriticalityLevel = 'low' | 'medium' | 'high' | 'critical';
