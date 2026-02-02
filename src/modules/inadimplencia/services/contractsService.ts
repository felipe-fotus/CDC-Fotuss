import type { Contract, ContractDetail, Cliente, Parcela, ParcelaStatus, InadimplenciaMetrics } from '../types/contract';
import { generateDueDateFromDaysOverdue } from '../../../lib/dates';

// === DADOS DE MOCK ===

const nomes = [
  'Maria Silva Santos', 'João Pedro Oliveira', 'Ana Carolina Ferreira',
  'Carlos Eduardo Lima', 'Fernanda Rodrigues Costa', 'Lucas Martins Almeida',
  'Patricia Souza Pereira', 'Roberto Carlos Mendes', 'Juliana Alves Barbosa',
  'Marcos Antônio Ribeiro', 'Camila Cristina Gomes', 'André Luiz Carvalho',
  'Beatriz Santos Silva', 'Ricardo Moreira Nunes', 'Larissa Fernandes Cruz',
  'Paulo Henrique Dias', 'Vanessa Lima Teixeira', 'Thiago Costa Araújo',
  'Amanda Rocha Pinto', 'Felipe Nascimento Ramos', 'Renata Cardoso Vieira',
  'Gustavo Lopes Freitas', 'Isabela Machado Correia', 'Rodrigo Azevedo Castro',
  'Mariana Duarte Monteiro', 'Diego Fonseca Borges', 'Aline Pereira Cunha',
  'Bruno Cavalcanti Melo', 'Cláudia Barros Reis', 'Eduardo Pires Andrade',
];

const integradores = [
  { nome: 'Solar Tech Brasil', cnpj: '12.345.678/0001-90' },
  { nome: 'EcoSolar Integrações', cnpj: '23.456.789/0001-01' },
  { nome: 'SunPower Solutions', cnpj: '34.567.890/0001-12' },
  { nome: 'Verde Energia', cnpj: '45.678.901/0001-23' },
  { nome: 'Fotovolt Premium', cnpj: '56.789.012/0001-34' },
  { nome: 'Energia Limpa BR', cnpj: '67.890.123/0001-45' },
  { nome: 'SolBrasil Sistemas', cnpj: '78.901.234/0001-56' },
  { nome: 'PowerSun Integradora', cnpj: '89.012.345/0001-67' },
  { nome: 'Luz Solar Engenharia', cnpj: '90.123.456/0001-78' },
  { nome: 'Nova Energia Solar', cnpj: '01.234.567/0001-89' },
  { nome: 'Prime Solar', cnpj: '11.222.333/0001-44' },
  { nome: 'Sustenta Energia', cnpj: '22.333.444/0001-55' },
];

const origens = ['Loja Física', 'E-commerce', 'Parceiro Comercial', 'Indicação', 'Televendas'];

const cidades = [
  { cidade: 'São Paulo', uf: 'SP' }, { cidade: 'Rio de Janeiro', uf: 'RJ' },
  { cidade: 'Belo Horizonte', uf: 'MG' }, { cidade: 'Curitiba', uf: 'PR' },
  { cidade: 'Porto Alegre', uf: 'RS' }, { cidade: 'Salvador', uf: 'BA' },
  { cidade: 'Brasília', uf: 'DF' }, { cidade: 'Fortaleza', uf: 'CE' },
  { cidade: 'Recife', uf: 'PE' }, { cidade: 'Campinas', uf: 'SP' },
];

const logradouros = [
  'Rua das Flores', 'Avenida Brasil', 'Rua XV de Novembro', 'Avenida Paulista',
  'Rua São João', 'Alameda Santos', 'Rua das Palmeiras', 'Avenida Central',
  'Rua do Comércio', 'Praça da Liberdade',
];

const bairros = [
  'Centro', 'Jardim América', 'Vila Nova', 'Boa Vista', 'Santa Cruz',
  'Consolação', 'Higienópolis', 'Moema', 'Pinheiros', 'Santana',
];

const faixasDistribuicao = [
  { min: 30, max: 60, weight: 35 },
  { min: 61, max: 90, weight: 25 },
  { min: 91, max: 180, weight: 20 },
  { min: 181, max: 360, weight: 10 },
  { min: 361, max: 720, weight: 7 },
  { min: 721, max: 1080, weight: 3 },
];

// === HELPERS ===

function getRandomFromArray<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getWeightedRandomDays(): number {
  const totalWeight = faixasDistribuicao.reduce((acc, f) => acc + f.weight, 0);
  let random = Math.random() * totalWeight;

  for (const faixa of faixasDistribuicao) {
    if (random < faixa.weight) {
      return getRandomInRange(faixa.min, faixa.max);
    }
    random -= faixa.weight;
  }
  return getRandomInRange(30, 90);
}

function generateCPF(): string {
  const n = () => Math.floor(Math.random() * 10);
  return `${n()}${n()}${n()}.${n()}${n()}${n()}.${n()}${n()}${n()}-${n()}${n()}`;
}

function generatePhone(): string {
  const ddd = getRandomInRange(11, 99);
  const n = () => Math.floor(Math.random() * 10);
  return `(${ddd}) 9${n()}${n()}${n()}${n()}-${n()}${n()}${n()}${n()}`;
}

function generateEmail(nome: string): string {
  const [primeiro, ...resto] = nome.toLowerCase().split(' ');
  const ultimo = resto[resto.length - 1] || primeiro;
  const domains = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com.br'];
  return `${primeiro}.${ultimo}@${getRandomFromArray(domains)}`.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function generateCEP(): string {
  return `${getRandomInRange(10000, 99999)}-${getRandomInRange(100, 999)}`;
}

function generateContractId(index: number): string {
  const year = getRandomFromArray(['2022', '2023', '2024']);
  const sequence = String(index + 1000).padStart(6, '0');
  return `CDC-${year}-${sequence}`;
}

function generateClienteId(index: number): string {
  return `CLI-${String(index + 5000).padStart(6, '0')}`;
}

// === GERADOR DE CLIENTE ===

function generateCliente(index: number): Cliente {
  const nome = getRandomFromArray(nomes);
  const cidadeData = getRandomFromArray(cidades);

  return {
    id: generateClienteId(index),
    nome,
    cpfCnpj: generateCPF(),
    email: generateEmail(nome),
    telefone: generatePhone(),
    endereco: {
      logradouro: getRandomFromArray(logradouros),
      numero: String(getRandomInRange(1, 2000)),
      complemento: Math.random() > 0.6 ? `Apto ${getRandomInRange(1, 500)}` : undefined,
      bairro: getRandomFromArray(bairros),
      cidade: cidadeData.cidade,
      uf: cidadeData.uf,
      cep: generateCEP(),
    },
  };
}

// === GERADOR DE PARCELAS ===

function generateParcelas(
  quantidadeParcelas: number,
  valorParcela: number,
  dataContratacao: Date,
  diasAtrasoMaisAntigo: number
): Parcela[] {
  const parcelas: Parcela[] = [];
  const hoje = new Date();

  for (let i = 0; i < quantidadeParcelas; i++) {
    const dataVencimento = new Date(dataContratacao);
    dataVencimento.setMonth(dataVencimento.getMonth() + i + 1);

    const diasDiff = Math.floor((hoje.getTime() - dataVencimento.getTime()) / (1000 * 60 * 60 * 24));

    let status: ParcelaStatus;
    let dataPagamento: string | undefined;
    let valorPago: number | undefined;
    let diasAtraso = 0;

    if (diasDiff < 0) {
      // Parcela futura
      status = 'a_vencer';
    } else if (diasDiff <= diasAtrasoMaisAntigo - 30 && Math.random() > 0.3) {
      // Parcelas antigas que foram pagas (com atraso ou não)
      status = 'paga';
      const diasAtrasoPagamento = Math.random() > 0.5 ? getRandomInRange(0, 15) : 0;
      const dataPag = new Date(dataVencimento);
      dataPag.setDate(dataPag.getDate() + diasAtrasoPagamento);
      dataPagamento = dataPag.toISOString().split('T')[0];
      valorPago = valorParcela + (diasAtrasoPagamento > 0 ? valorParcela * 0.02 * diasAtrasoPagamento : 0);
    } else {
      // Parcela em atraso
      status = 'em_atraso';
      diasAtraso = diasDiff;
    }

    const valorAtualizado = status === 'em_atraso'
      ? valorParcela * (1 + 0.01 * diasAtraso + 0.02) // 1% ao mês + 2% multa
      : valorParcela;

    parcelas.push({
      numero: i + 1,
      dataVencimento: dataVencimento.toISOString().split('T')[0],
      dataPagamento,
      valorOriginal: valorParcela,
      valorAtualizado: Math.round(valorAtualizado * 100) / 100,
      valorPago,
      status,
      diasAtraso: Math.max(0, diasAtraso),
    });
  }

  return parcelas;
}

// === GERADOR DE CONTRATO DETALHADO ===

function generateContractDetail(index: number): ContractDetail {
  const cliente = generateCliente(index);
  const integradorData = getRandomFromArray(integradores);
  const diasAtrasoMaisAntigo = getWeightedRandomDays();

  const valorTotal = getRandomInRange(15000, 150000);
  const valorEntrada = Math.round(valorTotal * getRandomInRange(10, 30) / 100);
  const quantidadeParcelas = getRandomFromArray([12, 18, 24, 36, 48, 60]);
  const taxaJuros = getRandomFromArray([0.99, 1.29, 1.49, 1.79, 1.99]);

  const dataContratacao = new Date();
  dataContratacao.setDate(dataContratacao.getDate() - diasAtrasoMaisAntigo - getRandomInRange(60, 365));

  const valorParcela = Math.round((valorTotal - valorEntrada) / quantidadeParcelas * 100) / 100;
  const parcelas = generateParcelas(quantidadeParcelas, valorParcela, dataContratacao, diasAtrasoMaisAntigo);

  const parcelasEmAtraso = parcelas.filter(p => p.status === 'em_atraso');
  const valorTotalAtraso = parcelasEmAtraso.reduce((acc, p) => acc + p.valorAtualizado, 0);

  const parcelaAtrasadaMaisAntiga = parcelasEmAtraso.sort(
    (a, b) => new Date(a.dataVencimento).getTime() - new Date(b.dataVencimento).getTime()
  )[0];

  return {
    id: generateContractId(index),
    dataContratacao: dataContratacao.toISOString().split('T')[0],
    valorTotal,
    valorEntrada,
    quantidadeParcelas,
    taxaJuros,
    origemContrato: getRandomFromArray(origens),
    status: 'Inadimplente',
    cliente,
    integrador: integradorData.nome,
    integradorCnpj: integradorData.cnpj,
    parcelas,
    parcelasEmAtraso: parcelasEmAtraso.length,
    valorTotalAtraso: Math.round(valorTotalAtraso * 100) / 100,
    diasAtrasoMaisAntigo: parcelaAtrasadaMaisAntiga?.diasAtraso || diasAtrasoMaisAntigo,
    dataVencimentoMaisAntigo: parcelaAtrasadaMaisAntiga?.dataVencimento || generateDueDateFromDaysOverdue(diasAtrasoMaisAntigo),
  };
}

// === CACHE E API PÚBLICA ===

let mockContractsDetailCache: ContractDetail[] | null = null;

function getMockContractsDetail(): ContractDetail[] {
  if (!mockContractsDetailCache) {
    const numberOfContracts = getRandomInRange(100, 120);
    mockContractsDetailCache = [];
    for (let i = 0; i < numberOfContracts; i++) {
      mockContractsDetailCache.push(generateContractDetail(i));
    }
  }
  return mockContractsDetailCache;
}

// Converte ContractDetail para Contract (listagem simplificada)
function toContract(detail: ContractDetail): Contract {
  return {
    id: detail.id,
    clientePagante: detail.cliente.nome,
    integrador: detail.integrador,
    origemContrato: detail.origemContrato,
    dataVencimento: detail.dataVencimentoMaisAntigo,
    diasAtraso: detail.diasAtrasoMaisAntigo,
    valorAtraso: detail.valorTotalAtraso,
    status: detail.status,
  };
}

// === FUNÇÕES EXPORTADAS ===

export async function fetchContracts(): Promise<Contract[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return getMockContractsDetail().map(toContract);
}

export async function fetchContractById(id: string): Promise<ContractDetail | null> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return getMockContractsDetail().find(c => c.id === id) || null;
}

export function calculateMetrics(contracts: Contract[]): InadimplenciaMetrics {
  const totalContratos = contracts.length;
  const valorTotalAtraso = contracts.reduce((acc, c) => acc + c.valorAtraso, 0);
  const mediaAtraso = totalContratos > 0
    ? Math.round(contracts.reduce((acc, c) => acc + c.diasAtraso, 0) / totalContratos)
    : 0;
  const situacoesCriticas = contracts.filter(c => c.diasAtraso >= 180).length;

  return {
    totalContratos,
    valorTotalAtraso,
    mediaAtraso,
    situacoesCriticas,
  };
}

export function getUniqueClientes(contracts: Contract[]): string[] {
  return [...new Set(contracts.map((c) => c.clientePagante))].sort();
}

export function getUniqueIntegradores(contracts: Contract[]): string[] {
  return [...new Set(contracts.map((c) => c.integrador))].sort();
}

export function getUniqueOrigens(contracts: Contract[]): string[] {
  return [...new Set(contracts.map((c) => c.origemContrato))].sort();
}

export function getUniqueStatus(contracts: Contract[]): string[] {
  return [...new Set(contracts.map((c) => c.status))].sort();
}

export const FAIXAS_ATRASO = [30, 60, 90, 120, 150, 180, 360, 540, 720, 900, 1080];
