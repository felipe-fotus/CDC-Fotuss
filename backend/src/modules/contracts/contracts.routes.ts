import type { FastifyInstance } from 'fastify';
import { contractsService } from './contracts.service.js';
import {
  listContractsQuerySchema,
  contractParamsSchema,
} from './contracts.schema.js';

export async function contractsRoutes(app: FastifyInstance) {
  // List overdue contracts
  app.get('/', async (request) => {
    const query = listContractsQuerySchema.parse(request.query);
    const result = await contractsService.listOverdueContracts(query);

    return {
      success: true,
      data: result.data,
      meta: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    };
  });

  // Get metrics
  app.get('/metrics', async () => {
    const metrics = await contractsService.getMetrics();

    return {
      success: true,
      data: metrics,
    };
  });

  // Get available origins (for filters)
  app.get('/origins', async () => {
    const origins = await contractsService.getOrigins();

    return {
      success: true,
      data: origins,
    };
  });

  // Get contract by ID
  app.get('/:id', async (request) => {
    const { id } = contractParamsSchema.parse(request.params);
    const contract = await contractsService.getContractById(id);

    return {
      success: true,
      data: contract,
    };
  });

  // Get contract installments
  app.get('/:id/installments', async (request) => {
    const { id } = contractParamsSchema.parse(request.params);
    const contract = await contractsService.getContractById(id);

    return {
      success: true,
      data: contract.parcelas,
    };
  });
}
