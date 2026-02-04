import { useState, useEffect } from 'react';
import { Input } from '@cdc-fotus/design-system';
import type { ContractFilters } from '../types/contract';
import { FAIXAS_ATRASO } from '../services/contractsService';

interface FiltersPanelProps {
  filters: ContractFilters;
  onUpdateFilter: <K extends keyof ContractFilters>(key: K, value: ContractFilters[K]) => void;
  onToggleFaixa: (faixa: number) => void;
  onClear: () => void;
  hasActiveFilters: boolean;
  isOpen: boolean;
  onToggleOpen: () => void;
}

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
  isOpen,
  onToggleOpen,
}: FiltersPanelProps) => {
  const [clienteBusca, setClienteBusca] = useState(filters.clienteBusca || '');
  const [integradorBusca, setIntegradorBusca] = useState(filters.integradorBusca || '');

  useEffect(() => {
    const timer = setTimeout(() => {
      onUpdateFilter('clienteBusca', clienteBusca);
    }, 300);
    return () => clearTimeout(timer);
  }, [clienteBusca, onUpdateFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      onUpdateFilter('integradorBusca', integradorBusca);
    }, 300);
    return () => clearTimeout(timer);
  }, [integradorBusca, onUpdateFilter]);

  useEffect(() => {
    if (!filters.clienteBusca && clienteBusca) setClienteBusca('');
    if (!filters.integradorBusca && integradorBusca) setIntegradorBusca('');
  }, [filters.clienteBusca, filters.integradorBusca]);

  const panelStyle: React.CSSProperties = {
    position: 'sticky',
    top: 0,
    height: '100vh',
    width: isOpen ? '260px' : '48px',
    backgroundColor: 'var(--color-surface)',
    borderRight: '1px solid var(--color-border)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    transition: 'width 200ms ease',
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: isOpen ? 'space-between' : 'center',
    padding: isOpen ? 'var(--spacing-md)' : 'var(--spacing-sm)',
    borderBottom: '1px solid var(--color-border-subtle)',
    gap: 'var(--spacing-sm)',
  };

  const headerTitleStyle: React.CSSProperties = {
    fontSize: 'var(--text-sm)',
    fontWeight: 600,
    color: 'var(--color-text-primary)',
    whiteSpace: 'nowrap',
  };

  const toggleButtonStyle: React.CSSProperties = {
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

  const contentStyle: React.CSSProperties = {
    padding: 'var(--spacing-md)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-md)',
    opacity: isOpen ? 1 : 0,
    transition: 'opacity 150ms ease',
    overflowY: 'auto',
    flex: 1,
    pointerEvents: isOpen ? 'auto' : 'none',
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
      <div style={headerStyle}>
        {isOpen && <span style={headerTitleStyle}>Filtros</span>}
        {isOpen && hasActiveFilters && (
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
        <button
          onClick={onToggleOpen}
          style={toggleButtonStyle}
          title={isOpen ? 'Ocultar filtros' : 'Mostrar filtros'}
          aria-label={isOpen ? 'Ocultar filtros' : 'Mostrar filtros'}
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
              transform: isOpen ? 'rotate(0deg)' : 'rotate(180deg)',
              transition: 'transform 200ms ease',
            }}
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      </div>

      <div style={contentStyle}>
          <div style={sectionStyle}>
            <label style={labelStyle}>Cliente</label>
            <Input
              placeholder="Nome ou CPF/CNPJ..."
              value={clienteBusca}
              onChange={(e) => setClienteBusca(e.target.value)}
              style={{ fontSize: 'var(--text-sm)' }}
            />
          </div>

          <div style={sectionStyle}>
            <label style={labelStyle}>Integrador</label>
            <Input
              placeholder="Nome ou CNPJ..."
              value={integradorBusca}
              onChange={(e) => setIntegradorBusca(e.target.value)}
              style={{ fontSize: 'var(--text-sm)' }}
            />
          </div>

          <div style={sectionStyle}>
            <label style={labelStyle}>Faixa de Atraso (dias)</label>
            <div style={chipsContainerStyle}>
              {FAIXAS_ATRASO.map((faixa) => (
                <Chip
                  key={faixa}
                  label={String(faixa)}
                  isActive={filters.faixasAtraso.includes(faixa)}
                  onClick={() => onToggleFaixa(faixa)}
                />
              ))}
            </div>
          </div>
      </div>
    </aside>
  );
};

export default FiltersPanel;
