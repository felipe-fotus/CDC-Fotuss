import { useState, useEffect } from 'react';
import { Modal, Button } from '@cdc-fotus/design-system';
import type { Parcela } from '../../inadimplencia/types/contract';
import { formatCurrency, formatDate } from '../../inadimplencia/utils/formatters';

interface BoletoConfig {
  parcelaNumero: number;
  dataVencimento: string;
  valor: number;
  valorMinimo: number;
  valorMaximo: number;
  erro: string | null;
}

interface BoletoConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  parcelas: Parcela[];
  onConfirm: (boletos: BoletoConfig[]) => void;
}

const BoletoConfirmModal = ({
  isOpen,
  onClose,
  parcelas,
  onConfirm,
}: BoletoConfirmModalProps) => {
  // Data padrao: 7 dias a partir de hoje
  const getDefaultDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date.toISOString().split('T')[0];
  };

  const [boletos, setBoletos] = useState<BoletoConfig[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Inicializar boletos quando modal abre ou parcelas mudam
  useEffect(() => {
    if (isOpen && parcelas.length > 0) {
      const defaultDate = getDefaultDate();
      setBoletos(
        parcelas.map((p) => ({
          parcelaNumero: p.numero,
          dataVencimento: defaultDate,
          valor: p.valorAtualizado,
          valorMinimo: p.limiteDescontoMin,
          valorMaximo: p.valorAtualizado,
          erro: null,
        }))
      );
    }
  }, [isOpen, parcelas]);

  const valorTotalOriginal = parcelas.reduce((acc, p) => acc + p.valorAtualizado, 0);
  const valorTotalBoletos = boletos.reduce((acc, b) => acc + b.valor, 0);
  const descontoAplicado = valorTotalOriginal - valorTotalBoletos;
  const hasErrors = boletos.some((b) => b.erro !== null);

  const handleValorChange = (index: number, valorStr: string) => {
    const valor = parseFloat(valorStr.replace(/[^\d.,]/g, '').replace(',', '.')) || 0;

    setBoletos((prev) => {
      const updated = [...prev];
      const boleto = updated[index];

      if (valor < boleto.valorMinimo) {
        updated[index] = {
          ...boleto,
          valor,
          erro: `Valor mínimo permitido: ${formatCurrency(boleto.valorMinimo)}`,
        };
      } else if (valor > boleto.valorMaximo) {
        updated[index] = {
          ...boleto,
          valor: boleto.valorMaximo,
          erro: null,
        };
      } else {
        updated[index] = {
          ...boleto,
          valor,
          erro: null,
        };
      }

      return updated;
    });
  };

  const handleDataChange = (index: number, data: string) => {
    setBoletos((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], dataVencimento: data };
      return updated;
    });
  };

  const handleConfirm = async () => {
    if (hasErrors) return;

    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    onConfirm(boletos);
    setIsGenerating(false);
    onClose();
  };

  const getParcela = (numero: number) => parcelas.find((p) => p.numero === numero);

  // Styles
  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 'var(--spacing-md)',
    paddingBottom: 'var(--spacing-md)',
    borderBottom: '1px solid var(--color-border-subtle)',
  };

  const closeButtonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '28px',
    height: '28px',
    padding: 0,
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: 'var(--radius-md)',
    cursor: 'pointer',
    color: 'var(--color-text-secondary)',
    transition: 'all 150ms ease',
    flexShrink: 0,
  };

  const titleStyle: React.CSSProperties = {
    fontSize: 'var(--text-lg)',
    fontWeight: 600,
    color: 'var(--color-text-primary)',
    margin: 0,
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: 'var(--text-sm)',
    color: 'var(--color-text-muted)',
    marginTop: '0.25rem',
  };

  const contentStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '280px 1fr',
    gap: 'var(--spacing-lg)',
    minHeight: '300px',
  };

  const leftPanelStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-md)',
  };

  const rightPanelStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-sm)',
    maxHeight: '400px',
    overflowY: 'auto',
    paddingRight: 'var(--spacing-xs)',
  };

  const summaryCardStyle: React.CSSProperties = {
    backgroundColor: 'var(--color-surface-elevated)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-border)',
    padding: 'var(--spacing-md)',
  };

  const summaryTitleStyle: React.CSSProperties = {
    fontSize: 'var(--text-xs)',
    fontWeight: 600,
    color: 'var(--color-text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: 'var(--spacing-sm)',
  };

  const summaryRowStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.375rem 0',
    borderBottom: '1px solid var(--color-border-subtle)',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 'var(--text-sm)',
    color: 'var(--color-text-muted)',
  };

  const valueStyle: React.CSSProperties = {
    fontSize: 'var(--text-sm)',
    fontWeight: 500,
    fontFamily: 'var(--font-mono)',
    color: 'var(--color-text-primary)',
  };

  const boletoCardStyle: React.CSSProperties = {
    backgroundColor: 'var(--color-surface-elevated)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-border)',
    padding: 'var(--spacing-md)',
  };

  const boletoHeaderStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 'var(--spacing-sm)',
    paddingBottom: 'var(--spacing-sm)',
    borderBottom: '1px solid var(--color-border-subtle)',
  };

  const boletoTitleStyle: React.CSSProperties = {
    fontSize: 'var(--text-sm)',
    fontWeight: 600,
    color: 'var(--color-text-primary)',
  };

  const boletoInfoStyle: React.CSSProperties = {
    fontSize: 'var(--text-xs)',
    color: 'var(--color-text-muted)',
  };

  const fieldGroupStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 'var(--spacing-sm)',
  };

  const fieldStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  };

  const fieldLabelStyle: React.CSSProperties = {
    fontSize: '10px',
    fontWeight: 600,
    color: 'var(--color-text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.5rem 0.75rem',
    fontSize: 'var(--text-sm)',
    fontFamily: 'var(--font-mono)',
    backgroundColor: 'var(--color-surface)',
    color: 'var(--color-text-primary)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    outline: 'none',
  };

  const inputErrorStyle: React.CSSProperties = {
    ...inputStyle,
    borderColor: 'var(--color-error, #ef4444)',
  };

  const errorMessageStyle: React.CSSProperties = {
    fontSize: '10px',
    color: 'var(--color-error, #ef4444)',
    marginTop: '0.25rem',
  };

  const limiteInfoStyle: React.CSSProperties = {
    fontSize: '10px',
    color: 'var(--color-text-muted)',
    marginTop: '0.25rem',
  };

  const footerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 'var(--spacing-sm)',
    paddingTop: 'var(--spacing-md)',
    marginTop: 'var(--spacing-md)',
    borderTop: '1px solid var(--color-border-subtle)',
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" showCloseButton={false}>
      <div style={headerStyle}>
        <div>
          <h2 style={titleStyle}>Gerar Boletos</h2>
          <p style={subtitleStyle}>
            {parcelas.length} boleto{parcelas.length > 1 ? 's' : ''} individual{parcelas.length > 1 ? 'is' : ''}
          </p>
        </div>
        <button
          type="button"
          style={closeButtonStyle}
          onClick={onClose}
          aria-label="Fechar"
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-border-subtle)';
            e.currentTarget.style.color = 'var(--color-text-primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'var(--color-text-secondary)';
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div style={contentStyle}>
        {/* Painel Esquerdo - Resumo */}
        <div style={leftPanelStyle}>
          <div style={summaryCardStyle}>
            <div style={summaryTitleStyle}>Resumo da Negociação</div>
            <div style={summaryRowStyle}>
              <span style={labelStyle}>Boletos</span>
              <span style={valueStyle}>{boletos.length}</span>
            </div>
            <div style={summaryRowStyle}>
              <span style={labelStyle}>Valor Original</span>
              <span style={valueStyle}>{formatCurrency(valorTotalOriginal)}</span>
            </div>
            <div style={summaryRowStyle}>
              <span style={labelStyle}>Valor Negociado</span>
              <span style={{ ...valueStyle, color: 'var(--color-primary)' }}>
                {formatCurrency(valorTotalBoletos)}
              </span>
            </div>
            {descontoAplicado > 0 && (
              <div style={{ ...summaryRowStyle, borderBottom: 'none' }}>
                <span style={labelStyle}>Desconto Aplicado</span>
                <span style={{ ...valueStyle, color: 'var(--color-success, #10b981)' }}>
                  -{formatCurrency(descontoAplicado)}
                </span>
              </div>
            )}
          </div>

          <div style={{ ...summaryCardStyle, backgroundColor: 'rgba(59, 130, 246, 0.05)', borderColor: 'rgba(59, 130, 246, 0.2)' }}>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
              <strong style={{ color: 'var(--color-primary)' }}>Dica:</strong> Você pode negociar valores individuais para cada boleto. O valor mínimo permitido é o limite de desconto definido pela política.
            </div>
          </div>
        </div>

        {/* Painel Direito - Boletos */}
        <div style={rightPanelStyle}>
          {boletos.map((boleto, index) => {
            const parcela = getParcela(boleto.parcelaNumero);
            if (!parcela) return null;

            return (
              <div key={boleto.parcelaNumero} style={boletoCardStyle}>
                <div style={boletoHeaderStyle}>
                  <span style={boletoTitleStyle}>
                    Parcela {String(boleto.parcelaNumero).padStart(2, '0')}
                  </span>
                  <span style={boletoInfoStyle}>
                    Venc. original: {formatDate(parcela.dataVencimento)} • {parcela.diasAtraso} dias atraso
                  </span>
                </div>

                <div style={fieldGroupStyle}>
                  <div style={fieldStyle}>
                    <label style={fieldLabelStyle}>Vencimento do Boleto</label>
                    <input
                      type="date"
                      style={inputStyle}
                      value={boleto.dataVencimento}
                      onChange={(e) => handleDataChange(index, e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  <div style={fieldStyle}>
                    <label style={fieldLabelStyle}>Valor do Boleto (R$)</label>
                    <input
                      type="text"
                      style={boleto.erro ? inputErrorStyle : inputStyle}
                      value={boleto.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      onChange={(e) => handleValorChange(index, e.target.value)}
                      onFocus={(e) => {
                        e.target.style.borderColor = boleto.erro ? 'var(--color-error, #ef4444)' : 'var(--color-primary)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = boleto.erro ? 'var(--color-error, #ef4444)' : 'var(--color-border)';
                      }}
                    />
                    {boleto.erro ? (
                      <span style={errorMessageStyle}>{boleto.erro}</span>
                    ) : (
                      <span style={limiteInfoStyle}>
                        Mín: {formatCurrency(boleto.valorMinimo)} | Máx: {formatCurrency(boleto.valorMaximo)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div style={footerStyle}>
        <Button variant="secondary" size="sm" onClick={onClose} disabled={isGenerating}>
          Cancelar
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={handleConfirm}
          disabled={isGenerating || hasErrors}
        >
          {isGenerating ? (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
                <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                <path d="M12 2a10 10 0 0 1 10 10" />
              </svg>
              Gerando...
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="3" y1="9" x2="21" y2="9" />
                <line x1="9" y1="21" x2="9" y2="9" />
              </svg>
              Gerar {boletos.length} Boleto{boletos.length > 1 ? 's' : ''}
            </>
          )}
        </Button>
      </div>
    </Modal>
  );
};

export default BoletoConfirmModal;
