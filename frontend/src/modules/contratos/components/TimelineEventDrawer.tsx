import type { TimelineEvent, TimelineEventType } from '../../inadimplencia/types/contract';
import { formatCurrency } from '../../inadimplencia/utils/formatters';

// === CONFIG POR TIPO ===

interface EventTypeConfig {
  label: string;
  color: string;
  bgColor: string;
  icon: React.ReactNode;
}

const eventTypeConfigs: Record<TimelineEventType, EventTypeConfig> = {
  inicio_inadimplencia: {
    label: 'Início da Inadimplência',
    color: 'var(--color-criticality-critical-text)',
    bgColor: 'var(--color-criticality-critical)',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
  mudanca_faixa_atraso: {
    label: 'Mudança de Faixa de Atraso',
    color: '#f59e0b',
    bgColor: 'rgba(245, 158, 11, 0.1)',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  mudanca_responsabilidade: {
    label: 'Mudança de Responsabilidade',
    color: 'var(--color-info, #3b82f6)',
    bgColor: 'rgba(59, 130, 246, 0.1)',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="8.5" cy="7" r="4" />
        <polyline points="17 11 19 13 23 9" />
      </svg>
    ),
  },
  parcela_paga: {
    label: 'Pagamento de Parcela',
    color: '#10b981',
    bgColor: 'rgba(16, 185, 129, 0.1)',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
  },
  pagamento_parcial: {
    label: 'Pagamento Parcial',
    color: '#34d399',
    bgColor: 'rgba(52, 211, 153, 0.1)',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  acao_cobranca: {
    label: 'Ação de Cobrança',
    color: 'var(--color-primary)',
    bgColor: 'var(--color-primary-subtle)',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
  },
  boleto_gerado: {
    label: 'Boleto Gerado',
    color: 'var(--color-text-muted)',
    bgColor: 'var(--color-surface-elevated)',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="9" y1="21" x2="9" y2="9" />
      </svg>
    ),
  },
};

// === HELPERS ===

function formatFullDate(dateStr: string): string {
  const date = new Date(dateStr + 'T12:00:00');
  return date.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

function daysAgo(dateStr: string): string {
  const date = new Date(dateStr + 'T12:00:00');
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  const diff = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return 'Hoje';
  if (diff === 1) return 'Ontem';
  return `${diff} dias atrás`;
}

// === DETAIL ROW ===

const DetailRow = ({ label, value, mono, highlight }: {
  label: string;
  value: string | number | React.ReactNode;
  mono?: boolean;
  highlight?: boolean;
}) => (
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.625rem 0',
    borderBottom: '1px solid var(--color-border-subtle)',
  }}>
    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{label}</span>
    <span style={{
      fontSize: 'var(--text-sm)',
      fontWeight: highlight ? 600 : 500,
      fontFamily: mono ? 'var(--font-mono)' : 'inherit',
      color: highlight ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
      textAlign: 'right',
      maxWidth: '60%',
    }}>
      {value}
    </span>
  </div>
);

// === SECTION ===

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div style={{ marginBottom: 'var(--spacing-lg)' }}>
    <h4 style={{
      fontSize: 'var(--text-xs)',
      fontWeight: 600,
      color: 'var(--color-text-muted)',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      marginBottom: 'var(--spacing-sm)',
      margin: 0,
      paddingBottom: 'var(--spacing-xs)',
    }}>
      {title}
    </h4>
    {children}
  </div>
);

// === DETALHES POR TIPO ===

function renderEventDetails(event: TimelineEvent) {
  const { type, metadata } = event;

  switch (type) {
    case 'inicio_inadimplencia':
      return (
        <Section title="Detalhes da Inadimplência">
          {metadata?.parcelaNumero !== undefined && (
            <DetailRow label="Parcela" value={`#${String(metadata.parcelaNumero).padStart(2, '0')}`} mono />
          )}
          {metadata?.valor !== undefined && (
            <DetailRow label="Valor da Parcela" value={formatCurrency(metadata.valor)} mono highlight />
          )}
          {metadata?.diasAtraso !== undefined && (
            <DetailRow label="Dias em Atraso (atual)" value={`${metadata.diasAtraso} dias`} mono highlight />
          )}
        </Section>
      );

    case 'mudanca_faixa_atraso':
      return (
        <Section title="Detalhes da Mudança">
          {metadata?.faixaAnterior !== undefined && metadata?.faixaAtual !== undefined && (
            <>
              <DetailRow label="Faixa Anterior" value={`D+${metadata.faixaAnterior}`} mono />
              <DetailRow label="Faixa Atual" value={`D+${metadata.faixaAtual}`} mono highlight />
              <div style={{
                marginTop: 'var(--spacing-sm)',
                padding: 'var(--spacing-sm)',
                backgroundColor: 'rgba(245, 158, 11, 0.08)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid rgba(245, 158, 11, 0.2)',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-xs)',
                  fontSize: 'var(--text-xs)',
                  color: '#f59e0b',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 600,
                }}>
                  D+{metadata.faixaAnterior}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                  D+{metadata.faixaAtual}
                </div>
              </div>
            </>
          )}
          {metadata?.diasAtraso !== undefined && (
            <DetailRow label="Dias em Atraso" value={`${metadata.diasAtraso} dias`} mono />
          )}
        </Section>
      );

    case 'mudanca_responsabilidade':
      return (
        <Section title="Detalhes da Transferência">
          {metadata?.responsavelAnterior && (
            <DetailRow label="Responsável Anterior" value={metadata.responsavelAnterior} />
          )}
          {metadata?.responsavelAtual && (
            <DetailRow label="Novo Responsável" value={metadata.responsavelAtual} highlight />
          )}
          <div style={{
            marginTop: 'var(--spacing-sm)',
            padding: 'var(--spacing-sm)',
            backgroundColor: 'rgba(59, 130, 246, 0.08)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-xs)',
              fontSize: 'var(--text-xs)',
              color: 'var(--color-info, #3b82f6)',
            }}>
              {metadata?.responsavelAnterior}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
              <strong>{metadata?.responsavelAtual}</strong>
            </div>
          </div>
        </Section>
      );

    case 'parcela_paga':
      return (
        <Section title="Detalhes do Pagamento">
          {metadata?.parcelaNumero !== undefined && (
            <DetailRow label="Parcela" value={`#${String(metadata.parcelaNumero).padStart(2, '0')}`} mono />
          )}
          {metadata?.valor !== undefined && (
            <DetailRow label="Valor Original" value={formatCurrency(metadata.valor)} mono />
          )}
          {metadata?.valorPago !== undefined && (
            <DetailRow label="Valor Pago" value={formatCurrency(metadata.valorPago)} mono highlight />
          )}
          {metadata?.valor !== undefined && metadata?.valorPago !== undefined && metadata.valorPago > metadata.valor && (
            <DetailRow
              label="Juros/Multa"
              value={formatCurrency(metadata.valorPago - metadata.valor)}
              mono
            />
          )}
        </Section>
      );

    case 'pagamento_parcial':
      return (
        <Section title="Detalhes do Pagamento Parcial">
          {metadata?.parcelaNumero !== undefined && (
            <DetailRow label="Parcela Ref." value={`#${String(metadata.parcelaNumero).padStart(2, '0')}`} mono />
          )}
          {metadata?.valor !== undefined && (
            <DetailRow label="Valor Total da Parcela" value={formatCurrency(metadata.valor)} mono />
          )}
          {metadata?.valorPago !== undefined && (
            <DetailRow label="Valor Pago" value={formatCurrency(metadata.valorPago)} mono highlight />
          )}
          {metadata?.valor !== undefined && metadata?.valorPago !== undefined && (
            <DetailRow
              label="Saldo Restante"
              value={formatCurrency(metadata.valor - metadata.valorPago)}
              mono
              highlight
            />
          )}
          {metadata?.valor !== undefined && metadata?.valorPago !== undefined && (
            <div style={{
              marginTop: 'var(--spacing-sm)',
              padding: 'var(--spacing-sm)',
              backgroundColor: 'rgba(52, 211, 153, 0.08)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(52, 211, 153, 0.2)',
            }}>
              <div style={{ fontSize: 'var(--text-xs)', color: '#34d399' }}>
                {Math.round((metadata.valorPago / metadata.valor) * 100)}% do valor foi pago
              </div>
            </div>
          )}
        </Section>
      );

    case 'acao_cobranca':
      return (
        <Section title="Detalhes da Cobrança">
          {metadata?.tipoContato && (
            <DetailRow label="Tipo de Contato" value={metadata.tipoContato} highlight />
          )}
          {metadata?.resultadoContato && (
            <DetailRow label="Resultado" value={metadata.resultadoContato} />
          )}
        </Section>
      );

    case 'boleto_gerado':
      return (
        <Section title="Detalhes do Boleto">
          {metadata?.valor !== undefined && (
            <DetailRow label="Valor do Boleto" value={formatCurrency(metadata.valor)} mono highlight />
          )}
        </Section>
      );

    default:
      return null;
  }
}

// === COMPONENTE PRINCIPAL ===

interface TimelineEventDrawerProps {
  event: TimelineEvent | null;
  isOpen: boolean;
  onClose: () => void;
}

const TimelineEventDrawer = ({ event, isOpen, onClose }: TimelineEventDrawerProps) => {
  if (!event) return null;

  const config = eventTypeConfigs[event.type];

  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: 50,
    opacity: isOpen ? 1 : 0,
    pointerEvents: isOpen ? 'auto' : 'none',
    transition: 'opacity 200ms ease',
  };

  const drawerStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    width: '420px',
    maxWidth: '90vw',
    backgroundColor: 'var(--color-bg)',
    boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.15)',
    zIndex: 51,
    transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
    transition: 'transform 250ms ease',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  };

  const headerStyle: React.CSSProperties = {
    padding: 'var(--spacing-lg)',
    borderBottom: '1px solid var(--color-border)',
    backgroundColor: 'var(--color-surface)',
  };

  const contentStyle: React.CSSProperties = {
    padding: 'var(--spacing-lg)',
    flex: 1,
    overflowY: 'auto',
  };

  return (
    <>
      {/* Overlay */}
      <div style={overlayStyle} onClick={onClose} />

      {/* Drawer */}
      <div style={drawerStyle}>
        {/* Header */}
        <div style={headerStyle}>
          {/* Close + Type tag */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--spacing-xs)',
              padding: '0.25rem 0.625rem',
              fontSize: 'var(--text-xs)',
              fontWeight: 500,
              backgroundColor: config.bgColor,
              color: config.color,
              borderRadius: 'var(--radius-full)',
            }}>
              {config.icon}
              {config.label}
            </span>
            <button
              type="button"
              onClick={onClose}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-surface-elevated)',
                color: 'var(--color-text-muted)',
                cursor: 'pointer',
                transition: 'all 150ms ease',
              }}
              title="Fechar"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Título */}
          <h2 style={{
            fontSize: 'var(--text-lg)',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            margin: 0,
            marginBottom: 'var(--spacing-xs)',
          }}>
            {event.title}
          </h2>

          {/* Data */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
            <span style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--color-text-secondary)',
            }}>
              {formatFullDate(event.date)}
            </span>
            <span style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--color-text-muted)',
              backgroundColor: 'var(--color-surface-elevated)',
              padding: '0.125rem 0.5rem',
              borderRadius: 'var(--radius-full)',
            }}>
              {daysAgo(event.date)}
            </span>
          </div>
        </div>

        {/* Content */}
        <div style={contentStyle}>
          {/* Descrição */}
          {event.description && (
            <Section title="Descrição">
              <p style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--color-text-secondary)',
                margin: 0,
                lineHeight: 1.6,
                padding: 'var(--spacing-sm)',
                backgroundColor: 'var(--color-surface)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border-subtle)',
              }}>
                {event.description}
              </p>
            </Section>
          )}

          {/* Detalhes específicos por tipo */}
          {renderEventDetails(event)}

          {/* Responsável */}
          <Section title="Responsável">
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-sm)',
              padding: 'var(--spacing-sm)',
              backgroundColor: 'var(--color-surface)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border-subtle)',
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-primary-subtle)',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
                flexShrink: 0,
              }}>
                {event.author.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-text-primary)' }}>
                  {event.author}
                </div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                  {event.author === 'Sistema' ? 'Evento automático' : 'Registro manual'}
                </div>
              </div>
            </div>
          </Section>

          {/* ID do Evento */}
          <div style={{
            marginTop: 'var(--spacing-lg)',
            paddingTop: 'var(--spacing-md)',
            borderTop: '1px solid var(--color-border-subtle)',
          }}>
            <span style={{
              fontSize: '10px',
              color: 'var(--color-text-muted)',
              fontFamily: 'var(--font-mono)',
            }}>
              ID: {event.id}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default TimelineEventDrawer;
