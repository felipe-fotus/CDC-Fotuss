import { useState } from 'react';
import { Modal, Button } from '@cdc-fotus/design-system';
import type { Parcela } from '../../inadimplencia/types/contract';
import { formatCurrency, formatDate } from '../../inadimplencia/utils/formatters';

interface BoletoConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  parcelas: Parcela[];
  onConfirm: (dataVencimento: string) => void;
}

const BoletoConfirmModal = ({
  isOpen,
  onClose,
  parcelas,
  onConfirm,
}: BoletoConfirmModalProps) => {
  // Data padrao: 7 dias a partir de hoje
  const defaultDate = new Date();
  defaultDate.setDate(defaultDate.getDate() + 7);
  const [dataVencimento, setDataVencimento] = useState(defaultDate.toISOString().split('T')[0]);
  const [isGenerating, setIsGenerating] = useState(false);

  const valorTotal = parcelas.reduce((acc, p) => acc + p.valorAtualizado, 0);
  const valorComDesconto = parcelas.reduce((acc, p) => acc + p.limiteDescontoMin, 0);
  const descontoTotal = valorTotal - valorComDesconto;

  const handleConfirm = async () => {
    setIsGenerating(true);
    // Simular geracao
    await new Promise(resolve => setTimeout(resolve, 1500));
    onConfirm(dataVencimento);
    setIsGenerating(false);
    onClose();
  };

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

  const summaryCardStyle: React.CSSProperties = {
    backgroundColor: 'var(--color-surface-elevated)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-border)',
    padding: 'var(--spacing-md)',
    marginBottom: 'var(--spacing-md)',
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
  };

  const tableContainerStyle: React.CSSProperties = {
    maxHeight: '200px',
    overflowY: 'auto',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-border)',
    marginBottom: 'var(--spacing-md)',
  };

  const inputGroupStyle: React.CSSProperties = {
    marginBottom: 'var(--spacing-md)',
  };

  const inputLabelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: 'var(--text-xs)',
    fontWeight: 600,
    color: 'var(--color-text-muted)',
    marginBottom: '0.375rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.5rem 0.75rem',
    fontSize: 'var(--text-sm)',
    fontFamily: 'var(--font-sans)',
    backgroundColor: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    outline: 'none',
  };

  const footerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 'var(--spacing-sm)',
    paddingTop: 'var(--spacing-md)',
    borderTop: '1px solid var(--color-border-subtle)',
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" showCloseButton={false}>
      <div style={headerStyle}>
        <div>
          <h2 style={titleStyle}>Confirmar Geracao de Boleto</h2>
          <p style={subtitleStyle}>
            {parcelas.length} parcela{parcelas.length > 1 ? 's' : ''} selecionada{parcelas.length > 1 ? 's' : ''}
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

      {/* Resumo */}
      <div style={summaryCardStyle}>
        <div style={summaryRowStyle}>
          <span style={labelStyle}>Quantidade de Boletos</span>
          <span style={valueStyle}>{parcelas.length}</span>
        </div>
        <div style={summaryRowStyle}>
          <span style={labelStyle}>Valor Total</span>
          <span style={valueStyle}>{formatCurrency(valorTotal)}</span>
        </div>
        {descontoTotal > 0 && (
          <>
            <div style={summaryRowStyle}>
              <span style={labelStyle}>Desconto Maximo Disponivel</span>
              <span style={{ ...valueStyle, color: 'var(--color-success, #10b981)' }}>
                -{formatCurrency(descontoTotal)}
              </span>
            </div>
            <div style={{ ...summaryRowStyle, borderBottom: 'none' }}>
              <span style={labelStyle}>Valor Minimo (com desconto)</span>
              <span style={{ ...valueStyle, color: 'var(--color-success, #10b981)' }}>
                {formatCurrency(valorComDesconto)}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Tabela de parcelas */}
      <div style={tableContainerStyle}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--color-border-subtle)' }}>
              <th style={{ padding: '0.5rem', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600 }}>#</th>
              <th style={{ padding: '0.5rem', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 600 }}>Vencimento Original</th>
              <th style={{ padding: '0.5rem', textAlign: 'right', fontSize: 'var(--text-xs)', fontWeight: 600 }}>Valor</th>
              <th style={{ padding: '0.5rem', textAlign: 'center', fontSize: 'var(--text-xs)', fontWeight: 600 }}>Dias Atraso</th>
            </tr>
          </thead>
          <tbody>
            {parcelas.map((parcela) => (
              <tr key={parcela.numero}>
                <td style={{ padding: '0.5rem', fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', borderBottom: '1px solid var(--color-border-subtle)' }}>
                  {String(parcela.numero).padStart(2, '0')}
                </td>
                <td style={{ padding: '0.5rem', fontSize: 'var(--text-xs)', borderBottom: '1px solid var(--color-border-subtle)' }}>
                  {formatDate(parcela.dataVencimento)}
                </td>
                <td style={{ padding: '0.5rem', fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', textAlign: 'right', borderBottom: '1px solid var(--color-border-subtle)' }}>
                  {formatCurrency(parcela.valorAtualizado)}
                </td>
                <td style={{ padding: '0.5rem', fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', textAlign: 'center', borderBottom: '1px solid var(--color-border-subtle)', color: parcela.diasAtraso > 0 ? 'var(--color-criticality-critical-text)' : 'var(--color-text-muted)' }}>
                  {parcela.diasAtraso > 0 ? parcela.diasAtraso : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Data de vencimento do boleto */}
      <div style={inputGroupStyle}>
        <label style={inputLabelStyle}>Data de Vencimento do Boleto</label>
        <input
          type="date"
          style={inputStyle}
          value={dataVencimento}
          onChange={(e) => setDataVencimento(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
        />
      </div>

      {/* Footer com acoes */}
      <div style={footerStyle}>
        <Button variant="secondary" size="sm" onClick={onClose} disabled={isGenerating}>
          Cancelar
        </Button>
        <Button variant="primary" size="sm" onClick={handleConfirm} disabled={isGenerating}>
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
              Gerar Boleto
            </>
          )}
        </Button>
      </div>
    </Modal>
  );
};

export default BoletoConfirmModal;
