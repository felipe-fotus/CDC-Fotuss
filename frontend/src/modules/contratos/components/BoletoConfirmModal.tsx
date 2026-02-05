import { useState, useEffect } from 'react';
import { Modal, Button } from '@cdc-fotus/design-system';
import type { Parcela } from '../../inadimplencia/types/contract';
import { formatCurrency, formatDate } from '../../inadimplencia/utils/formatters';
import { useToast } from '../../../components/Toast';

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
  onConfirm: (boletos: BoletoConfig[], boletoUnico: boolean) => void;
}

const BoletoConfirmModal = ({
  isOpen,
  onClose,
  parcelas,
  onConfirm,
}: BoletoConfirmModalProps) => {
  const { showToast } = useToast();

  const getDefaultDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date.toISOString().split('T')[0];
  };

  const [boletos, setBoletos] = useState<BoletoConfig[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [boletoUnico, setBoletoUnico] = useState(false);
  const [dataUnica, setDataUnica] = useState(getDefaultDate());
  const [valorUnico, setValorUnico] = useState(0);
  const [erroValorUnico, setErroValorUnico] = useState<string | null>(null);

  // Inicializar boletos quando modal abre ou parcelas mudam
  useEffect(() => {
    if (isOpen && parcelas.length > 0) {
      const defaultDate = getDefaultDate();
      const boletosIniciais = parcelas.map((p) => ({
        parcelaNumero: p.numero,
        dataVencimento: defaultDate,
        valor: p.valorAtualizado,
        valorMinimo: p.limiteDescontoMin,
        valorMaximo: p.valorAtualizado,
        erro: null,
      }));
      setBoletos(boletosIniciais);
      setDataUnica(defaultDate);
      setValorUnico(parcelas.reduce((acc, p) => acc + p.valorAtualizado, 0));
      setErroValorUnico(null);
      setBoletoUnico(false);
    }
  }, [isOpen, parcelas]);

  const valorTotalOriginal = parcelas.reduce((acc, p) => acc + p.valorAtualizado, 0);
  const valorMinimoTotal = parcelas.reduce((acc, p) => acc + p.limiteDescontoMin, 0);

  const valorTotalBoletos = boletoUnico
    ? valorUnico
    : boletos.reduce((acc, b) => acc + b.valor, 0);
  const descontoAplicado = valorTotalOriginal - valorTotalBoletos;
  const hasErrors = boletoUnico
    ? erroValorUnico !== null
    : boletos.some((b) => b.erro !== null);

  const handleValorChange = (index: number, valorStr: string) => {
    const valor = parseFloat(valorStr.replace(/[^\d.,]/g, '').replace(',', '.')) || 0;

    setBoletos((prev) => {
      const updated = [...prev];
      const boleto = updated[index];

      if (valor < boleto.valorMinimo) {
        updated[index] = {
          ...boleto,
          valor,
          erro: `Mínimo: ${formatCurrency(boleto.valorMinimo)}`,
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

  const handleValorUnicoChange = (valorStr: string) => {
    const valor = parseFloat(valorStr.replace(/[^\d.,]/g, '').replace(',', '.')) || 0;
    setValorUnico(valor);

    if (valor < valorMinimoTotal) {
      setErroValorUnico(`Mínimo: ${formatCurrency(valorMinimoTotal)}`);
    } else if (valor > valorTotalOriginal) {
      setValorUnico(valorTotalOriginal);
      setErroValorUnico(null);
    } else {
      setErroValorUnico(null);
    }
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

    if (boletoUnico) {
      const boletoConsolidado: BoletoConfig = {
        parcelaNumero: 0,
        dataVencimento: dataUnica,
        valor: valorUnico,
        valorMinimo: valorMinimoTotal,
        valorMaximo: valorTotalOriginal,
        erro: null,
      };
      onConfirm([boletoConsolidado], true);
      showToast('success', `Boleto único de ${formatCurrency(valorUnico)} gerado com sucesso!`);
    } else {
      onConfirm(boletos, false);
      showToast('success', `${boletos.length} boleto${boletos.length > 1 ? 's' : ''} gerado${boletos.length > 1 ? 's' : ''} com sucesso!`);
    }

    setIsGenerating(false);
    onClose();
  };

  const getParcela = (numero: number) => parcelas.find((p) => p.numero === numero);

  // Styles
  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 'var(--spacing-lg)',
    paddingBottom: 'var(--spacing-md)',
    borderBottom: '1px solid var(--color-border-subtle)',
  };

  const closeButtonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
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
    fontSize: 'var(--text-xl)',
    fontWeight: 600,
    color: 'var(--color-text-primary)',
    margin: 0,
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: 'var(--text-sm)',
    color: 'var(--color-text-muted)',
    marginTop: '0.5rem',
  };

  const contentStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '320px 1fr',
    gap: 'var(--spacing-xl)',
    minHeight: '380px',
  };

  const leftPanelStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-md)',
  };

  const rightPanelStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-md)',
    maxHeight: '450px',
    overflowY: 'auto',
    paddingRight: 'var(--spacing-sm)',
  };

  const summaryCardStyle: React.CSSProperties = {
    backgroundColor: 'var(--color-surface-elevated)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--color-border)',
    padding: 'var(--spacing-lg)',
  };

  const summaryTitleStyle: React.CSSProperties = {
    fontSize: 'var(--text-xs)',
    fontWeight: 600,
    color: 'var(--color-text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: 'var(--spacing-md)',
  };

  const summaryRowStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.5rem 0',
    borderBottom: '1px solid var(--color-border-subtle)',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 'var(--text-sm)',
    color: 'var(--color-text-muted)',
  };

  const valueStyle: React.CSSProperties = {
    fontSize: 'var(--text-sm)',
    fontWeight: 600,
    fontFamily: 'var(--font-mono)',
    color: 'var(--color-text-primary)',
  };

  const toggleCardStyle: React.CSSProperties = {
    backgroundColor: 'var(--color-surface-elevated)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--color-border)',
    padding: 'var(--spacing-md)',
  };

  const toggleRowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-sm)',
    cursor: 'pointer',
  };

  const toggleSwitchStyle: React.CSSProperties = {
    position: 'relative',
    width: '44px',
    height: '24px',
    backgroundColor: boletoUnico ? 'var(--color-primary)' : 'var(--color-border)',
    borderRadius: '12px',
    transition: 'background-color 200ms',
    cursor: 'pointer',
    flexShrink: 0,
  };

  const toggleKnobStyle: React.CSSProperties = {
    position: 'absolute',
    top: '2px',
    left: boletoUnico ? '22px' : '2px',
    width: '20px',
    height: '20px',
    backgroundColor: 'white',
    borderRadius: '50%',
    transition: 'left 200ms',
    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
  };

  const boletoCardStyle: React.CSSProperties = {
    backgroundColor: 'var(--color-surface-elevated)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--color-border)',
    padding: 'var(--spacing-lg)',
  };

  const boletoHeaderStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 'var(--spacing-md)',
    paddingBottom: 'var(--spacing-sm)',
    borderBottom: '1px solid var(--color-border-subtle)',
  };

  const boletoTitleStyle: React.CSSProperties = {
    fontSize: 'var(--text-base)',
    fontWeight: 600,
    color: 'var(--color-text-primary)',
  };

  const boletoInfoStyle: React.CSSProperties = {
    fontSize: 'var(--text-xs)',
    color: 'var(--color-text-muted)',
  };

  const valorRangeStyle: React.CSSProperties = {
    display: 'flex',
    gap: 'var(--spacing-md)',
    marginBottom: 'var(--spacing-md)',
    padding: 'var(--spacing-md)',
    backgroundColor: 'rgba(59, 130, 246, 0.08)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid rgba(59, 130, 246, 0.2)',
  };

  const valorRangeItemStyle: React.CSSProperties = {
    flex: 1,
    textAlign: 'center',
  };

  const valorRangeLabelStyle: React.CSSProperties = {
    fontSize: '10px',
    fontWeight: 600,
    color: 'var(--color-text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '4px',
  };

  const valorRangeValueStyle: React.CSSProperties = {
    fontSize: 'var(--text-lg)',
    fontWeight: 700,
    fontFamily: 'var(--font-mono)',
    color: 'var(--color-primary)',
  };

  const fieldGroupStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 'var(--spacing-md)',
  };

  const fieldStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  };

  const fieldLabelStyle: React.CSSProperties = {
    fontSize: 'var(--text-xs)',
    fontWeight: 600,
    color: 'var(--color-text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.625rem 0.875rem',
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
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
  };

  const errorMessageStyle: React.CSSProperties = {
    fontSize: 'var(--text-xs)',
    color: 'var(--color-error, #ef4444)',
    fontWeight: 500,
  };

  const footerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 'var(--spacing-sm)',
    paddingTop: 'var(--spacing-lg)',
    marginTop: 'var(--spacing-lg)',
    borderTop: '1px solid var(--color-border-subtle)',
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" showCloseButton={false}>
      <div style={headerStyle}>
        <div>
          <h2 style={titleStyle}>Gerar Boletos</h2>
          <p style={subtitleStyle}>
            Configure os valores e datas para {parcelas.length} parcela{parcelas.length > 1 ? 's' : ''} selecionada{parcelas.length > 1 ? 's' : ''}
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
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div style={contentStyle}>
        {/* Painel Esquerdo - Resumo e Opções */}
        <div style={leftPanelStyle}>
          {/* Toggle Boleto Único */}
          {parcelas.length > 1 && (
            <div style={toggleCardStyle}>
              <label style={toggleRowStyle} onClick={() => setBoletoUnico(!boletoUnico)}>
                <div style={toggleSwitchStyle}>
                  <div style={toggleKnobStyle} />
                </div>
                <div>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                    Boleto Único
                  </div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                    Consolidar todas as parcelas em um único boleto
                  </div>
                </div>
              </label>
            </div>
          )}

          {/* Resumo */}
          <div style={summaryCardStyle}>
            <div style={summaryTitleStyle}>Resumo da Negociação</div>
            <div style={summaryRowStyle}>
              <span style={labelStyle}>Quantidade</span>
              <span style={valueStyle}>{boletoUnico ? '1 boleto' : `${boletos.length} boletos`}</span>
            </div>
            <div style={summaryRowStyle}>
              <span style={labelStyle}>Valor Original</span>
              <span style={valueStyle}>{formatCurrency(valorTotalOriginal)}</span>
            </div>
            <div style={summaryRowStyle}>
              <span style={labelStyle}>Valor Negociado</span>
              <span style={{ ...valueStyle, color: 'var(--color-primary)', fontSize: 'var(--text-base)' }}>
                {formatCurrency(valorTotalBoletos)}
              </span>
            </div>
            {descontoAplicado > 0 && (
              <div style={{ ...summaryRowStyle, borderBottom: 'none' }}>
                <span style={labelStyle}>Desconto</span>
                <span style={{ ...valueStyle, color: 'var(--color-success, #10b981)' }}>
                  -{formatCurrency(descontoAplicado)} ({((descontoAplicado / valorTotalOriginal) * 100).toFixed(1)}%)
                </span>
              </div>
            )}
          </div>

          {/* Dica */}
          <div style={{ padding: 'var(--spacing-md)', backgroundColor: 'rgba(59, 130, 246, 0.05)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(59, 130, 246, 0.15)' }}>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
              <strong style={{ color: 'var(--color-primary)' }}>💡 Dica de negociação:</strong>
              <br />
              O valor mínimo é o limite de desconto permitido pela política. Negocie valores dentro da faixa para fechar acordos.
            </div>
          </div>
        </div>

        {/* Painel Direito - Boletos */}
        <div style={rightPanelStyle}>
          {boletoUnico ? (
            /* Boleto Único */
            <div style={boletoCardStyle}>
              <div style={boletoHeaderStyle}>
                <span style={boletoTitleStyle}>Boleto Consolidado</span>
                <span style={boletoInfoStyle}>{parcelas.length} parcelas</span>
              </div>

              {/* Faixa de Valores com Destaque */}
              <div style={valorRangeStyle}>
                <div style={valorRangeItemStyle}>
                  <div style={valorRangeLabelStyle}>Valor Mínimo</div>
                  <div style={{ ...valorRangeValueStyle, color: 'var(--color-success, #10b981)' }}>
                    {formatCurrency(valorMinimoTotal)}
                  </div>
                </div>
                <div style={{ width: '1px', backgroundColor: 'rgba(59, 130, 246, 0.3)' }} />
                <div style={valorRangeItemStyle}>
                  <div style={valorRangeLabelStyle}>Valor Máximo</div>
                  <div style={valorRangeValueStyle}>
                    {formatCurrency(valorTotalOriginal)}
                  </div>
                </div>
              </div>

              <div style={fieldGroupStyle}>
                <div style={fieldStyle}>
                  <label style={fieldLabelStyle}>Vencimento do Boleto</label>
                  <input
                    type="date"
                    style={inputStyle}
                    value={dataUnica}
                    onChange={(e) => setDataUnica(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div style={fieldStyle}>
                  <label style={fieldLabelStyle}>Valor do Boleto (R$)</label>
                  <input
                    type="text"
                    style={erroValorUnico ? inputErrorStyle : inputStyle}
                    value={valorUnico.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    onChange={(e) => handleValorUnicoChange(e.target.value)}
                    onFocus={(e) => {
                      e.target.style.borderColor = erroValorUnico ? 'var(--color-error, #ef4444)' : 'var(--color-primary)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = erroValorUnico ? 'var(--color-error, #ef4444)' : 'var(--color-border)';
                    }}
                  />
                  {erroValorUnico && <span style={errorMessageStyle}>{erroValorUnico}</span>}
                </div>
              </div>
            </div>
          ) : (
            /* Boletos Individuais */
            boletos.map((boleto, index) => {
              const parcela = getParcela(boleto.parcelaNumero);
              if (!parcela) return null;

              return (
                <div key={boleto.parcelaNumero} style={boletoCardStyle}>
                  <div style={boletoHeaderStyle}>
                    <span style={boletoTitleStyle}>
                      Parcela {String(boleto.parcelaNumero).padStart(2, '0')}
                    </span>
                    <span style={boletoInfoStyle}>
                      Venc. original: {formatDate(parcela.dataVencimento)} • {parcela.diasAtraso}d atraso
                    </span>
                  </div>

                  {/* Faixa de Valores com Destaque */}
                  <div style={valorRangeStyle}>
                    <div style={valorRangeItemStyle}>
                      <div style={valorRangeLabelStyle}>Valor Mínimo</div>
                      <div style={{ ...valorRangeValueStyle, color: 'var(--color-success, #10b981)' }}>
                        {formatCurrency(boleto.valorMinimo)}
                      </div>
                    </div>
                    <div style={{ width: '1px', backgroundColor: 'rgba(59, 130, 246, 0.3)' }} />
                    <div style={valorRangeItemStyle}>
                      <div style={valorRangeLabelStyle}>Valor Máximo</div>
                      <div style={valorRangeValueStyle}>
                        {formatCurrency(boleto.valorMaximo)}
                      </div>
                    </div>
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
                      {boleto.erro && <span style={errorMessageStyle}>{boleto.erro}</span>}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={footerStyle}>
        <Button variant="secondary" size="md" onClick={onClose} disabled={isGenerating}>
          Cancelar
        </Button>
        <Button
          variant="primary"
          size="md"
          onClick={handleConfirm}
          disabled={isGenerating || hasErrors}
        >
          {isGenerating ? (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
                <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                <path d="M12 2a10 10 0 0 1 10 10" />
              </svg>
              Gerando...
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="3" y1="9" x2="21" y2="9" />
                <line x1="9" y1="21" x2="9" y2="9" />
              </svg>
              Gerar {boletoUnico ? '1 Boleto' : `${boletos.length} Boleto${boletos.length > 1 ? 's' : ''}`}
            </>
          )}
        </Button>
      </div>
    </Modal>
  );
};

export default BoletoConfirmModal;
