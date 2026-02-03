import { useNavigate } from 'react-router-dom';
import type { Contract } from '../types/contract';
import { TableRow, TableCell, Badge } from '@cdc-fotus/design-system';
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
  const statusTag = getStatusTag(contract.diasAtraso, contract.valorAtraso);

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
        <Badge variant={statusTag.variant}>{statusTag.label}</Badge>
      </TableCell>
    </TableRow>
  );
};

export default ContractRow;

const getStatusTag = (diasAtraso: number, valorAtraso: number) => {
  if (diasAtraso >= 180 || valorAtraso >= 50000) {
    return { label: 'Critico', variant: 'critical' as const };
  }
  if (diasAtraso >= 90 || valorAtraso >= 20000) {
    return { label: 'Alto', variant: 'high' as const };
  }
  if (diasAtraso >= 30 || valorAtraso >= 5000) {
    return { label: 'Medio', variant: 'medium' as const };
  }
  return { label: 'Baixo', variant: 'low' as const };
};
