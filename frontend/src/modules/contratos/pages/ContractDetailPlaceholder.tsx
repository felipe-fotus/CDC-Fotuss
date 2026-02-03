import { useParams, useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';

const ContractDetailPlaceholder = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: 'var(--spacing-xl)',
    backgroundColor: 'var(--color-bg)',
    textAlign: 'center',
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    padding: 'var(--spacing-xl)',
    maxWidth: '500px',
    width: '100%',
  };

  const iconStyle: React.CSSProperties = {
    width: '64px',
    height: '64px',
    margin: '0 auto var(--spacing-lg)',
    color: 'var(--color-text-muted)',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: 'var(--text-xl)',
    fontWeight: 600,
    color: 'var(--color-text-primary)',
    marginBottom: 'var(--spacing-sm)',
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: 'var(--text-sm)',
    color: 'var(--color-text-secondary)',
    marginBottom: 'var(--spacing-lg)',
  };

  const contractIdStyle: React.CSSProperties = {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-sm)',
    color: 'var(--color-text-muted)',
    backgroundColor: 'var(--color-border-subtle)',
    padding: '0.25rem 0.5rem',
    borderRadius: 'var(--radius-sm)',
    marginBottom: 'var(--spacing-lg)',
    display: 'inline-block',
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <svg
          style={iconStyle}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <path d="M12 18v-6" />
          <path d="M9 15l3 3 3-3" />
        </svg>

        <h1 style={titleStyle}>Detalhe do contrato</h1>
        <p style={subtitleStyle}>Em construcao</p>

        {id && <div style={contractIdStyle}>{id}</div>}

        <div>
          <Button variant="secondary" onClick={() => navigate('/inadimplencia')}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Voltar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContractDetailPlaceholder;
