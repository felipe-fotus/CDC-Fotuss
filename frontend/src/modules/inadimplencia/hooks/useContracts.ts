import { useState, useEffect, useMemo, useCallback } from 'react';
import type { Contract, ContractFilters, ContractSorting, InadimplenciaMetrics } from '../types/contract';
import {
  fetchContracts,
  calculateMetrics,
} from '../services/contractsService';

interface UseContractsResult {
  contracts: Contract[];
  filteredContracts: Contract[];
  metrics: InadimplenciaMetrics;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  tratadosCount: number;
  pendentesCount: number;
}

const emptyMetrics: InadimplenciaMetrics = {
  totalContratos: 0,
  saldoDevedorTotal: 0,
};

export function useContracts(
  filters: ContractFilters,
  sorting: ContractSorting
): UseContractsResult {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadContracts = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await fetchContracts();
      setContracts(data);
      setError(null);
    } catch {
      setError('Erro ao carregar contratos');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadContracts();
  }, [loadContracts]);

  const filteredContracts = useMemo(() => {
    let result = [...contracts];

    // Filtro por faixas de atraso
    if (filters.faixasAtraso.length > 0) {
      result = result.filter((contract) => {
        return filters.faixasAtraso.some((faixa) => {
          const faixas = [30, 60, 90, 120, 150, 180, 360, 540, 720, 900, 1080];
          const currentIndex = faixas.indexOf(faixa);
          const previousFaixa = currentIndex > 0 ? faixas[currentIndex - 1] : 0;
          return contract.diasAtraso > previousFaixa && contract.diasAtraso <= faixa;
        });
      });
    }

    // Filtro por cliente (nome ou CPF/CNPJ)
    if (filters.clienteBusca) {
      const searchTerm = filters.clienteBusca.toLowerCase();
      const searchTermDigits = filters.clienteBusca.replace(/\D/g, '');
      result = result.filter((contract) =>
        contract.clientePagante.toLowerCase().includes(searchTerm) ||
        contract.clienteCpfCnpj.replace(/\D/g, '').includes(searchTermDigits)
      );
    }

    // Filtro por integrador (nome ou CPF/CNPJ)
    if (filters.integradorBusca) {
      const searchTerm = filters.integradorBusca.toLowerCase();
      const searchTermDigits = filters.integradorBusca.replace(/\D/g, '');
      result = result.filter((contract) =>
        contract.integrador.toLowerCase().includes(searchTerm) ||
        contract.integradorCpfCnpj.replace(/\D/g, '').includes(searchTermDigits)
      );
    }

    // Filtro por status de tratamento
    if (filters.statusTratamento === 'tratados') {
      result = result.filter((contract) => contract.tratado);
    } else if (filters.statusTratamento === 'pendentes') {
      result = result.filter((contract) => !contract.tratado);
    }

    // Ordenacao
    result.sort((a, b) => {
      let comparison = 0;

      switch (sorting.field) {
        case 'diasAtraso':
          comparison = a.diasAtraso - b.diasAtraso;
          break;
        case 'saldoDevedor':
          comparison = a.saldoDevedor - b.saldoDevedor;
          break;
        case 'dataVencimento':
          comparison = new Date(a.dataVencimento).getTime() - new Date(b.dataVencimento).getTime();
          break;
      }

      return sorting.direction === 'desc' ? -comparison : comparison;
    });

    return result;
  }, [contracts, filters, sorting]);

  // Metricas calculadas sobre os contratos filtrados
  const metrics = useMemo(() => {
    if (filteredContracts.length === 0) return emptyMetrics;
    return calculateMetrics(filteredContracts);
  }, [filteredContracts]);

  const tratadosCount = useMemo(() => contracts.filter(c => c.tratado).length, [contracts]);
  const pendentesCount = useMemo(() => contracts.filter(c => !c.tratado).length, [contracts]);

  return {
    contracts,
    filteredContracts,
    metrics,
    isLoading,
    error,
    refetch: loadContracts,
    tratadosCount,
    pendentesCount,
  };
}
