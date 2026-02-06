import type { Contract, ContractDetail, Cliente, Parcela, ParcelaStatus, InadimplenciaMetrics, Anotacao, TimelineEvent, TimelineEventType } from '../types/contract';
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
  { nome: 'Solar Tech Brasil', cnpj: '12.345.678/0001-90', telefone: '(11) 3456-7890', email: 'contato@solartech.com.br' },
  { nome: 'EcoSolar Integrações', cnpj: '23.456.789/0001-01', telefone: '(21) 2345-6789', email: 'comercial@ecosolar.com.br' },
  { nome: 'SunPower Solutions', cnpj: '34.567.890/0001-12', telefone: '(31) 3456-7890', email: 'atendimento@sunpower.com.br' },
  { nome: 'Verde Energia', cnpj: '45.678.901/0001-23', telefone: '(41) 4567-8901', email: 'contato@verdeenergia.com.br' },
  { nome: 'Fotovolt Premium', cnpj: '56.789.012/0001-34', telefone: '(51) 5678-9012', email: 'vendas@fotovolt.com.br' },
  { nome: 'Energia Limpa BR', cnpj: '67.890.123/0001-45', telefone: '(71) 6789-0123', email: 'suporte@energialimpa.com.br' },
  { nome: 'SolBrasil Sistemas', cnpj: '78.901.234/0001-56', telefone: '(61) 7890-1234', email: 'contato@solbrasil.com.br' },
  { nome: 'PowerSun Integradora', cnpj: '89.012.345/0001-67', telefone: '(85) 8901-2345', email: 'comercial@powersun.com.br' },
  { nome: 'Luz Solar Engenharia', cnpj: '90.123.456/0001-78', telefone: '(81) 9012-3456', email: 'engenharia@luzsolar.com.br' },
  { nome: 'Nova Energia Solar', cnpj: '01.234.567/0001-89', telefone: '(19) 0123-4567', email: 'contato@novaenergia.com.br' },
  { nome: 'Prime Solar', cnpj: '11.222.333/0001-44', telefone: '(47) 1122-3344', email: 'atendimento@primesolar.com.br' },
  { nome: 'Sustenta Energia', cnpj: '22.333.444/0001-55', telefone: '(48) 2233-4455', email: 'comercial@sustenta.com.br' },
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

    // Calcular limites de desconto baseado na tabela de credito
    // Quanto maior o atraso, maior o desconto permitido
    let limiteDescontoMax = 0;
    if (diasAtraso >= 360) {
      limiteDescontoMax = 30; // 30% de desconto para atrasos > 360 dias
    } else if (diasAtraso >= 180) {
      limiteDescontoMax = 20; // 20% para 180-359 dias
    } else if (diasAtraso >= 90) {
      limiteDescontoMax = 10; // 10% para 90-179 dias
    } else if (diasAtraso >= 30) {
      limiteDescontoMax = 5; // 5% para 30-89 dias
    }

    const limiteDescontoMin = Math.round((valorAtualizado * (1 - limiteDescontoMax / 100)) * 100) / 100;

    parcelas.push({
      numero: i + 1,
      dataVencimento: dataVencimento.toISOString().split('T')[0],
      dataPagamento,
      valorOriginal: valorParcela,
      valorAtualizado: Math.round(valorAtualizado * 100) / 100,
      valorPago,
      status,
      diasAtraso: Math.max(0, diasAtraso),
      limiteDescontoMin,
      limiteDescontoMax,
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
    integradorTelefone: integradorData.telefone,
    integradorEmail: integradorData.email,
    parcelas,
    parcelasEmAtraso: parcelasEmAtraso.length,
    valorTotalAtraso: Math.round(valorTotalAtraso * 100) / 100,
    diasAtrasoMaisAntigo: parcelaAtrasadaMaisAntiga?.diasAtraso || diasAtrasoMaisAntigo,
    dataVencimentoMaisAntigo: parcelaAtrasadaMaisAntiga?.dataVencimento || generateDueDateFromDaysOverdue(diasAtrasoMaisAntigo),
  };
}

// === CACHE E API PÚBLICA ===

let mockContractsDetailCache: ContractDetail[] | null = null;
const mockAnotacoesCache: Map<string, Anotacao[]> = new Map();
const mockTratadoCache: Map<string, boolean> = new Map();

function getMockContractsDetail(): ContractDetail[] {
  if (!mockContractsDetailCache) {
    const numberOfContracts = getRandomInRange(100, 120);
    mockContractsDetailCache = [];
    for (let i = 0; i < numberOfContracts; i++) {
      const contract = generateContractDetail(i);
      mockContractsDetailCache.push(contract);

      // Inicializa alguns contratos como já tratados (20%)
      if (Math.random() < 0.2) {
        mockTratadoCache.set(contract.id, true);
        // Adiciona uma anotação inicial para os tratados
        mockAnotacoesCache.set(contract.id, [{
          id: `ANO-${contract.id}-001`,
          contratoId: contract.id,
          texto: getRandomFromArray([
            'Cliente informou que irá regularizar na próxima semana.',
            'Acordo de parcelamento em negociação.',
            'Cliente não atendeu, deixar recado.',
            'Promessa de pagamento para dia 15.',
            'Enviado boleto atualizado por e-mail.',
          ]),
          autor: getRandomFromArray(['Ana Silva', 'Carlos Santos', 'Maria Oliveira', 'João Costa']),
          createdAt: new Date(Date.now() - getRandomInRange(1, 30) * 24 * 60 * 60 * 1000).toISOString(),
        }]);
      }
    }
  }
  return mockContractsDetailCache;
}

// Converte ContractDetail para Contract (listagem simplificada)
function toContract(detail: ContractDetail): Contract {
  const anotacoes = mockAnotacoesCache.get(detail.id) || [];
  return {
    id: detail.id,
    clientePagante: detail.cliente.nome,
    clienteCpfCnpj: detail.cliente.cpfCnpj,
    integrador: detail.integrador,
    integradorCpfCnpj: detail.integradorCnpj,
    dataVencimento: detail.dataVencimentoMaisAntigo,
    diasAtraso: detail.diasAtrasoMaisAntigo,
    saldoDevedor: detail.valorTotalAtraso,
    tratado: mockTratadoCache.get(detail.id) || false,
    quantidadeAnotacoes: anotacoes.length,
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
  const saldoDevedorTotal = contracts.reduce((acc, c) => acc + c.saldoDevedor, 0);

  return {
    totalContratos,
    saldoDevedorTotal,
  };
}

export const FAIXAS_ATRASO = [30, 60, 90, 120, 150, 180, 360, 540, 720, 900, 1080];

// === FUNÇÕES DE ANOTAÇÕES E TRATAMENTO ===

export async function fetchAnotacoes(contratoId: string): Promise<Anotacao[]> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return mockAnotacoesCache.get(contratoId) || [];
}

export async function addAnotacao(contratoId: string, texto: string, autor: string): Promise<Anotacao> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const anotacoes = mockAnotacoesCache.get(contratoId) || [];
  const novaAnotacao: Anotacao = {
    id: `ANO-${contratoId}-${String(anotacoes.length + 1).padStart(3, '0')}`,
    contratoId,
    texto,
    autor,
    createdAt: new Date().toISOString(),
  };

  anotacoes.unshift(novaAnotacao); // Adiciona no início
  mockAnotacoesCache.set(contratoId, anotacoes);

  return novaAnotacao;
}

export async function marcarComoTratado(contratoId: string, tratado: boolean): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  mockTratadoCache.set(contratoId, tratado);
}

export function getStatusTratamento(contratoId: string): boolean {
  return mockTratadoCache.get(contratoId) || false;
}

// === GERADOR DE TIMELINE EVENTS ===

const analistas = ['Ana Silva', 'Carlos Santos', 'Maria Oliveira', 'João Costa', 'Fernanda Lima'];
const tiposContato = ['Ligação', 'WhatsApp', 'E-mail', 'SMS'];
const resultadosContato = [
  'Cliente atendeu, prometeu pagamento',
  'Cliente não atendeu',
  'Deixado recado na caixa postal',
  'Número inexistente',
  'Cliente solicitou prazo',
  'E-mail enviado com sucesso',
  'Mensagem visualizada sem resposta',
];

function generateTimelineEvents(contract: ContractDetail): TimelineEvent[] {
  const events: TimelineEvent[] = [];
  let eventId = 1;

  const parcelasEmAtraso = contract.parcelas
    .filter(p => p.status === 'em_atraso')
    .sort((a, b) => new Date(a.dataVencimento).getTime() - new Date(b.dataVencimento).getTime());

  const parcelasPagas = contract.parcelas
    .filter(p => p.status === 'paga' && p.dataPagamento)
    .sort((a, b) => new Date(a.dataPagamento!).getTime() - new Date(b.dataPagamento!).getTime());

  // 1. Início da inadimplência (primeira parcela em atraso)
  if (parcelasEmAtraso.length > 0) {
    const primeiraParcela = parcelasEmAtraso[0];
    events.push({
      id: `TL-${contract.id}-${eventId++}`,
      type: 'inicio_inadimplencia',
      date: primeiraParcela.dataVencimento,
      title: 'Início da inadimplência',
      description: `Parcela ${primeiraParcela.numero} venceu em ${primeiraParcela.dataVencimento} sem pagamento registrado.`,
      author: 'Sistema',
      metadata: {
        parcelaNumero: primeiraParcela.numero,
        valor: primeiraParcela.valorOriginal,
        diasAtraso: primeiraParcela.diasAtraso,
      },
    });
  }

  // 2. Mudanças de faixa de atraso (D+60, D+90, D+120...)
  if (parcelasEmAtraso.length > 0) {
    const primeiraParcela = parcelasEmAtraso[0];
    const dataVenc = new Date(primeiraParcela.dataVencimento);
    const faixas = [60, 90, 120, 150, 180, 360];

    for (const faixa of faixas) {
      if (primeiraParcela.diasAtraso >= faixa) {
        const dataFaixa = new Date(dataVenc);
        dataFaixa.setDate(dataFaixa.getDate() + faixa);
        const faixaAnterior = faixas[faixas.indexOf(faixa) - 1] || 0;

        events.push({
          id: `TL-${contract.id}-${eventId++}`,
          type: 'mudanca_faixa_atraso',
          date: dataFaixa.toISOString().split('T')[0],
          title: `Mudança para faixa D+${faixa}`,
          description: `Contrato atingiu ${faixa} dias de atraso.`,
          author: 'Sistema',
          metadata: {
            faixaAnterior,
            faixaAtual: faixa,
            diasAtraso: faixa,
          },
        });
      }
    }
  }

  // 3. Mudança de responsabilidade (se atraso >= 90 dias, 40% de chance)
  if (parcelasEmAtraso.length > 0 && parcelasEmAtraso[0].diasAtraso >= 90) {
    const dataVenc = new Date(parcelasEmAtraso[0].dataVencimento);
    const diasParaMudanca = getRandomInRange(70, 85);
    const dataMudanca = new Date(dataVenc);
    dataMudanca.setDate(dataMudanca.getDate() + diasParaMudanca);

    if (Math.random() < 0.4) {
      events.push({
        id: `TL-${contract.id}-${eventId++}`,
        type: 'mudanca_responsabilidade',
        date: dataMudanca.toISOString().split('T')[0],
        title: 'Recompra do contrato',
        description: 'Contrato recomprado pela Fotus antes dos 90 dias.',
        author: getRandomFromArray(analistas),
        metadata: {
          responsavelAnterior: contract.integrador,
          responsavelAtual: 'Fotus',
        },
      });
    }
  }

  // 4. Pagamentos de parcelas
  for (const parcela of parcelasPagas) {
    events.push({
      id: `TL-${contract.id}-${eventId++}`,
      type: 'parcela_paga',
      date: parcela.dataPagamento!,
      title: `Pagamento da parcela ${parcela.numero}`,
      description: `Valor pago: R$ ${(parcela.valorPago || parcela.valorOriginal).toFixed(2).replace('.', ',')}`,
      author: 'Sistema',
      metadata: {
        parcelaNumero: parcela.numero,
        valor: parcela.valorOriginal,
        valorPago: parcela.valorPago,
      },
    });
  }

  // 5. Pagamento parcial (30% de chance para contratos com atraso > 60 dias)
  if (parcelasEmAtraso.length > 0 && parcelasEmAtraso[0].diasAtraso > 60 && Math.random() < 0.3) {
    const dataVenc = new Date(parcelasEmAtraso[0].dataVencimento);
    const diasAposvenc = getRandomInRange(30, 50);
    const dataPagParcial = new Date(dataVenc);
    dataPagParcial.setDate(dataPagParcial.getDate() + diasAposvenc);
    const valorParcial = Math.round(parcelasEmAtraso[0].valorOriginal * getRandomInRange(20, 60) / 100);

    events.push({
      id: `TL-${contract.id}-${eventId++}`,
      type: 'pagamento_parcial',
      date: dataPagParcial.toISOString().split('T')[0],
      title: 'Pagamento parcial recebido',
      description: `Valor parcial de R$ ${valorParcial.toFixed(2).replace('.', ',')} recebido.`,
      author: 'Sistema',
      metadata: {
        valor: parcelasEmAtraso[0].valorOriginal,
        valorPago: valorParcial,
        parcelaNumero: parcelasEmAtraso[0].numero,
      },
    });
  }

  // 6. Ações de cobrança (1-4 ações para contratos tratados ou aleatoriamente)
  const isTratado = mockTratadoCache.get(contract.id) || false;
  const numAcoes = isTratado ? getRandomInRange(1, 4) : (Math.random() < 0.5 ? getRandomInRange(1, 2) : 0);

  if (parcelasEmAtraso.length > 0) {
    const dataVenc = new Date(parcelasEmAtraso[0].dataVencimento);

    for (let i = 0; i < numAcoes; i++) {
      const diasAposVenc = getRandomInRange(5 + i * 15, 20 + i * 20);
      const dataAcao = new Date(dataVenc);
      dataAcao.setDate(dataAcao.getDate() + diasAposVenc);
      const tipoContato = getRandomFromArray(tiposContato);
      const resultado = getRandomFromArray(resultadosContato);

      events.push({
        id: `TL-${contract.id}-${eventId++}`,
        type: 'acao_cobranca',
        date: dataAcao.toISOString().split('T')[0],
        title: `Ação de cobrança - ${tipoContato}`,
        description: resultado,
        author: getRandomFromArray(analistas),
        metadata: {
          tipoContato,
          resultadoContato: resultado,
        },
      });
    }
  }

  // 7. Boletos gerados (1-2 para alguns contratos)
  if (parcelasEmAtraso.length > 0 && Math.random() < 0.4) {
    const numBoletos = getRandomInRange(1, 2);
    const dataVenc = new Date(parcelasEmAtraso[0].dataVencimento);

    for (let i = 0; i < numBoletos; i++) {
      const diasAposVenc = getRandomInRange(10 + i * 30, 30 + i * 30);
      const dataBoleto = new Date(dataVenc);
      dataBoleto.setDate(dataBoleto.getDate() + diasAposVenc);

      events.push({
        id: `TL-${contract.id}-${eventId++}`,
        type: 'boleto_gerado',
        date: dataBoleto.toISOString().split('T')[0],
        title: `Boleto gerado`,
        description: `Boleto gerado para parcela(s) em atraso.`,
        author: getRandomFromArray(analistas),
        metadata: {
          valor: parcelasEmAtraso.reduce((acc, p) => acc + p.valorAtualizado, 0),
        },
      });
    }
  }

  // Ordenar cronologicamente (mais antigo primeiro)
  events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return events;
}

// Cache de timeline
const mockTimelineCache: Map<string, TimelineEvent[]> = new Map();

export async function fetchTimelineEvents(contratoId: string): Promise<TimelineEvent[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  if (mockTimelineCache.has(contratoId)) {
    return mockTimelineCache.get(contratoId)!;
  }

  const contract = getMockContractsDetail().find(c => c.id === contratoId);
  if (!contract) return [];

  const events = generateTimelineEvents(contract);
  mockTimelineCache.set(contratoId, events);
  return events;
}
