import { useState, useCallback } from 'react';
import type { ContractFilters } from '../types/contract';

const initialFilters: ContractFilters = {
  faixasAtraso: [],
  clienteBusca: '',
  integradorBusca: '',
  statusTratamento: 'todos',
};

export function useFilters() {
  const [filters, setFilters] = useState<ContractFilters>(initialFilters);

  const updateFilter = useCallback(<K extends keyof ContractFilters>(
    key: K,
    value: ContractFilters[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const toggleFaixaAtraso = useCallback((faixa: number) => {
    setFilters((prev) => {
      const newFaixas = prev.faixasAtraso.includes(faixa)
        ? prev.faixasAtraso.filter((f) => f !== faixa)
        : [...prev.faixasAtraso, faixa];
      return { ...prev, faixasAtraso: newFaixas };
    });
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(initialFilters);
  }, []);

  const hasActiveFilters =
    filters.faixasAtraso.length > 0 ||
    filters.clienteBusca !== '' ||
    filters.integradorBusca !== '' ||
    filters.statusTratamento !== 'todos';

  return {
    filters,
    updateFilter,
    toggleFaixaAtraso,
    clearFilters,
    hasActiveFilters,
  };
}
