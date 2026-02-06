import type { TimelineEvent, TimelineEventType } from '../../inadimplencia/types/contract';
import { formatCurrency } from '../../inadimplencia/utils/formatters';

// === CONFIG POR TIPO DE EVENTO ===

interface EventConfig {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: React.ReactNode;
}

const eventConfigs: Record<TimelineEventType, EventConfig> = {
  inicio_inadimplencia: {
    label: 'Inadimplência',
    color: 'var(--color-criticality-critical-text)',
    bgColor: 'var(--color-criticality-critical)',
    borderColor: 'var(--color-criticality-critical-border)',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
  mudanca_faixa_atraso: {
    label: 'Faixa de Atraso',
    color: '#f59e0b',
    bgColor: 'rgba(245, 158, 11, 0.1)',
    borderColor: 'rgba(245, 158, 11, 0.3)',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  mudanca_responsabilidade: {
    label: 'Responsabilidade',
    color: 'var(--color-info, #3b82f6)',
    bgColor: 'rgba(59, 130, 246, 0.1)',
    borderColor: 'rgba(59, 130, 246, 0.3)',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="8.5" cy="7" r="4" />
        <polyline points="17 11 19 13 23 9" />
      </svg>
    ),
  },
  parcela_paga: {
    label: 'Pagamento',
    color: '#10b981',
    bgColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
  },
  pagamento_parcial: {
    label: 'Pagamento Parcial',
    color: '#34d399',
    bgColor: 'rgba(52, 211, 153, 0.1)',
    borderColor: 'rgba(52, 211, 153, 0.3)',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  acao_cobranca: {
    label: 'Cobrança',
    color: 'var(--color-primary)',
    bgColor: 'var(--color-primary-subtle)',
    borderColor: 'rgba(59, 130, 246, 0.2)',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
  },
  boleto_gerado: {
    label: 'Boleto',
    color: 'var(--color-text-muted)',
    bgColor: 'var(--color-surface-elevated)',
    borderColor: 'var(--color-border)',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="9" y1="21" x2="9" y2="9" />
      </svg>
    ),
  },
};

// === FORMATADOR DE DATA ===

function formatEventDate(dateStr: string): { day: string; monthYear: string } {
  const date = new Date(dateStr + 'T12:00:00');
  const day = String(date.getDate()).padStart(2, '0');
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const monthYear = `${months[date.getMonth()]} ${date.getFullYear()}`;
  return { day, monthYear };
}

// === COMPONENTE DE EVENTO ===

const TimelineItem = ({ event, isFirst, isLast, onClick }: { event: TimelineEvent; isFirst: boolean; isLast: boolean; onClick?: (event: TimelineEvent) => void }) => {
  const config = eventConfigs[event.type];
  const { day, monthYear } = formatEventDate(event.date);

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    gap: 'var(--spacing-md)',
    position: 'relative',
    minHeight: '72px',
    paddingBottom: isLast ? 0 : 'var(--spacing-sm)',
  };

  const dateColumnStyle: React.CSSProperties = {
    width: '52px',
    flexShrink: 0,
    textAlign: 'right',
    paddingTop: '2px',
  };

  const lineColumnStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '32px',
    flexShrink: 0,
    position: 'relative',
  };

  const dotStyle: React.CSSProperties = {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: config.bgColor,
    border: `2px solid ${config.borderColor}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: config.color,
    flexShrink: 0,
    zIndex: 1,
  };

  const lineStyle: React.CSSProperties = {
    width: '2px',
    flex: 1,
    backgroundColor: 'var(--color-border)',
    display: isLast ? 'none' : 'block',
  };

  const cardStyle: React.CSSProperties = {
    flex: 1,
    backgroundColor: 'var(--color-surface)',
    border: `1px solid ${config.borderColor}`,
    borderRadius: 'var(--radius-md)',
    padding: 'var(--spacing-sm) var(--spacing-md)',
    borderLeft: `3px solid ${config.color}`,
  };

  const titleRowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 'var(--spacing-sm)',
    marginBottom: event.description ? 'var(--spacing-xs)' : 0,
  };

  const tagStyle: React.CSSProperties = {
    display: 'inline-block',
    padding: '0.0625rem 0.375rem',
    fontSize: '10px',
    fontWeight: 500,
    backgroundColor: config.bgColor,
    color: config.color,
    borderRadius: 'var(--radius-sm)',
    whiteSpace: 'nowrap',
  };

  return (
    <div style={containerStyle}>
      {/* Coluna da data */}
      <div style={dateColumnStyle}>
        <div style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-text-primary)', lineHeight: 1 }}>
          {day}
        </div>
        <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
          {monthYear}
        </div>
      </div>

      {/* Coluna da linha + dot */}
      <div style={lineColumnStyle}>
        <div style={dotStyle}>{config.icon}</div>
        <div style={lineStyle} />
      </div>

      {/* Card do evento */}
      <div
        style={{ ...cardStyle, cursor: onClick ? 'pointer' : 'default', transition: 'box-shadow 150ms ease, border-color 150ms ease' }}
        onClick={() => onClick?.(event)}
        onMouseEnter={(e) => {
          if (onClick) {
            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
            e.currentTarget.style.borderColor = config.color;
          }
        }}
        onMouseLeave={(e) => {
          if (onClick) {
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.borderColor = config.borderColor;
          }
        }}
      >
        <div style={titleRowStyle}>
          <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
            {event.title}
          </span>
          <span style={tagStyle}>{config.label}</span>
        </div>

        {event.description && (
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', margin: 0, marginBottom: 'var(--spacing-xs)' }}>
            {event.description}
          </p>
        )}

        {/* Metadata extra */}
        {event.metadata && (
          <div style={{ display: 'flex', gap: 'var(--spacing-md)', flexWrap: 'wrap' }}>
            {event.metadata.valor !== undefined && (
              <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
                Valor: {formatCurrency(event.metadata.valor)}
              </span>
            )}
            {event.metadata.valorPago !== undefined && (
              <span style={{ fontSize: '10px', color: '#10b981', fontFamily: 'var(--font-mono)' }}>
                Pago: {formatCurrency(event.metadata.valorPago)}
              </span>
            )}
            {event.metadata.faixaAnterior !== undefined && event.metadata.faixaAtual !== undefined && (
              <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
                D+{event.metadata.faixaAnterior} → D+{event.metadata.faixaAtual}
              </span>
            )}
            {event.metadata.responsavelAnterior && event.metadata.responsavelAtual && (
              <span style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>
                {event.metadata.responsavelAnterior} → {event.metadata.responsavelAtual}
              </span>
            )}
          </div>
        )}

        {/* Autor */}
        <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', marginTop: 'var(--spacing-xs)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          {event.author}
        </div>
      </div>
    </div>
  );
};

// === COMPONENTE PRINCIPAL ===

interface TimelineProps {
  events: TimelineEvent[];
  isLoading?: boolean;
  onEventClick?: (event: TimelineEvent) => void;
}

const Timeline = ({ events, isLoading, onEventClick }: TimelineProps) => {
  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 'var(--spacing-xl)' }}>
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              border: '2px solid var(--color-border)',
              borderTopColor: 'var(--color-primary)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto var(--spacing-sm)',
            }}
          />
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>Carregando linha do tempo...</p>
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--spacing-xl)',
        color: 'var(--color-text-muted)',
      }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 'var(--spacing-sm)', opacity: 0.5 }}>
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        <p style={{ fontSize: 'var(--text-sm)', margin: 0 }}>Nenhum evento registrado</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 'var(--spacing-md) var(--spacing-lg)' }}>
      {events.map((event, index) => (
        <TimelineItem
          key={event.id}
          event={event}
          isFirst={index === 0}
          isLast={index === events.length - 1}
          onClick={onEventClick}
        />
      ))}
    </div>
  );
};

export default Timeline;
