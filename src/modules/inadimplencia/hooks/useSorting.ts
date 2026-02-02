import { useState, useCallback } from 'react';
import type { ContractSorting, ContractSortField, SortDirection } from '../types/contract';

const initialSorting: ContractSorting = {
  field: 'diasAtraso',
  direction: 'desc',
};

export function useSorting() {
  const [sorting, setSorting] = useState<ContractSorting>(initialSorting);

  const updateSorting = useCallback((field: ContractSortField, direction?: SortDirection) => {
    setSorting((prev) => ({
      field,
      direction: direction || (prev.field === field && prev.direction === 'desc' ? 'asc' : 'desc'),
    }));
  }, []);

  const setSortingFromValue = useCallback((value: string) => {
    const [field, direction] = value.split('-') as [ContractSortField, SortDirection];
    setSorting({ field, direction });
  }, []);

  const sortingValue = `${sorting.field}-${sorting.direction}`;

  return {
    sorting,
    updateSorting,
    setSortingFromValue,
    sortingValue,
  };
}
