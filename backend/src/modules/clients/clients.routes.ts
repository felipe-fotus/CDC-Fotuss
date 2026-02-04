import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../../config/database.js';
import { NotFoundError } from '../../shared/errors/app-error.js';

const clientParamsSchema = z.object({
  id: z.string(),
});

export async function clientsRoutes(app: FastifyInstance) {
  // Get client by ID
  app.get('/:id', async (request) => {
    const { id } = clientParamsSchema.parse(request.params);

    const client = await prisma.cliente.findUnique({
      where: { id },
      include: {
        contratos: {
          select: {
            id: true,
            origemContrato: true,
            dataContratacao: true,
            valorTotal: true,
            status: true,
          },
        },
      },
    });

    if (!client) {
      throw new NotFoundError('Client');
    }

    return {
      success: true,
      data: {
        id: client.id,
        nome: client.nome,
        cpfCnpj: client.cpfCnpj,
        email: client.email,
        telefone: client.telefone,
        endereco: client.endereco,
        contratos: client.contratos.map((c) => ({
          id: c.id,
          origemContrato: c.origemContrato,
          dataContratacao: c.dataContratacao.toISOString(),
          valorTotal: Number(c.valorTotal),
          status: c.status,
        })),
        createdAt: client.createdAt.toISOString(),
        updatedAt: client.updatedAt.toISOString(),
      },
    };
  });

  // Get client contracts
  app.get('/:id/contracts', async (request) => {
    const { id } = clientParamsSchema.parse(request.params);

    const client = await prisma.cliente.findUnique({
      where: { id },
      include: {
        contratos: {
          include: {
            parcelas: {
              where: { status: 'em_atraso' },
            },
          },
        },
      },
    });

    if (!client) {
      throw new NotFoundError('Client');
    }

    const today = new Date();

    return {
      success: true,
      data: client.contratos.map((c) => {
        const parcelasEmAtraso = c.parcelas;
        const saldoDevedor = parcelasEmAtraso.reduce(
          (sum, p) => sum + Number(p.valorAtualizado),
          0
        );
        const parcelaMaisAntiga = parcelasEmAtraso.sort(
          (a, b) => a.dataVencimento.getTime() - b.dataVencimento.getTime()
        )[0];
        const diasAtraso = parcelaMaisAntiga
          ? Math.floor(
              (today.getTime() - parcelaMaisAntiga.dataVencimento.getTime()) /
                (1000 * 60 * 60 * 24)
            )
          : 0;

        return {
          id: c.id,
          integrador: c.integrador,
          dataContratacao: c.dataContratacao.toISOString(),
          valorTotal: Number(c.valorTotal),
          parcelasEmAtraso: parcelasEmAtraso.length,
          saldoDevedor,
          diasAtraso,
        };
      }),
    };
  });
}
