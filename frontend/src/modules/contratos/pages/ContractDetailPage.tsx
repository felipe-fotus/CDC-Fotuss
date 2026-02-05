import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { ContractDetail, Parcela } from '../../inadimplencia/types/contract';
import { fetchContractById, fetchAnotacoes, getStatusTratamento } from '../../inadimplencia/services/contractsService';
import { formatCurrency, formatDate, formatDaysOverdue } from '../../inadimplencia/utils/formatters';
import { getCriticalityLevel } from '../../inadimplencia/utils/criticality';
import { Button, Badge } from '@cdc-fotus/design-system';
import AnotacoesModal from '../../inadimplencia/components/AnotacoesModal';
import BoletoConfirmModal from '../components/BoletoConfirmModal';

// === SIDEBAR CARD COM BOTAO DE COPIAR ===

interface SidebarCardProps {
  title: string;
  children: React.ReactNode;
  variant?: 'danger' | 'default';
  copyData?: string;
}

const SidebarCard = ({ title, children, variant, copyData }: SidebarCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopy = async () => {
    if (!copyData) return;
    try {
      await navigator.clipboard.writeText(copyData);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch {
      console.error('Falha ao copiar');
    }
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: variant === 'danger' ? 'var(--color-criticality-critical)' : 'var(--color-surface)',
    border: `1px solid ${variant === 'danger' ? 'var(--color-criticality-critical-border)' : 'var(--color-border)'}`,
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
    boxShadow: 'var(--shadow-sm)',
    position: 'relative',
  };

  const headerStyle: React.CSSProperties = {
    padding: 'var(--spacing-sm) var(--spacing-md)',
    borderBottom: `1px solid ${variant === 'danger' ? 'var(--color-criticality-critical-border)' : 'var(--color-border-subtle)'}`,
    backgroundColor: variant === 'danger' ? 'rgba(239, 68, 68, 0.1)' : 'var(--color-surface-elevated)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: 'var(--text-sm)',
    fontWeight: 600,
    color: variant === 'danger' ? 'var(--color-criticality-critical-text)' : 'var(--color-text-primary)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    margin: 0,
  };

  const copyButtonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '24px',
    height: '24px',
    padding: 0,
    backgroundColor: copySuccess ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
    border: 'none',
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer',
    color: copySuccess ? '#10b981' : 'var(--color-text-muted)',
    opacity: isHovered || copySuccess ? 1 : 0,
    transition: 'all 150ms ease',
  };

  const contentStyle: React.CSSProperties = {
    padding: 'var(--spacing-sm) var(--spacing-md)',
  };

  return (
    <div
      style={cardStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={headerStyle}>
        <h3 style={titleStyle}>{title}</h3>
        {copyData && (
          <button
            type="button"
            onClick={handleCopy}
            style={copyButtonStyle}
            title={copySuccess ? 'Copiado!' : 'Copiar informacoes'}
          >
            {copySuccess ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            )}
          </button>
        )}
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

interface ParcelaRowProps {
  parcela: Parcela;
  isSelected: boolean;
  onToggleSelect: (numero: number) => void;
}

const ParcelaRow = ({ parcela, isSelected, onToggleSelect }: ParcelaRowProps) => {
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
  const isPaid = parcela.status === 'paga';
  const canSelect = !isPaid;

  const rowStyle: React.CSSProperties = {
    backgroundColor: isSelected ? 'rgba(59, 130, 246, 0.08)' : isOverdue ? 'var(--color-criticality-critical)' : 'transparent',
    borderLeft: isSelected ? '3px solid var(--color-primary)' : isOverdue ? '3px solid var(--color-criticality-critical-border)' : '3px solid transparent',
    opacity: isPaid ? 0.6 : 1,
  };

  const cellStyle: React.CSSProperties = {
    padding: '0.5rem 0.75rem',
    fontSize: 'var(--text-xs)',
    borderBottom: '1px solid var(--color-border-subtle)',
  };

  const checkboxStyle: React.CSSProperties = {
    width: '14px',
    height: '14px',
    cursor: canSelect ? 'pointer' : 'not-allowed',
    accentColor: 'var(--color-primary)',
  };

  return (
    <tr style={rowStyle}>
      <td style={{ ...cellStyle, textAlign: 'center', width: '40px' }}>
        {canSelect ? (
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggleSelect(parcela.numero)}
            style={checkboxStyle}
            title="Selecionar para boleto"
          />
        ) : (
          <span style={{ color: 'var(--color-text-muted)', fontSize: '10px' }}>-</span>
        )}
      </td>
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
      {/* Limites de cobranca - apenas para parcelas em atraso */}
      <td style={{ ...cellStyle, fontFamily: 'var(--font-mono)', textAlign: 'center', fontSize: '10px' }}>
        {isOverdue && parcela.limiteDescontoMax > 0 ? (
          <span title={`Desconto max: ${parcela.limiteDescontoMax}%`} style={{ color: 'var(--color-success, #10b981)' }}>
            {formatCurrency(parcela.limiteDescontoMin)}
            <span style={{ color: 'var(--color-text-muted)', marginLeft: '2px' }}>
              (-{parcela.limiteDescontoMax}%)
            </span>
          </span>
        ) : (
          <span style={{ color: 'var(--color-text-muted)' }}>-</span>
        )}
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBoletoModalOpen, setIsBoletoModalOpen] = useState(false);
  const [anotacoesCount, setAnotacoesCount] = useState(0);
  const [tratado, setTratado] = useState(false);
  const [selectedParcelas, setSelectedParcelas] = useState<Set<number>>(new Set());

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
            const anotacoes = await fetchAnotacoes(id);
            setAnotacoesCount(anotacoes.length);
            setTratado(getStatusTratamento(id));
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

  const handleModalUpdate = async () => {
    if (!id) return;
    const anotacoes = await fetchAnotacoes(id);
    setAnotacoesCount(anotacoes.length);
    setTratado(getStatusTratamento(id));
  };

  const handleToggleParcela = (numeroParcela: number) => {
    setSelectedParcelas(prev => {
      const newSet = new Set(prev);
      if (newSet.has(numeroParcela)) {
        newSet.delete(numeroParcela);
      } else {
        newSet.add(numeroParcela);
      }
      return newSet;
    });
  };

  const handleSelectAllParcelas = () => {
    if (!contract) return;
    const parcelasParaBoleto = contract.parcelas.filter(p => p.status !== 'paga');
    if (selectedParcelas.size === parcelasParaBoleto.length) {
      setSelectedParcelas(new Set());
    } else {
      setSelectedParcelas(new Set(parcelasParaBoleto.map(p => p.numero)));
    }
  };

  const handleGerarBoleto = () => {
    if (selectedParcelas.size === 0) return;
    setIsBoletoModalOpen(true);
  };

  const handleConfirmBoleto = (boletos: { parcelaNumero: number; dataVencimento: string; valor: number }[]) => {
    // TODO: Implementar integracao real
    console.log('Boletos gerados:', boletos);
    setSelectedParcelas(new Set());
  };

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

  // Ordenar parcelas: em_atraso primeiro, depois a_vencer, depois paga
  const statusOrder = { em_atraso: 0, a_vencer: 1, paga: 2 };
  const sortedParcelas = [...contract.parcelas].sort((a, b) => {
    const orderDiff = statusOrder[a.status] - statusOrder[b.status];
    if (orderDiff !== 0) return orderDiff;
    return new Date(a.dataVencimento).getTime() - new Date(b.dataVencimento).getTime();
  });

  const parcelasEmAtraso = contract.parcelas.filter((p) => p.status === 'em_atraso');
  const parcelasAVencer = contract.parcelas.filter((p) => p.status === 'a_vencer');

  // Dados para copiar - Cliente
  const clienteCopyData = [
    `Nome: ${contract.cliente.nome}`,
    `CPF/CNPJ: ${contract.cliente.cpfCnpj}`,
    `Telefone: ${contract.cliente.telefone}`,
    `Email: ${contract.cliente.email}`,
  ].join('\n');

  // Dados para copiar - Integrador
  const integradorCopyData = [
    `Nome: ${contract.integrador}`,
    `CNPJ: ${contract.integradorCnpj}`,
    `Telefone: ${contract.integradorTelefone}`,
    `Email: ${contract.integradorEmail}`,
  ].join('\n');

  // Parcelas selecionadas para o modal de boleto
  const parcelasParaBoleto = contract.parcelas.filter(p => selectedParcelas.has(p.numero));

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

  const actionsStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-sm)',
  };

  const anotacoesButtonStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.375rem',
    padding: '0.375rem 0.75rem',
    fontSize: 'var(--text-xs)',
    fontWeight: 500,
    backgroundColor: anotacoesCount > 0 ? 'var(--color-primary-subtle)' : 'var(--color-surface-elevated)',
    color: anotacoesCount > 0 ? 'var(--color-primary)' : 'var(--color-text-secondary)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    cursor: 'pointer',
    transition: 'all 150ms ease',
  };

  const statusBadgeStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.25rem',
    padding: '0.375rem 0.625rem',
    fontSize: 'var(--text-xs)',
    fontWeight: 500,
    borderRadius: 'var(--radius-full)',
    backgroundColor: tratado ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
    color: tratado ? '#10b981' : '#f59e0b',
    border: `1px solid ${tratado ? '#10b981' : '#f59e0b'}`,
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
              <InfoItem label="Dias em Atraso" value={contract.diasAtrasoMaisAntigo} mono highlight />
              <InfoItem label="Saldo Devedor" value={formatCurrency(contract.valorTotalAtraso)} mono highlight />
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
            </SidebarCard>

            {/* Dados do Cliente - com botao de copiar */}
            <SidebarCard title="Cliente" copyData={clienteCopyData}>
              <InfoItem label="Nome" value={contract.cliente.nome} />
              <InfoItem label="CPF/CNPJ" value={contract.cliente.cpfCnpj} mono />
              <InfoItem label="Telefone" value={contract.cliente.telefone} mono />
              <InfoItem label="Email" value={contract.cliente.email} />
              <InfoItem label="Cidade" value={`${contract.cliente.endereco.cidade}/${contract.cliente.endereco.uf}`} />
            </SidebarCard>

            {/* Integrador - com botao de copiar */}
            <SidebarCard title="Integrador" copyData={integradorCopyData}>
              <InfoItem label="Nome" value={contract.integrador} />
              <InfoItem label="CNPJ" value={contract.integradorCnpj} mono />
              <InfoItem label="Telefone" value={contract.integradorTelefone} mono />
              <InfoItem label="Email" value={contract.integradorEmail} />
            </SidebarCard>
          </div>
        </aside>

        {/* Main Content */}
        <main style={mainStyle}>
          {/* Header - sem botao de copiar */}
          <header style={headerStyle}>
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
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                  <h2 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, margin: 0, color: 'var(--color-text-primary)' }}>
                    Parcelas do Contrato
                  </h2>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                    {parcelasEmAtraso.length} em atraso, {parcelasAVencer.length} a vencer
                  </span>
                </div>
                <div style={actionsStyle}>
                  {/* Botao Gerar Boleto */}
                  {selectedParcelas.size > 0 && (
                    <button
                      type="button"
                      onClick={handleGerarBoleto}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.375rem',
                        padding: '0.375rem 0.75rem',
                        fontSize: 'var(--text-xs)',
                        fontWeight: 500,
                        backgroundColor: 'var(--color-primary)',
                        color: 'white',
                        border: 'none',
                        borderRadius: 'var(--radius-md)',
                        cursor: 'pointer',
                      }}
                      title="Gerar boleto para parcelas selecionadas"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <line x1="3" y1="9" x2="21" y2="9" />
                        <line x1="9" y1="21" x2="9" y2="9" />
                      </svg>
                      Gerar Boleto ({selectedParcelas.size})
                    </button>
                  )}

                  {/* Tag de Status - ao lado do botao anotacoes */}
                  <span style={statusBadgeStyle}>
                    {tratado ? (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                      </svg>
                    )}
                    {tratado ? 'Tratado' : 'Pendente'}
                  </span>

                  {/* Botao Anotacoes */}
                  <button
                    type="button"
                    style={anotacoesButtonStyle}
                    onClick={() => setIsModalOpen(true)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--color-primary)';
                      e.currentTarget.style.backgroundColor = 'var(--color-primary-subtle)';
                      e.currentTarget.style.color = 'var(--color-primary)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--color-border)';
                      e.currentTarget.style.backgroundColor = anotacoesCount > 0 ? 'var(--color-primary-subtle)' : 'var(--color-surface-elevated)';
                      e.currentTarget.style.color = anotacoesCount > 0 ? 'var(--color-primary)' : 'var(--color-text-secondary)';
                    }}
                    title="Anotacoes do contrato"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    Anotacoes
                    {anotacoesCount > 0 && (
                      <span style={{
                        backgroundColor: 'var(--color-primary)',
                        color: 'white',
                        padding: '0.125rem 0.375rem',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '10px',
                        fontWeight: 600,
                      }}>
                        {anotacoesCount}
                      </span>
                    )}
                  </button>
                </div>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--color-border-subtle)' }}>
                      <th style={{ padding: '0.5rem 0.75rem', textAlign: 'center', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-muted)', width: '40px' }}>
                        <input
                          type="checkbox"
                          checked={selectedParcelas.size > 0 && selectedParcelas.size === contract.parcelas.filter(p => p.status !== 'paga').length}
                          onChange={handleSelectAllParcelas}
                          style={{ width: '14px', height: '14px', cursor: 'pointer', accentColor: 'var(--color-primary)' }}
                          title="Selecionar todas"
                        />
                      </th>
                      <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-muted)' }}>#</th>
                      <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-muted)' }}>Vencimento</th>
                      <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-muted)' }}>Pagamento</th>
                      <th style={{ padding: '0.5rem 0.75rem', textAlign: 'right', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-muted)' }}>Original</th>
                      <th style={{ padding: '0.5rem 0.75rem', textAlign: 'right', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-muted)' }}>Atualizado</th>
                      <th style={{ padding: '0.5rem 0.75rem', textAlign: 'center', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-muted)' }} title="Valor minimo com desconto aplicado">Limite Desconto</th>
                      <th style={{ padding: '0.5rem 0.75rem', textAlign: 'center', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-muted)' }}>Status</th>
                      <th style={{ padding: '0.5rem 0.75rem', textAlign: 'center', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-muted)' }}>Atraso</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedParcelas.map((parcela) => (
                      <ParcelaRow
                        key={parcela.numero}
                        parcela={parcela}
                        isSelected={selectedParcelas.has(parcela.numero)}
                        onToggleSelect={handleToggleParcela}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modal de Anotacoes */}
      <AnotacoesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        contratoId={contract.id}
        clienteNome={contract.cliente.nome}
        tratado={tratado}
        onUpdate={handleModalUpdate}
      />

      {/* Modal de Confirmacao de Boleto */}
      <BoletoConfirmModal
        isOpen={isBoletoModalOpen}
        onClose={() => setIsBoletoModalOpen(false)}
        parcelas={parcelasParaBoleto}
        onConfirm={handleConfirmBoleto}
      />
    </div>
  );
};

export default ContractDetailPage;
