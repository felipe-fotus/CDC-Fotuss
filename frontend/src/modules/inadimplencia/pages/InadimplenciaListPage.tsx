import { useState } from 'react';
import { useContracts } from '../hooks/useContracts';
import { useFilters } from '../hooks/useFilters';
import { useSorting } from '../hooks/useSorting';
import FiltersPanel from '../components/FiltersPanel';
import SortControl from '../components/SortControl';
import ContractsTable from '../components/ContractsTable';
import MetricsPanel from '../components/MetricsPanel';
import { getYesterdayDate } from '../../../lib/dates';

const InadimplenciaListPage = () => {
  const { filters, updateFilter, toggleFaixaAtraso, clearFilters, hasActiveFilters } = useFilters();
  const { sorting, setSortingFromValue, sortingValue } = useSorting();
  const { filteredContracts, metrics, isLoading, uniqueOrigens, uniqueStatus } = useContracts(filters, sorting);
  const [isFiltersPanelOpen, setIsFiltersPanelOpen] = useState(true);

  const pageStyle: React.CSSProperties = {
    display: 'flex',
    flex: 1,
    backgroundColor: 'var(--color-bg)',
    overflow: 'hidden',
  };

  const contentStyle: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  };

  const headerStyle: React.CSSProperties = {
    padding: 'var(--spacing-md) var(--spacing-lg)',
    borderBottom: '1px solid var(--color-border)',
    backgroundColor: 'var(--color-surface)',
  };

  const titleRowStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 'var(--spacing-md)',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: 'var(--text-xl)',
    fontWeight: 600,
    color: 'var(--color-text-primary)',
    margin: 0,
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: 'var(--text-xs)',
    color: 'var(--color-text-muted)',
  };

  const mainContentStyle: React.CSSProperties = {
    flex: 1,
    padding: 'var(--spacing-lg)',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-md)',
  };

  const toolbarStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 'var(--spacing-sm)',
  };

  const resultsInfoStyle: React.CSSProperties = {
    fontSize: 'var(--text-sm)',
    color: 'var(--color-text-secondary)',
  };

  return (
    <div style={pageStyle}>
      {/* Filters Sidebar */}
      <FiltersPanel
        filters={filters}
        onUpdateFilter={updateFilter}
        onToggleFaixa={toggleFaixaAtraso}
        onClear={clearFilters}
        hasActiveFilters={hasActiveFilters}
        uniqueOrigens={uniqueOrigens}
        uniqueStatus={uniqueStatus}
        isOpen={isFiltersPanelOpen}
        onToggleOpen={() => setIsFiltersPanelOpen(!isFiltersPanelOpen)}
      />

      {/* Main Content */}
      <div style={contentStyle}>
        {/* Header */}
        <header style={headerStyle}>
          <div style={titleRowStyle}>
            <div>
              <h1 style={titleStyle}>Inadimplencia</h1>
              <span style={subtitleStyle}>Atualizado D-1 ({getYesterdayDate()})</span>
            </div>
          </div>

          {/* Metrics */}
          <MetricsPanel metrics={metrics} isLoading={isLoading} />
        </header>

        {/* Content */}
        <div style={mainContentStyle}>
          {/* Toolbar */}
          <div style={toolbarStyle}>
            <div style={resultsInfoStyle}>
              {isLoading ? (
                'Carregando...'
              ) : (
                <>
                  <strong>{filteredContracts.length}</strong> contrato
                  {filteredContracts.length !== 1 ? 's' : ''}
                  {hasActiveFilters && ' (filtrado)'}
                </>
              )}
            </div>
            <SortControl value={sortingValue} onChange={setSortingFromValue} />
          </div>

          {/* Table */}
          <ContractsTable contracts={filteredContracts} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default InadimplenciaListPage;
