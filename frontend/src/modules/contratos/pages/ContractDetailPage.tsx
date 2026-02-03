import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { ContractDetail, Parcela } from '../../inadimplencia/types/contract';
import { fetchContractById } from '../../inadimplencia/services/contractsService';
import { formatCurrency, formatDate, formatDaysOverdue } from '../../inadimplencia/utils/formatters';
import { getCriticalityLevel } from '../../inadimplencia/utils/criticality';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';

// === SIDEBAR CARD ===

const SidebarCard = ({
  title,
  children,
  variant,
}: {
  title: string;
  children: React.ReactNode;
  variant?: 'danger' | 'default';
}) => {
  const cardStyle: React.CSSProperties = {
    backgroundColor: variant === 'danger' ? 'var(--color-criticality-critical)' : 'var(--color-surface)',
    border: `1px solid ${variant === 'danger' ? 'var(--color-criticality-critical-border)' : 'var(--color-border)'}`,
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
    boxShadow: 'var(--shadow-sm)',
  };

  const headerStyle: React.CSSProperties = {
    padding: 'var(--spacing-sm) var(--spacing-md)',
    borderBottom: `1px solid ${variant === 'danger' ? 'var(--color-criticality-critical-border)' : 'var(--color-border-subtle)'}`,
    backgroundColor: variant === 'danger' ? 'rgba(239, 68, 68, 0.1)' : 'var(--color-surface-elevated)',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: 'var(--text-sm)',
    fontWeight: 600,
    color: variant === 'danger' ? 'var(--color-criticality-critical-text)' : 'var(--color-text-primary)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    margin: 0,
  };

  const contentStyle: React.CSSProperties = {
    padding: 'var(--spacing-sm) var(--spacing-md)',
  };

  return (
    <div style={cardStyle}>
      <div style={headerStyle}>
        <h3 style={titleStyle}>{title}</h3>
      </div>
      <div style={contentStyle}>{children}</div>
    </div>
  );
};

const InfoItem = ({
  label,
  value,
  mono,
  highlight,
}: {
  label: string;
  value: string | number;
  mono?: boolean;
  highlight?: boolean;
}) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0.375rem 0',
      borderBottom: '1px solid var(--color-border-subtle)',
    }}
  >
    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{label}</span>
    <span
      style={{
        fontSize: 'var(--text-xs)',
        fontWeight: highlight ? 600 : 500,
        fontFamily: mono ? 'var(--font-mono)' : 'inherit',
        color: highlight ? 'var(--color-criticality-critical-text)' : 'var(--color-text-primary)',
      }}
    >
      {value}
    </span>
  </div>
);

// === PARCELA ROW ===

const ParcelaRow = ({ parcela }: { parcela: Parcela }) => {
  const statusColors: Record<string, { bg: string; text: string }> = {
    paga: { bg: 'var(--color-criticality-low)', text: 'var(--color-criticality-low-text)' },
    em_atraso: { bg: 'var(--color-criticality-critical)', text: 'var(--color-criticality-critical-text)' },
    a_vencer: { bg: 'var(--color-border-subtle)', text: 'var(--color-text-muted)' },
  };

  const statusLabels: Record<string, string> = {
    paga: 'Paga',
    em_atraso: 'Atraso',
    a_vencer: 'A Vencer',
  };

  const colors = statusColors[parcela.status];
  const isOverdue = parcela.status === 'em_atraso';

  const rowStyle: React.CSSProperties = {
    backgroundColor: isOverdue ? 'var(--color-criticality-critical)' : 'transparent',
    borderLeft: isOverdue ? '3px solid var(--color-criticality-critical-border)' : '3px solid transparent',
  };

  const cellStyle: React.CSSProperties = {
    padding: '0.5rem 0.75rem',
    fontSize: 'var(--text-xs)',
    borderBottom: '1px solid var(--color-border-subtle)',
  };

  return (
    <tr style={rowStyle}>
      <td style={{ ...cellStyle, fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>
        {String(parcela.numero).padStart(2, '0')}
      </td>
      <td style={cellStyle}>{formatDate(parcela.dataVencimento)}</td>
      <td style={{ ...cellStyle, color: 'var(--color-text-muted)' }}>
        {parcela.dataPagamento ? formatDate(parcela.dataPagamento) : '-'}
      </td>
      <td style={{ ...cellStyle, fontFamily: 'var(--font-mono)', textAlign: 'right' }}>
        {formatCurrency(parcela.valorOriginal)}
      </td>
      <td style={{ ...cellStyle, fontFamily: 'var(--font-mono)', textAlign: 'right', fontWeight: isOverdue ? 600 : 400 }}>
        {formatCurrency(parcela.valorAtualizado)}
      </td>
      <td style={{ ...cellStyle, textAlign: 'center' }}>
        <span
          style={{
            display: 'inline-block',
            padding: '0.125rem 0.375rem',
            fontSize: '10px',
            fontWeight: 500,
            backgroundColor: colors.bg,
            color: colors.text,
            borderRadius: 'var(--radius-sm)',
          }}
        >
          {statusLabels[parcela.status]}
        </span>
      </td>
      <td
        style={{
          ...cellStyle,
          fontFamily: 'var(--font-mono)',
          textAlign: 'center',
          color: isOverdue ? 'var(--color-criticality-critical-text)' : 'var(--color-text-muted)',
        }}
      >
        {isOverdue ? formatDaysOverdue(parcela.diasAtraso) : '-'}
      </td>
    </tr>
  );
};

// === LOADING & ERROR ===

const LoadingState = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
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
      <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>Carregando...</p>
    </div>
  </div>
);

const ErrorState = ({ message, onBack }: { message: string; onBack: () => void }) => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
    <div style={{ textAlign: 'center' }}>
      <p style={{ color: 'var(--color-criticality-critical-text)', marginBottom: 'var(--spacing-md)', fontSize: 'var(--text-sm)' }}>
        {message}
      </p>
      <Button variant="secondary" size="sm" onClick={onBack}>
        Voltar
      </Button>
    </div>
  </div>
);

// === MAIN COMPONENT ===

const ContractDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [contract, setContract] = useState<ContractDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadContract() {
      if (!id) return;
      try {
        setIsLoading(true);
        const data = await fetchContractById(id);
        if (isMounted) {
          if (data) {
            setContract(data);
          } else {
            setError('Contrato nao encontrado');
          }
        }
      } catch {
        if (isMounted) {
          setError('Erro ao carregar contrato');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadContract();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleBack = () => navigate('/inadimplencia');

  const pageStyle: React.CSSProperties = {
    display: 'flex',
    flex: 1,
    backgroundColor: 'var(--color-bg)',
    overflow: 'hidden',
  };

  if (isLoading) return <div style={pageStyle}><LoadingState /></div>;
  if (error || !contract) return <div style={pageStyle}><ErrorState message={error || 'Erro'} onBack={handleBack} /></div>;

  const criticalityLevel = getCriticalityLevel(contract.diasAtrasoMaisAntigo);
  const criticalityVariant = criticalityLevel as 'low' | 'medium' | 'high' | 'critical';
  const todasParcelas = contract.parcelas;
  const parcelasEmAtraso = contract.parcelas.filter((p) => p.status === 'em_atraso');

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    flex: 1,
    overflowY: 'auto',
    alignItems: 'flex-start',
  };

  const sidebarStyle: React.CSSProperties = {
    position: 'sticky',
    top: 0,
    height: 'fit-content',
    width: isSidebarOpen ? '300px' : '48px',
    backgroundColor: 'var(--color-bg)',
    borderRight: '1px solid var(--color-border)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    transition: 'width 200ms ease',
  };

  const sidebarHeaderStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: isSidebarOpen ? 'space-between' : 'center',
    padding: isSidebarOpen ? 'var(--spacing-md) var(--spacing-lg)' : 'var(--spacing-sm)',
    borderBottom: '1px solid var(--color-border-subtle)',
    backgroundColor: 'var(--color-surface)',
    gap: 'var(--spacing-sm)',
  };

  const sidebarTitleStyle: React.CSSProperties = {
    fontSize: 'var(--text-sm)',
    fontWeight: 600,
    color: 'var(--color-text-primary)',
    whiteSpace: 'nowrap',
  };

  const sidebarToggleButtonStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '28px',
    height: '28px',
    borderRadius: 'var(--radius-md)',
    border: 'none',
    backgroundColor: 'transparent',
    color: 'var(--color-text-secondary)',
    cursor: 'pointer',
    transition: 'background-color 150ms ease, color 150ms ease',
  };

  const sidebarContentStyle: React.CSSProperties = {
    padding: 'var(--spacing-md)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-md)',
    opacity: isSidebarOpen ? 1 : 0,
    transition: 'opacity 150ms ease',
    overflowY: 'visible',
    pointerEvents: isSidebarOpen ? 'auto' : 'none',
  };

  const mainStyle: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'visible',
  };

  const headerStyle: React.CSSProperties = {
    padding: 'var(--spacing-md) var(--spacing-lg)',
    borderBottom: '1px solid var(--color-border)',
    backgroundColor: 'var(--color-surface)',
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-md)',
  };

  const tableContainerStyle: React.CSSProperties = {
    flex: 1,
    padding: 'var(--spacing-lg)',
    overflowY: 'visible',
  };

  const tableWrapperStyle: React.CSSProperties = {
    backgroundColor: 'var(--color-surface)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--color-border)',
    overflow: 'hidden',
  };

  const tableHeaderStyle: React.CSSProperties = {
    padding: 'var(--spacing-md)',
    borderBottom: '1px solid var(--color-border)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        {/* Sidebar */}
        <aside style={sidebarStyle}>
          <div style={sidebarHeaderStyle}>
            {isSidebarOpen && <span style={sidebarTitleStyle}>Resumo</span>}
            <button
              type="button"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              style={sidebarToggleButtonStyle}
              title={isSidebarOpen ? 'Ocultar resumo' : 'Mostrar resumo'}
              aria-label={isSidebarOpen ? 'Ocultar resumo' : 'Mostrar resumo'}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-primary-subtle)';
                e.currentTarget.style.color = 'var(--color-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--color-text-secondary)';
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  transform: isSidebarOpen ? 'rotate(0deg)' : 'rotate(180deg)',
                  transition: 'transform 200ms ease',
                }}
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
          </div>
          <div style={sidebarContentStyle}>
            {/* Resumo do Atraso */}
            <SidebarCard title="Resumo do Atraso" variant="danger">
              <InfoItem label="Atraso Atual" value={formatDaysOverdue(contract.diasAtrasoMaisAntigo)} mono highlight />
              <InfoItem label="Valor em Atraso" value={formatCurrency(contract.valorTotalAtraso)} mono highlight />
              <InfoItem label="Parcelas em Atraso" value={contract.parcelasEmAtraso} mono />
              <InfoItem label="Venc. Mais Antigo" value={formatDate(contract.dataVencimentoMaisAntigo)} />
            </SidebarCard>

            {/* Dados do Contrato */}
            <SidebarCard title="Contrato">
              <InfoItem label="Data" value={formatDate(contract.dataContratacao)} />
              <InfoItem label="Valor Total" value={formatCurrency(contract.valorTotal)} mono />
              <InfoItem label="Entrada" value={formatCurrency(contract.valorEntrada)} mono />
              <InfoItem label="Parcelas" value={`${contract.quantidadeParcelas}x`} />
              <InfoItem label="Taxa" value={`${contract.taxaJuros.toFixed(2)}% a.m.`} />
              <InfoItem label="Origem" value={contract.origemContrato} />
            </SidebarCard>

            {/* Dados do Cliente */}
            <SidebarCard title="Cliente">
              <InfoItem label="Nome" value={contract.cliente.nome} />
              <InfoItem label="CPF/CNPJ" value={contract.cliente.cpfCnpj} mono />
              <InfoItem label="Telefone" value={contract.cliente.telefone} mono />
              <InfoItem label="Email" value={contract.cliente.email} />
              <InfoItem label="Cidade" value={`${contract.cliente.endereco.cidade}/${contract.cliente.endereco.uf}`} />
            </SidebarCard>

            {/* Integrador */}
            <SidebarCard title="Integrador">
              <InfoItem label="Nome" value={contract.integrador} />
              <InfoItem label="CNPJ" value={contract.integradorCnpj} mono />
            </SidebarCard>
          </div>
        </aside>

        {/* Main Content */}
        <main style={mainStyle}>
          {/* Header */}
          <header style={headerStyle}>
            {/* Back button on the LEFT */}
            <Button variant="secondary" size="sm" onClick={handleBack}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Voltar
            </Button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', flex: 1 }}>
              <h1 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, margin: 0, fontFamily: 'var(--font-mono)' }}>
                {contract.id}
              </h1>
              <Badge variant={criticalityVariant} style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                {formatDaysOverdue(contract.diasAtrasoMaisAntigo)}
              </Badge>
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
                {contract.cliente.nome}
              </span>
            </div>
          </header>

          {/* Parcelas Table */}
          <div style={tableContainerStyle}>
            <div style={tableWrapperStyle}>
              <div style={tableHeaderStyle}>
                <h2 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, margin: 0, color: 'var(--color-text-primary)' }}>
                  Parcelas do Contrato
                </h2>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                  {parcelasEmAtraso.length} em atraso de {todasParcelas.length} parcelas
                </span>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--color-border-subtle)' }}>
                      <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-muted)' }}>#</th>
                      <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-muted)' }}>Vencimento</th>
                      <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-muted)' }}>Pagamento</th>
                      <th style={{ padding: '0.5rem 0.75rem', textAlign: 'right', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-muted)' }}>Original</th>
                      <th style={{ padding: '0.5rem 0.75rem', textAlign: 'right', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-muted)' }}>Atualizado</th>
                      <th style={{ padding: '0.5rem 0.75rem', textAlign: 'center', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-muted)' }}>Status</th>
                      <th style={{ padding: '0.5rem 0.75rem', textAlign: 'center', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-muted)' }}>Atraso</th>
                    </tr>
                  </thead>
                  <tbody>
                    {todasParcelas.map((parcela) => (
                      <ParcelaRow key={parcela.numero} parcela={parcela} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ContractDetailPage;
