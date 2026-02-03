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
