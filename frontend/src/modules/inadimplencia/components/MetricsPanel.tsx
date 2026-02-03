import type { InadimplenciaMetrics } from '../types/contract';
import { formatCurrency } from '../utils/formatters';

interface MetricsPanelProps {
  metrics: InadimplenciaMetrics;
  isLoading: boolean;
}

const MetricCard = ({
  value,
  label,
  variant,
  isLoading,
}: {
  value: string | number;
  label: string;
  variant?: 'default' | 'danger';
  isLoading: boolean;
}) => {
  const cardStyle: React.CSSProperties = {
    backgroundColor: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    padding: 'var(--spacing-md)',
    minWidth: '180px',
    boxShadow: 'var(--shadow-sm)',
  };

  const valueStyle: React.CSSProperties = {
    fontSize: 'var(--text-lg)',
    fontWeight: 700,
    fontFamily: 'var(--font-mono)',
    color: variant === 'danger' ? 'var(--color-criticality-critical-text)' : 'var(--color-text-primary)',
    marginBottom: '0.125rem',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 'var(--text-xs)',
    color: 'var(--color-text-muted)',
  };

  const skeletonStyle: React.CSSProperties = {
    width: '60px',
    height: '20px',
    backgroundColor: 'var(--color-border-subtle)',
    borderRadius: 'var(--radius-sm)',
    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  };

  return (
    <div style={cardStyle}>
      {isLoading ? (
        <div style={skeletonStyle} />
      ) : (
        <div style={valueStyle}>{value}</div>
      )}
      <div style={labelStyle}>{label}</div>
    </div>
  );
};

const MetricsPanel = ({ metrics, isLoading }: MetricsPanelProps) => {
  const containerStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: 'var(--spacing-lg)',
  };

  return (
    <div style={containerStyle}>
      <MetricCard
        value={metrics.totalContratos}
        label="Total de contratos"
        isLoading={isLoading}
      />
      <MetricCard
        value={formatCurrency(metrics.valorTotalAtraso)}
        label="Valor em atraso"
        isLoading={isLoading}
      />
      <MetricCard
        value={`D+${metrics.mediaAtraso}`}
        label="Media de atraso"
        isLoading={isLoading}
      />
      <MetricCard
        value={metrics.situacoesCriticas}
        label="Criticos (D+180)"
        variant="danger"
        isLoading={isLoading}
      />
    </div>
  );
};

export default MetricsPanel;
