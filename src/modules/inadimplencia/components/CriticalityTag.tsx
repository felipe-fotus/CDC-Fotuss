import Badge from '../../../components/ui/Badge';
import type { CriticalityLevel } from '../types/contract';
import { formatDaysOverdue } from '../utils/formatters';
import { getCriticalityBadgeVariant } from '../utils/criticality';

interface CriticalityTagProps {
  diasAtraso: number;
  level: CriticalityLevel;
}

const CriticalityTag = ({ diasAtraso, level }: CriticalityTagProps) => {
  const variant = getCriticalityBadgeVariant(level);

  return (
    <Badge variant={variant} style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
      {formatDaysOverdue(diasAtraso)}
    </Badge>
  );
};

export default CriticalityTag;
