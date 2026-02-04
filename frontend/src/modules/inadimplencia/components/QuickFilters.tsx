interface QuickFiltersProps {
  statusTratamento: 'todos' | 'tratados' | 'pendentes';
  onStatusChange: (status: 'todos' | 'tratados' | 'pendentes') => void;
  totalCount: number;
  tratadosCount: number;
  pendentesCount: number;
}

const QuickFilters = ({
  statusTratamento,
  onStatusChange,
  totalCount,
  tratadosCount,
  pendentesCount,
}: QuickFiltersProps) => {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    gap: 'var(--spacing-sm)',
    alignItems: 'center',
  };

  const tagStyle = (isActive: boolean, variant?: 'success' | 'warning'): React.CSSProperties => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.375rem',
    padding: '0.375rem 0.75rem',
    fontSize: 'var(--text-xs)',
    fontWeight: 500,
    borderRadius: 'var(--radius-full)',
    border: `1px solid ${isActive
      ? variant === 'success' ? 'var(--color-success, #10b981)'
      : variant === 'warning' ? 'var(--color-warning, #f59e0b)'
      : 'var(--color-primary)'
      : 'var(--color-border)'}`,
    backgroundColor: isActive
      ? variant === 'success' ? 'rgba(16, 185, 129, 0.1)'
      : variant === 'warning' ? 'rgba(245, 158, 11, 0.1)'
      : 'var(--color-primary-subtle)'
      : 'var(--color-surface)',
    color: isActive
      ? variant === 'success' ? 'var(--color-success, #10b981)'
      : variant === 'warning' ? 'var(--color-warning, #f59e0b)'
      : 'var(--color-primary)'
      : 'var(--color-text-secondary)',
    cursor: 'pointer',
    transition: 'all 150ms ease',
  });

  const countStyle: React.CSSProperties = {
    backgroundColor: 'var(--color-border-subtle)',
    padding: '0.125rem 0.375rem',
    borderRadius: 'var(--radius-sm)',
    fontSize: '10px',
    fontWeight: 600,
  };

  return (
    <div style={containerStyle}>
      <button
        type="button"
        style={tagStyle(statusTratamento === 'todos')}
        onClick={() => onStatusChange('todos')}
      >
        Todos
        <span style={countStyle}>{totalCount}</span>
      </button>
      <button
        type="button"
        style={tagStyle(statusTratamento === 'pendentes', 'warning')}
        onClick={() => onStatusChange('pendentes')}
      >
        Pendentes
        <span style={countStyle}>{pendentesCount}</span>
      </button>
      <button
        type="button"
        style={tagStyle(statusTratamento === 'tratados', 'success')}
        onClick={() => onStatusChange('tratados')}
      >
        Tratados
        <span style={countStyle}>{tratadosCount}</span>
      </button>
    </div>
  );
};

export default QuickFilters;
