interface SortControlProps {
  value: string;
  onChange: (value: string) => void;
}

const sortOptions = [
  { value: 'diasAtraso-desc', label: 'Maior D+' },
  { value: 'diasAtraso-asc', label: 'Menor D+' },
  { value: 'valorAtraso-desc', label: 'Maior valor' },
  { value: 'valorAtraso-asc', label: 'Menor valor' },
  { value: 'dataVencimento-asc', label: 'Mais antigo' },
  { value: 'dataVencimento-desc', label: 'Mais recente' },
];

const SortControl = ({ value, onChange }: SortControlProps) => {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-xs)',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 'var(--text-xs)',
    color: 'var(--color-text-muted)',
  };

  const selectStyle: React.CSSProperties = {
    padding: '0.375rem 1.75rem 0.375rem 0.625rem',
    fontSize: 'var(--text-xs)',
    fontFamily: 'var(--font-sans)',
    backgroundColor: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    color: 'var(--color-text-primary)',
    cursor: 'pointer',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
    backgroundPosition: 'right 0.375rem center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '1.25em 1.25em',
    outline: 'none',
    transition: 'border-color 150ms ease',
  };

  return (
    <div style={containerStyle}>
      <span style={labelStyle}>Ordenar:</span>
      <select
        style={selectStyle}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={(e) => {
          e.target.style.borderColor = 'var(--color-primary)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = 'var(--color-border)';
        }}
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SortControl;
