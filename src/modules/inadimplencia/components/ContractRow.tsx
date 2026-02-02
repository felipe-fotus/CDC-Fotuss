import { useNavigate } from 'react-router-dom';
import type { Contract } from '../types/contract';
import { TableRow, TableCell } from '../../../components/ui/Table';
import CriticalityTag from './CriticalityTag';
import { formatCurrency, formatDate, truncateText } from '../utils/formatters';
import { getCriticalityLevel, getCriticalityRowStyle } from '../utils/criticality';

interface ContractRowProps {
  contract: Contract;
  index: number;
}

const ContractRow = ({ contract, index }: ContractRowProps) => {
  const navigate = useNavigate();
  const criticalityLevel = getCriticalityLevel(contract.diasAtraso);
  const rowStyle = getCriticalityRowStyle(criticalityLevel);

  const handleClick = () => {
    navigate(`/contratos/${contract.id}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
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
      style={{
        ...rowStyle,
      }}
    >
      <TableCell style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>
        {contract.id}
      </TableCell>
      <TableCell title={contract.clientePagante}>
        {truncateText(contract.clientePagante, 25)}
      </TableCell>
      <TableCell title={contract.integrador}>
        {truncateText(contract.integrador, 20)}
      </TableCell>
      <TableCell>{contract.origemContrato}</TableCell>
      <TableCell style={{ textAlign: 'center' }}>{formatDate(contract.dataVencimento)}</TableCell>
      <TableCell style={{ textAlign: 'center' }}>
        <CriticalityTag diasAtraso={contract.diasAtraso} level={criticalityLevel} />
      </TableCell>
      <TableCell style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
        {formatCurrency(contract.valorAtraso)}
      </TableCell>
      <TableCell>
        <span
          style={{
            display: 'inline-block',
            padding: '0.125rem 0.5rem',
            backgroundColor: 'var(--color-criticality-critical)',
            color: 'var(--color-criticality-critical-text)',
            borderRadius: 'var(--radius-sm)',
            fontSize: 'var(--text-xs)',
            fontWeight: 500,
          }}
        >
          {contract.status}
        </span>
      </TableCell>
    </TableRow>
  );
};

export default ContractRow;
