import { useState, useEffect } from 'react';
import { Modal, Button, Input } from '@cdc-fotus/design-system';
import type { Anotacao } from '../types/contract';
import { fetchAnotacoes, addAnotacao, marcarComoTratado } from '../services/contractsService';

interface AnotacoesModalProps {
  isOpen: boolean;
  onClose: () => void;
  contratoId: string;
  clienteNome: string;
  tratado: boolean;
  onUpdate: () => void;
}

const AnotacoesModal = ({
  isOpen,
  onClose,
  contratoId,
  clienteNome,
  tratado: initialTratado,
  onUpdate,
}: AnotacoesModalProps) => {
  const [anotacoes, setAnotacoes] = useState<Anotacao[]>([]);
  const [novaAnotacao, setNovaAnotacao] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [tratado, setTratado] = useState(initialTratado);

  useEffect(() => {
    if (isOpen) {
      loadAnotacoes();
      setTratado(initialTratado);
    }
  }, [isOpen, contratoId, initialTratado]);

  const loadAnotacoes = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAnotacoes(contratoId);
      setAnotacoes(data);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAnotacao = async () => {
    if (!novaAnotacao.trim()) return;

    setIsSaving(true);
    try {
      await addAnotacao(contratoId, novaAnotacao.trim(), 'Usuário Atual');
      setNovaAnotacao('');
      await loadAnotacoes();
      onUpdate();
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleTratado = async () => {
    setIsSaving(true);
    try {
      const novoStatus = !tratado;
      await marcarComoTratado(contratoId, novoStatus);
      setTratado(novoStatus);
      onUpdate();
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 'var(--spacing-md)',
    paddingBottom: 'var(--spacing-md)',
    borderBottom: '1px solid var(--color-border-subtle)',
    gap: 'var(--spacing-sm)',
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

  const statusBadgeStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.375rem',
    padding: '0.375rem 0.75rem',
    fontSize: 'var(--text-xs)',
    fontWeight: 500,
    borderRadius: 'var(--radius-full)',
    backgroundColor: tratado ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
    color: tratado ? 'var(--color-success, #10b981)' : 'var(--color-warning, #f59e0b)',
    border: `1px solid ${tratado ? 'var(--color-success, #10b981)' : 'var(--color-warning, #f59e0b)'}`,
    cursor: 'pointer',
    transition: 'all 150ms ease',
  };

  const inputAreaStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-sm)',
    marginBottom: 'var(--spacing-md)',
  };

  const textareaStyle: React.CSSProperties = {
    width: '100%',
    minHeight: '80px',
    padding: 'var(--spacing-sm)',
    fontSize: 'var(--text-sm)',
    fontFamily: 'var(--font-sans)',
    backgroundColor: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    resize: 'vertical',
    outline: 'none',
  };

  const anotacoesListStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-sm)',
    maxHeight: '300px',
    overflowY: 'auto',
  };

  const anotacaoCardStyle: React.CSSProperties = {
    padding: 'var(--spacing-sm)',
    backgroundColor: 'var(--color-surface-elevated)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-border-subtle)',
  };

  const anotacaoHeaderStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.25rem',
  };

  const autorStyle: React.CSSProperties = {
    fontSize: 'var(--text-xs)',
    fontWeight: 600,
    color: 'var(--color-text-primary)',
  };

  const dataStyle: React.CSSProperties = {
    fontSize: '10px',
    color: 'var(--color-text-muted)',
  };

  const textoStyle: React.CSSProperties = {
    fontSize: 'var(--text-sm)',
    color: 'var(--color-text-secondary)',
    lineHeight: 1.5,
  };

  const emptyStateStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: 'var(--spacing-lg)',
    color: 'var(--color-text-muted)',
    fontSize: 'var(--text-sm)',
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" showCloseButton={false}>
      <div style={headerStyle}>
        <div style={{ flex: 1 }}>
          <h2 style={titleStyle}>Anotacoes</h2>
          <p style={subtitleStyle}>
            {contratoId} - {clienteNome}
          </p>
        </div>
        <button
          type="button"
          style={statusBadgeStyle}
          onClick={handleToggleTratado}
          disabled={isSaving}
          title={tratado ? 'Clique para marcar como pendente' : 'Clique para marcar como tratado'}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {tratado ? (
              <polyline points="20 6 9 17 4 12" />
            ) : (
              <circle cx="12" cy="12" r="10" />
            )}
          </svg>
          {tratado ? 'Tratado' : 'Pendente'}
        </button>
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

      <div style={inputAreaStyle}>
        <textarea
          style={textareaStyle}
          placeholder="Adicione uma anotacao sobre este contrato..."
          value={novaAnotacao}
          onChange={(e) => setNovaAnotacao(e.target.value)}
          onFocus={(e) => {
            e.target.style.borderColor = 'var(--color-primary)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'var(--color-border)';
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="primary"
            size="sm"
            onClick={handleAddAnotacao}
            disabled={!novaAnotacao.trim() || isSaving}
          >
            {isSaving ? 'Salvando...' : 'Adicionar'}
          </Button>
        </div>
      </div>

      <div>
        <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 'var(--spacing-sm)', color: 'var(--color-text-primary)' }}>
          Historico ({anotacoes.length})
        </h3>
        {isLoading ? (
          <div style={emptyStateStyle}>Carregando...</div>
        ) : anotacoes.length === 0 ? (
          <div style={emptyStateStyle}>Nenhuma anotacao registrada</div>
        ) : (
          <div style={anotacoesListStyle}>
            {anotacoes.map((anotacao) => (
              <div key={anotacao.id} style={anotacaoCardStyle}>
                <div style={anotacaoHeaderStyle}>
                  <span style={autorStyle}>{anotacao.autor}</span>
                  <span style={dataStyle}>{formatDate(anotacao.createdAt)}</span>
                </div>
                <p style={textoStyle}>{anotacao.texto}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AnotacoesModal;
