import { contractsRepository } from './contracts.repository.js';
import type { ListContractsQuery } from './contracts.schema.js';
import { NotFoundError } from '../../shared/errors/app-error.js';

export class ContractsService {
  async listOverdueContracts(query: ListContractsQuery) {
    return contractsRepository.findOverdueContracts(query);
  }

  async getContractById(id: string) {
    const contract = await contractsRepository.findById(id);

    if (!contract) {
      throw new NotFoundError('Contract');
    }

    return contract;
  }

  async getMetrics() {
    return contractsRepository.getMetrics();
  }

  async getOrigins() {
    return contractsRepository.getOrigins();
  }
}

export const contractsService = new ContractsService();
