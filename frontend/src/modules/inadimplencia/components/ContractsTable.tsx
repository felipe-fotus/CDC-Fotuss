import type { Contract } from '../types/contract';
import { Table, TableHeader, TableBody, TableRow, TableHead, EmptyState } from '@cdc-fotus/design-system';
import ContractRow from './ContractRow';

interface ContractsTableProps {
  contracts: Contract[];
  isLoading: boolean;
}

const LoadingState = () => {
  const skeletonRowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    padding: '1rem',
    gap: '1rem',
    borderBottom: '1px solid var(--color-border-subtle)',
  };

  const skeletonCellStyle: React.CSSProperties = {
    height: '1rem',
    backgroundColor: 'var(--color-border-subtle)',
    borderRadius: 'var(--radius-sm)',
    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  };

  return (
    <div style={{ padding: 'var(--spacing-md)' }}>
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}
      </style>
      {[...Array(8)].map((_, i) => (
        <div key={i} style={skeletonRowStyle}>
          <div style={{ ...skeletonCellStyle, width: '120px' }} />
          <div style={{ ...skeletonCellStyle, width: '150px' }} />
          <div style={{ ...skeletonCellStyle, width: '130px' }} />
          <div style={{ ...skeletonCellStyle, width: '100px' }} />
          <div style={{ ...skeletonCellStyle, width: '90px' }} />
          <div style={{ ...skeletonCellStyle, width: '60px' }} />
          <div style={{ ...skeletonCellStyle, width: '100px' }} />
          <div style={{ ...skeletonCellStyle, width: '90px' }} />
        </div>
      ))}
    </div>
  );
};

const ContractsTable = ({ contracts, isLoading }: ContractsTableProps) => {
  if (isLoading) {
    return <LoadingState />;
  }

  if (contracts.length === 0) {
    return (
      <EmptyState
        title="Nenhum contrato encontrado"
        description="Nenhum contrato corresponde aos filtros aplicados. Tente ajustar os critérios de busca."
        icon={
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </svg>
        }
      />
    );
  }

  const containerStyle: React.CSSProperties = {
    overflowX: 'auto',
    backgroundColor: 'var(--color-surface)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--color-border)',
  };

  return (
    <div style={containerStyle}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead style={{ minWidth: '140px' }}>ID Contrato</TableHead>
            <TableHead style={{ minWidth: '180px' }}>Cliente Pagante</TableHead>
            <TableHead style={{ minWidth: '150px' }}>Integrador</TableHead>
            <TableHead style={{ minWidth: '120px' }}>Origem</TableHead>
            <TableHead style={{ minWidth: '110px', textAlign: 'center' }}>Vencimento</TableHead>
            <TableHead style={{ minWidth: '90px', textAlign: 'center' }}>Atraso</TableHead>
            <TableHead style={{ minWidth: '130px', textAlign: 'right' }}>Valor em Atraso</TableHead>
            <TableHead style={{ minWidth: '110px' }}>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contracts.map((contract, index) => (
            <ContractRow key={contract.id} contract={contract} index={index} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ContractsTable;
