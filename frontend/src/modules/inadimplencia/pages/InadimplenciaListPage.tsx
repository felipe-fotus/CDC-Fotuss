import { useState } from 'react';
import { useContracts } from '../hooks/useContracts';
import { useFilters } from '../hooks/useFilters';
import { useSorting } from '../hooks/useSorting';
import FiltersPanel from '../components/FiltersPanel';
import SortControl from '../components/SortControl';
import ContractsTable from '../components/ContractsTable';
import MetricsPanel from '../components/MetricsPanel';
import QuickFilters from '../components/QuickFilters';
import AnotacoesModal from '../components/AnotacoesModal';
import { getYesterdayDate } from '../../../lib/dates';
import type { Contract } from '../types/contract';

const InadimplenciaListPage = () => {
  const { filters, updateFilter, toggleFaixaAtraso, clearFilters, hasActiveFilters } = useFilters();
  const { sorting, setSortingFromValue, sortingValue } = useSorting();
  const { filteredContracts, metrics, isLoading, refetch, tratadosCount, pendentesCount, contracts } = useContracts(filters, sorting);
  const [isFiltersPanelOpen, setIsFiltersPanelOpen] = useState(true);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenAnotacoes = (contract: Contract) => {
    setSelectedContract(contract);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedContract(null);
  };

  const handleModalUpdate = () => {
    refetch();
  };

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

  const toolbarLeftStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-md)',
    flexWrap: 'wrap',
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
            <div style={toolbarLeftStyle}>
              <QuickFilters
                statusTratamento={filters.statusTratamento}
                onStatusChange={(status) => updateFilter('statusTratamento', status)}
                totalCount={contracts.length}
                tratadosCount={tratadosCount}
                pendentesCount={pendentesCount}
              />
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
            </div>
            <SortControl value={sortingValue} onChange={setSortingFromValue} />
          </div>

          {/* Table */}
          <ContractsTable
            contracts={filteredContracts}
            isLoading={isLoading}
            onOpenAnotacoes={handleOpenAnotacoes}
          />
        </div>
      </div>

      {/* Modal de Anotacoes */}
      {selectedContract && (
        <AnotacoesModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          contratoId={selectedContract.id}
          clienteNome={selectedContract.clientePagante}
          tratado={selectedContract.tratado}
          onUpdate={handleModalUpdate}
        />
      )}
    </div>
  );
};

export default InadimplenciaListPage;
