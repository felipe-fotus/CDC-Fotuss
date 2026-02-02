import type { InadimplenciaMetrics } from '../types/contract';
import { formatCurrency } from '../utils/formatters';

interface MetricsPanelProps {
  metrics: InadimplenciaMetrics;
  isLoading: boolean;
}

const MetricsPanel = ({ metrics, isLoading }: MetricsPanelProps) => {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    gap: 'var(--spacing-lg)',
    flexWrap: 'wrap',
  };

  const metricStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'baseline',
    gap: 'var(--spacing-xs)',
  };

  const valueStyle: React.CSSProperties = {
    fontSize: 'var(--text-xl)',
    fontWeight: 700,
    fontFamily: 'var(--font-mono)',
    color: 'var(--color-text-primary)',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 'var(--text-xs)',
    color: 'var(--color-text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.02em',
  };

  const criticalValueStyle: React.CSSProperties = {
    ...valueStyle,
    color: 'var(--color-criticality-critical-text)',
  };

  const skeletonStyle: React.CSSProperties = {
    width: '60px',
    height: '24px',
    backgroundColor: 'var(--color-border-subtle)',
    borderRadius: 'var(--radius-sm)',
    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  };

  if (isLoading) {
    return (
      <div style={containerStyle}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} style={metricStyle}>
            <div style={skeletonStyle} />
            <span style={labelStyle}>...</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={metricStyle}>
        <span style={valueStyle}>{metrics.totalContratos}</span>
        <span style={labelStyle}>contratos</span>
      </div>

      <div style={metricStyle}>
        <span style={valueStyle}>{formatCurrency(metrics.valorTotalAtraso)}</span>
        <span style={labelStyle}>em atraso</span>
      </div>

      <div style={metricStyle}>
        <span style={valueStyle}>D+{metrics.mediaAtraso}</span>
        <span style={labelStyle}>media</span>
      </div>

      <div style={metricStyle}>
        <span style={criticalValueStyle}>{metrics.situacoesCriticas}</span>
        <span style={labelStyle}>criticos (D+180)</span>
      </div>
    </div>
  );
};

export default MetricsPanel;
