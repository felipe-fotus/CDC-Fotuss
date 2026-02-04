import { useNavigate } from 'react-router-dom';
import type { Contract } from '../types/contract';
import { TableRow, TableCell } from '@cdc-fotus/design-system';
import { formatCurrency, formatDate, truncateText } from '../utils/formatters';

interface ContractRowProps {
  contract: Contract;
  index: number;
  onOpenAnotacoes: (contract: Contract) => void;
}

const ContractRow = ({ contract, index, onOpenAnotacoes }: ContractRowProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/contratos/${contract.id}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  const handleAnotacoesClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpenAnotacoes(contract);
  };

  const statusIndicatorStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '20px',
    height: '20px',
    borderRadius: 'var(--radius-full)',
    backgroundColor: contract.tratado ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
    color: contract.tratado ? '#10b981' : '#f59e0b',
  };

  const anotacoesButtonStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.25rem',
    padding: '0.25rem 0.5rem',
    fontSize: '11px',
    fontWeight: 500,
    backgroundColor: contract.quantidadeAnotacoes > 0 ? 'var(--color-primary-subtle)' : 'var(--color-surface-elevated)',
    color: contract.quantidadeAnotacoes > 0 ? 'var(--color-primary)' : 'var(--color-text-muted)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    cursor: 'pointer',
    transition: 'all 150ms ease',
  };

  return (
    <TableRow
      clickable
      zebra
      index={index}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Ver detalhes do contrato ${contract.id}`}
    >
      <TableCell style={{ width: '40px' }}>
        <span style={statusIndicatorStyle} title={contract.tratado ? 'Tratado' : 'Pendente'}>
          {contract.tratado ? (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
            </svg>
          )}
        </span>
      </TableCell>
      <TableCell style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>
        {contract.id}
      </TableCell>
      <TableCell title={contract.clientePagante}>
        {truncateText(contract.clientePagante, 25)}
      </TableCell>
      <TableCell title={contract.integrador}>
        {truncateText(contract.integrador, 20)}
      </TableCell>
      <TableCell style={{ textAlign: 'center' }}>{formatDate(contract.dataVencimento)}</TableCell>
      <TableCell style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
        {contract.diasAtraso}
      </TableCell>
      <TableCell style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
        {formatCurrency(contract.saldoDevedor)}
      </TableCell>
      <TableCell style={{ textAlign: 'center' }}>
        <button
          type="button"
          style={anotacoesButtonStyle}
          onClick={handleAnotacoesClick}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-primary)';
            e.currentTarget.style.backgroundColor = 'var(--color-primary-subtle)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-border)';
            e.currentTarget.style.backgroundColor = contract.quantidadeAnotacoes > 0 ? 'var(--color-primary-subtle)' : 'var(--color-surface-elevated)';
          }}
          title="Ver anotacoes"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          {contract.quantidadeAnotacoes > 0 && contract.quantidadeAnotacoes}
        </button>
      </TableCell>
    </TableRow>
  );
};

export default ContractRow;
