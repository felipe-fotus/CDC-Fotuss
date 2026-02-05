import { useState, useEffect } from 'react';
import { Modal, Button, Switch, DateInput, CurrencyInput, useToast } from '@cdc-fotus/design-system';
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
      const total = parcelas.reduce((acc, p) => acc + p.valorAtualizado, 0);
      setValorUnico(total);
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

  // Handler para valor individual
  const handleValorChange = (index: number, valor: number) => {
    setBoletos((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        valor,
        erro: null,
      };
      return updated;
    });
  };

  // Validação do valor individual
  const handleValorValidate = (index: number, valor: number): string | null => {
    const boleto = boletos[index];
    if (!boleto) return null;

    if (valor < boleto.valorMinimo) {
      setBoletos((prev) => {
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          erro: `Mínimo: ${formatCurrency(boleto.valorMinimo)}`,
        };
        return updated;
      });
      return `Mínimo: ${formatCurrency(boleto.valorMinimo)}`;
    }
    return null;
  };

  // Validação do valor único
  const handleValorUnicoValidate = (valor: number): string | null => {
    if (valor < valorMinimoTotal) {
      setErroValorUnico(`Mínimo: ${formatCurrency(valorMinimoTotal)}`);
      return `Mínimo: ${formatCurrency(valorMinimoTotal)}`;
    }
    setErroValorUnico(null);
    return null;
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

  // ============ STYLES ============

  const modalContentStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    height: '70vh',
    maxHeight: '700px',
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingBottom: 'var(--spacing-md)',
    borderBottom: '1px solid var(--color-border)',
    flexShrink: 0,
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
    color: 'var(--color-text-primary)',
    transition: 'all 150ms ease',
    flexShrink: 0,
  };

  const titleStyle: React.CSSProperties = {
    fontSize: 'var(--text-xl)',
    fontWeight: 700,
    color: 'var(--color-text-primary)',
    margin: 0,
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: 'var(--text-sm)',
    color: 'var(--color-text-secondary)',
    marginTop: '0.5rem',
  };

  const scrollableContentStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '340px 1fr',
    gap: 'var(--spacing-xl)',
    flex: 1,
    overflow: 'hidden',
    marginTop: 'var(--spacing-lg)',
  };

  const leftPanelStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-md)',
    overflowY: 'auto',
    paddingRight: 'var(--spacing-sm)',
  };

  const rightPanelStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-md)',
    overflowY: 'auto',
    paddingRight: 'var(--spacing-sm)',
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: 'var(--color-surface)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--color-border)',
    padding: 'var(--spacing-lg)',
  };

  const cardTitleStyle: React.CSSProperties = {
    fontSize: 'var(--text-xs)',
    fontWeight: 700,
    color: 'var(--color-text-primary)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: 'var(--spacing-md)',
  };

  const summaryRowStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.625rem 0',
    borderBottom: '1px solid var(--color-border)',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 'var(--text-sm)',
    fontWeight: 500,
    color: 'var(--color-text-secondary)',
  };

  const valueStyle: React.CSSProperties = {
    fontSize: 'var(--text-sm)',
    fontWeight: 700,
    fontFamily: 'var(--font-mono)',
    color: 'var(--color-text-primary)',
  };

  // Toggle Card
  const toggleCardStyle: React.CSSProperties = {
    ...cardStyle,
    backgroundColor: boletoUnico ? 'rgba(59, 130, 246, 0.15)' : 'var(--color-surface)',
    borderColor: boletoUnico ? 'rgba(59, 130, 246, 0.5)' : 'var(--color-border)',
  };

  const boletoCardStyle: React.CSSProperties = {
    ...cardStyle,
    padding: 'var(--spacing-lg)',
  };

  const boletoHeaderStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 'var(--spacing-md)',
    paddingBottom: 'var(--spacing-sm)',
    borderBottom: '1px solid var(--color-border)',
  };

  const boletoTitleStyle: React.CSSProperties = {
    fontSize: 'var(--text-base)',
    fontWeight: 700,
    color: 'var(--color-text-primary)',
  };

  const boletoInfoStyle: React.CSSProperties = {
    fontSize: 'var(--text-xs)',
    fontWeight: 500,
    color: 'var(--color-text-secondary)',
  };

  // Faixa de valores
  const valorRangeStyle: React.CSSProperties = {
    display: 'flex',
    gap: 'var(--spacing-md)',
    marginBottom: 'var(--spacing-lg)',
    padding: 'var(--spacing-md)',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 'var(--radius-md)',
    border: '2px solid rgba(59, 130, 246, 0.3)',
  };

  const valorRangeItemStyle: React.CSSProperties = {
    flex: 1,
    textAlign: 'center',
  };

  const valorRangeLabelStyle: React.CSSProperties = {
    fontSize: 'var(--text-xs)',
    fontWeight: 700,
    color: 'var(--color-text-primary)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '6px',
  };

  const valorMinStyle: React.CSSProperties = {
    fontSize: 'var(--text-lg)',
    fontWeight: 800,
    fontFamily: 'var(--font-mono)',
    color: '#10b981',
  };

  const valorMaxStyle: React.CSSProperties = {
    fontSize: 'var(--text-lg)',
    fontWeight: 800,
    fontFamily: 'var(--font-mono)',
    color: '#3b82f6',
  };

  const fieldGroupStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 'var(--spacing-md)',
  };

  const tipCardStyle: React.CSSProperties = {
    padding: 'var(--spacing-md)',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid rgba(59, 130, 246, 0.3)',
  };

  const tipTextStyle: React.CSSProperties = {
    fontSize: 'var(--text-xs)',
    fontWeight: 500,
    color: 'var(--color-text-primary)',
    lineHeight: 1.6,
  };

  // Footer fixo
  const footerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 'var(--spacing-sm)',
    paddingTop: 'var(--spacing-lg)',
    marginTop: 'var(--spacing-lg)',
    borderTop: '1px solid var(--color-border)',
    flexShrink: 0,
    backgroundColor: 'var(--color-surface)',
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" showCloseButton={false}>
      <div style={modalContentStyle}>
        {/* Header */}
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
              e.currentTarget.style.backgroundColor = 'var(--color-border)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Conteúdo scrollável */}
        <div style={scrollableContentStyle}>
          {/* Painel Esquerdo - Resumo e Opções */}
          <div style={leftPanelStyle}>
            {/* Toggle Boleto Único */}
            {parcelas.length > 1 && (
              <div style={toggleCardStyle}>
                <Switch
                  checked={boletoUnico}
                  onChange={setBoletoUnico}
                  label="Boleto Único"
                  description="Consolidar em um único boleto"
                  size="md"
                />
              </div>
            )}

            {/* Resumo */}
            <div style={cardStyle}>
              <div style={cardTitleStyle}>Resumo da Negociação</div>
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
                <span style={{ ...valueStyle, color: '#3b82f6', fontSize: 'var(--text-base)' }}>
                  {formatCurrency(valorTotalBoletos)}
                </span>
              </div>
              {descontoAplicado > 0 && (
                <div style={{ ...summaryRowStyle, borderBottom: 'none' }}>
                  <span style={labelStyle}>Desconto</span>
                  <span style={{ ...valueStyle, color: '#10b981' }}>
                    -{formatCurrency(descontoAplicado)} ({((descontoAplicado / valorTotalOriginal) * 100).toFixed(1)}%)
                  </span>
                </div>
              )}
            </div>

            {/* Dica */}
            <div style={tipCardStyle}>
              <div style={tipTextStyle}>
                <strong style={{ color: '#3b82f6' }}>Dica:</strong>
                <br />
                Digite apenas números. O valor é formatado automaticamente. Ex: 150000 = R$ 150.000,00
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

                {/* Faixa de Valores */}
                <div style={valorRangeStyle}>
                  <div style={valorRangeItemStyle}>
                    <div style={valorRangeLabelStyle}>Valor Mínimo</div>
                    <div style={valorMinStyle}>{formatCurrency(valorMinimoTotal)}</div>
                  </div>
                  <div style={{ width: '2px', backgroundColor: 'rgba(59, 130, 246, 0.3)' }} />
                  <div style={valorRangeItemStyle}>
                    <div style={valorRangeLabelStyle}>Valor Máximo</div>
                    <div style={valorMaxStyle}>{formatCurrency(valorTotalOriginal)}</div>
                  </div>
                </div>

                <div style={fieldGroupStyle}>
                  <DateInput
                    label="Vencimento"
                    value={dataUnica}
                    onChange={(e) => setDataUnica(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                  <CurrencyInput
                    label="Valor"
                    value={valorUnico}
                    onChange={setValorUnico}
                    onValidate={handleValorUnicoValidate}
                    minValue={valorMinimoTotal}
                    maxValue={valorTotalOriginal}
                    error={erroValorUnico || undefined}
                  />
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
                        Venc: {formatDate(parcela.dataVencimento)} | {parcela.diasAtraso}d atraso
                      </span>
                    </div>

                    {/* Faixa de Valores */}
                    <div style={valorRangeStyle}>
                      <div style={valorRangeItemStyle}>
                        <div style={valorRangeLabelStyle}>Valor Mínimo</div>
                        <div style={valorMinStyle}>{formatCurrency(boleto.valorMinimo)}</div>
                      </div>
                      <div style={{ width: '2px', backgroundColor: 'rgba(59, 130, 246, 0.3)' }} />
                      <div style={valorRangeItemStyle}>
                        <div style={valorRangeLabelStyle}>Valor Máximo</div>
                        <div style={valorMaxStyle}>{formatCurrency(boleto.valorMaximo)}</div>
                      </div>
                    </div>

                    <div style={fieldGroupStyle}>
                      <DateInput
                        label="Vencimento"
                        value={boleto.dataVencimento}
                        onChange={(e) => handleDataChange(index, e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                      />
                      <CurrencyInput
                        label="Valor"
                        value={boleto.valor}
                        onChange={(valor) => handleValorChange(index, valor)}
                        onValidate={(valor) => handleValorValidate(index, valor)}
                        minValue={boleto.valorMinimo}
                        maxValue={boleto.valorMaximo}
                        error={boleto.erro || undefined}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Footer Fixo */}
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
      </div>
    </Modal>
  );
};

export default BoletoConfirmModal;
