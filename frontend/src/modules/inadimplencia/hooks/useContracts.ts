import { useState, useEffect, useMemo } from 'react';
import type { Contract, ContractFilters, ContractSorting, InadimplenciaMetrics } from '../types/contract';
import {
  fetchContracts,
  getUniqueClientes,
  getUniqueIntegradores,
  getUniqueOrigens,
  getUniqueStatus,
  calculateMetrics,
} from '../services/contractsService';

interface UseContractsResult {
  contracts: Contract[];
  filteredContracts: Contract[];
  metrics: InadimplenciaMetrics;
  isLoading: boolean;
  error: string | null;
  uniqueClientes: string[];
  uniqueIntegradores: string[];
  uniqueOrigens: string[];
  uniqueStatus: string[];
}

const emptyMetrics: InadimplenciaMetrics = {
  totalContratos: 0,
  valorTotalAtraso: 0,
  mediaAtraso: 0,
  situacoesCriticas: 0,
};

export function useContracts(
  filters: ContractFilters,
  sorting: ContractSorting
): UseContractsResult {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadContracts() {
      try {
        setIsLoading(true);
        const data = await fetchContracts();
        if (isMounted) {
          setContracts(data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError('Erro ao carregar contratos');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadContracts();

    return () => {
      isMounted = false;
    };
  }, []);

  const uniqueClientes = useMemo(() => getUniqueClientes(contracts), [contracts]);
  const uniqueIntegradores = useMemo(() => getUniqueIntegradores(contracts), [contracts]);
  const uniqueOrigens = useMemo(() => getUniqueOrigens(contracts), [contracts]);
  const uniqueStatus = useMemo(() => getUniqueStatus(contracts), [contracts]);

  // Metricas calculadas sobre TODOS os contratos (nao filtrados)
  const metrics = useMemo(() => {
    if (contracts.length === 0) return emptyMetrics;
    return calculateMetrics(contracts);
  }, [contracts]);

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

    // Filtro por cliente pagante
    if (filters.clientePagante) {
      const searchTerm = filters.clientePagante.toLowerCase();
      result = result.filter((contract) =>
        contract.clientePagante.toLowerCase().includes(searchTerm)
      );
    }

    // Filtro por integrador
    if (filters.integrador) {
      const searchTerm = filters.integrador.toLowerCase();
      result = result.filter((contract) =>
        contract.integrador.toLowerCase().includes(searchTerm)
      );
    }

    // Filtro por status
    if (filters.status) {
      result = result.filter((contract) => contract.status === filters.status);
    }

    // Filtro por origem do contrato
    if (filters.origemContrato) {
      result = result.filter((contract) => contract.origemContrato === filters.origemContrato);
    }

    // Ordenacao
    result.sort((a, b) => {
      let comparison = 0;

      switch (sorting.field) {
        case 'diasAtraso':
          comparison = a.diasAtraso - b.diasAtraso;
          break;
        case 'valorAtraso':
          comparison = a.valorAtraso - b.valorAtraso;
          break;
        case 'dataVencimento':
          comparison = new Date(a.dataVencimento).getTime() - new Date(b.dataVencimento).getTime();
          break;
      }

      return sorting.direction === 'desc' ? -comparison : comparison;
    });

    return result;
  }, [contracts, filters, sorting]);

  return {
    contracts,
    filteredContracts,
    metrics,
    isLoading,
    error,
    uniqueClientes,
    uniqueIntegradores,
    uniqueOrigens,
    uniqueStatus,
  };
}
