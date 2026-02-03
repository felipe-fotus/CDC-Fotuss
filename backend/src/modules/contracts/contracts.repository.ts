import { prisma } from '../../config/database.js';
import type { ListContractsQuery } from './contracts.schema.js';
import { delayRangeMap } from './contracts.schema.js';
import { Prisma } from '@prisma/client';

export interface ContractListItem {
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
  cliente: {
    id: string;
    nome: string;
    cpfCnpj: string;
    email: string | null;
    telefone: string | null;
    endereco: unknown;
  };
  integrador: string;
  integradorCnpj: string;
  parcelas: Array<{
    id: string;
    numero: number;
    dataVencimento: string;
    dataPagamento: string | null;
    valorOriginal: number;
    valorAtualizado: number;
    valorPago: number | null;
    status: string;
    diasAtraso: number;
  }>;
  parcelasEmAtraso: number;
  valorTotalAtraso: number;
  diasAtrasoMaisAntigo: number;
  dataVencimentoMaisAntigo: string;
}

export class ContractsRepository {
  async findOverdueContracts(query: ListContractsQuery): Promise<{
    data: ContractListItem[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const { search, delayRanges, origins, statuses, sortField, sortDirection, page, limit } = query;
    const skip = (page - 1) * limit;
    const today = new Date();

    // Build delay range conditions
    let delayConditions: Prisma.Sql[] = [];
    if (delayRanges) {
      const ranges = delayRanges.split(',').map((r) => r.trim());
      delayConditions = ranges
        .filter((r) => delayRangeMap[r])
        .map((r) => {
          const { min, max } = delayRangeMap[r];
          return Prisma.sql`(dias_atraso >= ${min} AND dias_atraso <= ${max})`;
        });
    }

    // Get contracts with overdue installments
    const baseQuery = Prisma.sql`
      WITH contrato_atrasos AS (
        SELECT
          c.id,
          cl.nome as cliente_pagante,
          c.integrador,
          c.origem_contrato,
          MIN(p.data_vencimento) as data_vencimento_mais_antiga,
          MAX(EXTRACT(DAY FROM (NOW() - p.data_vencimento))::int) as dias_atraso,
          SUM(p.valor_atualizado) as valor_atraso,
          c.status
        FROM contratos c
        JOIN clientes cl ON c.cliente_id = cl.id
        JOIN parcelas p ON p.contrato_id = c.id
        WHERE p.status = 'em_atraso'
        GROUP BY c.id, cl.nome, c.integrador, c.origem_contrato, c.status
        HAVING MAX(EXTRACT(DAY FROM (NOW() - p.data_vencimento))::int) > 0
      )
      SELECT
        id,
        cliente_pagante,
        integrador,
        origem_contrato,
        data_vencimento_mais_antiga as data_vencimento,
        dias_atraso,
        valor_atraso,
        status
      FROM contrato_atrasos
      WHERE 1=1
      ${search ? Prisma.sql`AND (cliente_pagante ILIKE ${`%${search}%`} OR integrador ILIKE ${`%${search}%`})` : Prisma.empty}
      ${origins ? Prisma.sql`AND origem_contrato IN (${Prisma.join(origins.split(',').map((o) => o.trim()))})` : Prisma.empty}
      ${delayConditions.length > 0 ? Prisma.sql`AND (${Prisma.join(delayConditions, ' OR ')})` : Prisma.empty}
    `;

    // Get total count
    const countResult = await prisma.$queryRaw<[{ count: bigint }]>`
      SELECT COUNT(*) as count FROM (${baseQuery}) as filtered
    `;
    const total = Number(countResult[0].count);

    // Get paginated data with sorting
    const orderByField = sortField === 'valorAtraso' ? 'valor_atraso' :
                         sortField === 'diasAtraso' ? 'dias_atraso' :
                         sortField === 'clientePagante' ? 'cliente_pagante' :
                         sortField === 'dataVencimento' ? 'data_vencimento' :
                         'dias_atraso';

    const data = await prisma.$queryRaw<ContractListItem[]>`
      SELECT * FROM (${baseQuery}) as filtered
      ORDER BY ${Prisma.raw(orderByField)} ${Prisma.raw(sortDirection === 'asc' ? 'ASC' : 'DESC')}
      LIMIT ${limit}
      OFFSET ${skip}
    `;

    // Transform data
    const transformedData = data.map((row: Record<string, unknown>) => ({
      id: row.id as string,
      clientePagante: row.cliente_pagante as string,
      integrador: row.integrador as string,
      origemContrato: row.origem_contrato as string,
      dataVencimento: (row.data_vencimento as Date).toISOString(),
      diasAtraso: Number(row.dias_atraso),
      valorAtraso: Number(row.valor_atraso),
      status: row.status as string,
    }));

    return {
      data: transformedData,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string): Promise<ContractDetail | null> {
    const contrato = await prisma.contrato.findUnique({
      where: { id },
      include: {
        cliente: true,
        parcelas: {
          orderBy: { numero: 'asc' },
        },
      },
    });

    if (!contrato) return null;

    const today = new Date();
    const parcelasEmAtraso = contrato.parcelas.filter((p) => p.status === 'em_atraso');
    const valorTotalAtraso = parcelasEmAtraso.reduce(
      (sum, p) => sum + Number(p.valorAtualizado),
      0
    );

    const parcelasMaisAntigas = parcelasEmAtraso.sort(
      (a, b) => a.dataVencimento.getTime() - b.dataVencimento.getTime()
    );

    const parcelaMaisAntiga = parcelasMaisAntigas[0];
    const diasAtrasoMaisAntigo = parcelaMaisAntiga
      ? Math.floor((today.getTime() - parcelaMaisAntiga.dataVencimento.getTime()) / (1000 * 60 * 60 * 24))
      : 0;

    return {
      id: contrato.id,
      dataContratacao: contrato.dataContratacao.toISOString(),
      valorTotal: Number(contrato.valorTotal),
      valorEntrada: Number(contrato.valorEntrada),
      quantidadeParcelas: contrato.quantidadeParcelas,
      taxaJuros: Number(contrato.taxaJuros),
      origemContrato: contrato.origemContrato,
      status: contrato.status,
      cliente: {
        id: contrato.cliente.id,
        nome: contrato.cliente.nome,
        cpfCnpj: contrato.cliente.cpfCnpj,
        email: contrato.cliente.email,
        telefone: contrato.cliente.telefone,
        endereco: contrato.cliente.endereco,
      },
      integrador: contrato.integrador,
      integradorCnpj: contrato.integradorCnpj,
      parcelas: contrato.parcelas.map((p) => {
        const diasAtraso =
          p.status === 'em_atraso'
            ? Math.floor((today.getTime() - p.dataVencimento.getTime()) / (1000 * 60 * 60 * 24))
            : 0;

        return {
          id: p.id,
          numero: p.numero,
          dataVencimento: p.dataVencimento.toISOString(),
          dataPagamento: p.dataPagamento?.toISOString() ?? null,
          valorOriginal: Number(p.valorOriginal),
          valorAtualizado: Number(p.valorAtualizado),
          valorPago: p.valorPago ? Number(p.valorPago) : null,
          status: p.status,
          diasAtraso,
        };
      }),
      parcelasEmAtraso: parcelasEmAtraso.length,
      valorTotalAtraso,
      diasAtrasoMaisAntigo,
      dataVencimentoMaisAntigo: parcelaMaisAntiga?.dataVencimento.toISOString() ?? '',
    };
  }

  async getMetrics(): Promise<{
    totalContracts: number;
    totalValueInDelay: number;
    averageDelayDays: number;
    criticalCount: number;
  }> {
    const result = await prisma.$queryRaw<
      [{ total: bigint; total_value: number; avg_days: number; critical: bigint }]
    >`
      WITH contrato_atrasos AS (
        SELECT
          c.id,
          MAX(EXTRACT(DAY FROM (NOW() - p.data_vencimento))::int) as dias_atraso,
          SUM(p.valor_atualizado) as valor_atraso
        FROM contratos c
        JOIN parcelas p ON p.contrato_id = c.id
        WHERE p.status = 'em_atraso'
        GROUP BY c.id
        HAVING MAX(EXTRACT(DAY FROM (NOW() - p.data_vencimento))::int) > 0
      )
      SELECT
        COUNT(*) as total,
        COALESCE(SUM(valor_atraso), 0) as total_value,
        COALESCE(AVG(dias_atraso), 0) as avg_days,
        COUNT(*) FILTER (WHERE dias_atraso >= 180) as critical
      FROM contrato_atrasos
    `;

    return {
      totalContracts: Number(result[0].total),
      totalValueInDelay: Number(result[0].total_value),
      averageDelayDays: Math.round(Number(result[0].avg_days)),
      criticalCount: Number(result[0].critical),
    };
  }

  async getOrigins(): Promise<string[]> {
    const result = await prisma.contrato.findMany({
      select: { origemContrato: true },
      distinct: ['origemContrato'],
    });
    return result.map((r) => r.origemContrato);
  }
}

export const contractsRepository = new ContractsRepository();
