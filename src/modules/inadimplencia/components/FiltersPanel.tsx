import { useState, useEffect } from 'react';
import Input from '../../../components/ui/Input';
import type { ContractFilters } from '../types/contract';
import { FAIXAS_ATRASO } from '../services/contractsService';

interface FiltersPanelProps {
  filters: ContractFilters;
  onUpdateFilter: <K extends keyof ContractFilters>(key: K, value: ContractFilters[K]) => void;
  onToggleFaixa: (faixa: number) => void;
  onClear: () => void;
  hasActiveFilters: boolean;
  uniqueOrigens: string[];
  uniqueStatus: string[];
  isOpen: boolean;
  onToggleOpen: () => void;
}

// Chip component for quick selection
const Chip = ({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) => {
  const style: React.CSSProperties = {
    padding: '0.25rem 0.625rem',
    fontSize: 'var(--text-xs)',
    fontWeight: 500,
    borderRadius: 'var(--radius-md)',
    border: `1px solid ${isActive ? 'var(--color-primary)' : 'var(--color-border)'}`,
    backgroundColor: isActive ? 'var(--color-primary-subtle)' : 'transparent',
    color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)',
    cursor: 'pointer',
    transition: 'all 150ms ease',
    whiteSpace: 'nowrap',
  };

  return (
    <button
      type="button"
      style={style}
      onClick={onClick}
      aria-pressed={isActive}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.borderColor = 'var(--color-text-muted)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.borderColor = 'var(--color-border)';
        }
      }}
    >
      {label}
    </button>
  );
};

const FiltersPanel = ({
  filters,
  onUpdateFilter,
  onToggleFaixa,
  onClear,
  hasActiveFilters,
  uniqueOrigens,
  uniqueStatus,
  isOpen,
  onToggleOpen,
}: FiltersPanelProps) => {
  const [searchInput, setSearchInput] = useState(filters.clientePagante || filters.integrador || '');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      // Search in both cliente and integrador
      onUpdateFilter('clientePagante', searchInput);
      onUpdateFilter('integrador', searchInput);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput, onUpdateFilter]);

  // Sync input when filters are cleared
  useEffect(() => {
    if (filters.clientePagante === '' && filters.integrador === '' && searchInput !== '') {
      setSearchInput('');
    }
  }, [filters.clientePagante, filters.integrador]);

  // Toggle origem selection
  const toggleOrigem = (origem: string) => {
    // For simplicity, we'll use the origemContrato as a single select
    // but allow deselection
    if (filters.origemContrato === origem) {
      onUpdateFilter('origemContrato', '');
    } else {
      onUpdateFilter('origemContrato', origem);
    }
  };

  // Toggle status selection
  const toggleStatus = (status: string) => {
    if (filters.status === status) {
      onUpdateFilter('status', '');
    } else {
      onUpdateFilter('status', status);
    }
  };

  const panelStyle: React.CSSProperties = {
    width: isOpen ? '260px' : '0px',
    minWidth: isOpen ? '260px' : '0px',
    backgroundColor: 'var(--color-surface)',
    borderRight: isOpen ? '1px solid var(--color-border)' : 'none',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    transition: 'all 200ms ease',
    position: 'relative',
  };

  const contentStyle: React.CSSProperties = {
    padding: isOpen ? 'var(--spacing-md)' : '0',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-md)',
    opacity: isOpen ? 1 : 0,
    transition: 'opacity 150ms ease',
    overflowY: 'auto',
    flex: 1,
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 'var(--spacing-sm)',
    borderBottom: '1px solid var(--color-border-subtle)',
    marginBottom: 'var(--spacing-sm)',
  };

  const sectionStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-xs)',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 'var(--text-xs)',
    fontWeight: 600,
    color: 'var(--color-text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  };

  const chipsContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.375rem',
  };

  const toggleButtonStyle: React.CSSProperties = {
    position: 'absolute',
    right: isOpen ? '-12px' : '-32px',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    border: '1px solid var(--color-border)',
    backgroundColor: 'var(--color-surface)',
    color: 'var(--color-text-secondary)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    boxShadow: 'var(--shadow-sm)',
    transition: 'all 150ms ease',
  };

  const clearButtonStyle: React.CSSProperties = {
    fontSize: 'var(--text-xs)',
    color: 'var(--color-primary)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0.25rem 0.5rem',
    borderRadius: 'var(--radius-sm)',
    transition: 'background-color 150ms ease',
  };

  return (
    <aside style={panelStyle}>
      {/* Toggle button */}
      <button
        onClick={onToggleOpen}
        style={toggleButtonStyle}
        title={isOpen ? 'Ocultar filtros' : 'Mostrar filtros'}
        aria-label={isOpen ? 'Ocultar filtros' : 'Mostrar filtros'}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--color-primary-subtle)';
          e.currentTarget.style.borderColor = 'var(--color-primary)';
          e.currentTarget.style.color = 'var(--color-primary)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--color-surface)';
          e.currentTarget.style.borderColor = 'var(--color-border)';
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
            transform: isOpen ? 'rotate(0deg)' : 'rotate(180deg)',
            transition: 'transform 200ms ease',
          }}
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      <div style={contentStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
            Filtros
          </span>
          {hasActiveFilters && (
            <button
              onClick={onClear}
              style={clearButtonStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-primary-subtle)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              Limpar
            </button>
          )}
        </div>

        {/* Search */}
        <div style={sectionStyle}>
          <Input
            placeholder="Buscar cliente ou integrador..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            style={{ fontSize: 'var(--text-sm)' }}
          />
        </div>

        {/* Faixas de Atraso */}
        <div style={sectionStyle}>
          <label style={labelStyle}>Faixa de Atraso</label>
          <div style={chipsContainerStyle}>
            {FAIXAS_ATRASO.map((faixa) => (
              <Chip
                key={faixa}
                label={`D+${faixa}`}
                isActive={filters.faixasAtraso.includes(faixa)}
                onClick={() => onToggleFaixa(faixa)}
              />
            ))}
          </div>
        </div>

        {/* Origem do Contrato */}
        <div style={sectionStyle}>
          <label style={labelStyle}>Origem</label>
          <div style={chipsContainerStyle}>
            {uniqueOrigens.map((origem) => (
              <Chip
                key={origem}
                label={origem}
                isActive={filters.origemContrato === origem}
                onClick={() => toggleOrigem(origem)}
              />
            ))}
          </div>
        </div>

        {/* Status */}
        <div style={sectionStyle}>
          <label style={labelStyle}>Status</label>
          <div style={chipsContainerStyle}>
            {uniqueStatus.map((status) => (
              <Chip
                key={status}
                label={status}
                isActive={filters.status === status}
                onClick={() => toggleStatus(status)}
              />
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default FiltersPanel;
