import { useState, useEffect } from 'react';
import {
  Container,
  Card,
  CardHeader,
  CardBody,
  HStack,
  VStack,
  Grid,
  Badge,
  Button,
  Divider,
} from '@cdc-fotus/design-system';

// Dados estáticos do DS Monitor (em produção, viria de uma API ou arquivo JSON)
const DS_COMPONENTS = {
  base: [
    'Button', 'Input', 'Select', 'Badge',
    'Card', 'CardHeader', 'CardBody', 'CardFooter',
    'Modal', 'ModalFooter', 'Tooltip',
    'Skeleton', 'Spinner', 'LoadingOverlay',
    'Table', 'TableHeader', 'TableBody', 'TableRow', 'TableHead', 'TableCell',
    'EmptyState',
  ],
  layout: [
    'Container', 'Stack', 'HStack', 'VStack',
    'Grid', 'Divider', 'Spacer',
  ],
};

interface ComponentStatus {
  name: string;
  category: 'base' | 'layout';
  status: 'used' | 'unused' | 'local-only';
  usageCount: number;
  files: string[];
}

// Simular dados de uso (em produção, carregar do JSON gerado pelo ds-monitor)
const getComponentStatuses = (): ComponentStatus[] => {
  const usedComponents: Record<string, { count: number; files: string[] }> = {
    'Button': { count: 3, files: ['ContractDetailPage.tsx', 'ContractDetailPlaceholder.tsx', 'DesignSystemShowcase.tsx'] },
    'Badge': { count: 4, files: ['ContractRow.tsx', 'CriticalityTag.tsx', 'ContractDetailPage.tsx', 'DesignSystemShowcase.tsx'] },
    'Input': { count: 2, files: ['FiltersPanel.tsx', 'DesignSystemShowcase.tsx'] },
    'Table': { count: 2, files: ['ContractsTable.tsx', 'DesignSystemShowcase.tsx'] },
    'TableHeader': { count: 2, files: ['ContractsTable.tsx', 'DesignSystemShowcase.tsx'] },
    'TableBody': { count: 2, files: ['ContractsTable.tsx', 'DesignSystemShowcase.tsx'] },
    'TableRow': { count: 3, files: ['ContractsTable.tsx', 'ContractRow.tsx', 'DesignSystemShowcase.tsx'] },
    'TableHead': { count: 2, files: ['ContractsTable.tsx', 'DesignSystemShowcase.tsx'] },
    'TableCell': { count: 2, files: ['ContractRow.tsx', 'DesignSystemShowcase.tsx'] },
    'EmptyState': { count: 2, files: ['ContractsTable.tsx', 'DesignSystemShowcase.tsx'] },
    'Container': { count: 2, files: ['DesignSystemShowcase.tsx', 'DSMonitorPage.tsx'] },
    'Card': { count: 2, files: ['DesignSystemShowcase.tsx', 'DSMonitorPage.tsx'] },
    'CardHeader': { count: 2, files: ['DesignSystemShowcase.tsx', 'DSMonitorPage.tsx'] },
    'CardBody': { count: 2, files: ['DesignSystemShowcase.tsx', 'DSMonitorPage.tsx'] },
    'HStack': { count: 2, files: ['DesignSystemShowcase.tsx', 'DSMonitorPage.tsx'] },
    'VStack': { count: 2, files: ['DesignSystemShowcase.tsx', 'DSMonitorPage.tsx'] },
    'Grid': { count: 2, files: ['DesignSystemShowcase.tsx', 'DSMonitorPage.tsx'] },
    'Divider': { count: 2, files: ['DesignSystemShowcase.tsx', 'DSMonitorPage.tsx'] },
    'Select': { count: 1, files: ['DesignSystemShowcase.tsx'] },
    'Modal': { count: 1, files: ['DesignSystemShowcase.tsx'] },
    'ModalFooter': { count: 1, files: ['DesignSystemShowcase.tsx'] },
    'Tooltip': { count: 1, files: ['DesignSystemShowcase.tsx'] },
    'Skeleton': { count: 1, files: ['DesignSystemShowcase.tsx'] },
    'Spinner': { count: 1, files: ['DesignSystemShowcase.tsx'] },
  };

  const allComponents = [
    ...DS_COMPONENTS.base.map(name => ({ name, category: 'base' as const })),
    ...DS_COMPONENTS.layout.map(name => ({ name, category: 'layout' as const })),
  ];

  return allComponents.map(comp => {
    const usage = usedComponents[comp.name];
    return {
      ...comp,
      status: usage ? 'used' : 'unused',
      usageCount: usage?.count || 0,
      files: usage?.files || [],
    };
  });
};

export default function DSMonitorPage() {
  const [components, setComponents] = useState<ComponentStatus[]>([]);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [filter, setFilter] = useState<'all' | 'used' | 'unused'>('all');

  useEffect(() => {
    setComponents(getComponentStatuses());
    setLastUpdate(new Date().toLocaleString('pt-BR'));
  }, []);

  const usedCount = components.filter(c => c.status === 'used').length;
  const totalCount = components.length;
  const coveragePercent = Math.round((usedCount / totalCount) * 100);

  const filteredComponents = components.filter(c => {
    if (filter === 'all') return true;
    if (filter === 'used') return c.status === 'used';
    if (filter === 'unused') return c.status === 'unused';
    return true;
  });

  const baseComponents = filteredComponents.filter(c => c.category === 'base');
  const layoutComponents = filteredComponents.filter(c => c.category === 'layout');

  const getCoverageColor = () => {
    if (coveragePercent >= 70) return 'var(--color-success)';
    if (coveragePercent >= 40) return 'var(--color-warning)';
    return 'var(--color-error)';
  };

  const getCoverageBadge = () => {
    if (coveragePercent >= 70) return 'success';
    if (coveragePercent >= 40) return 'warning';
    return 'error';
  };

  return (
    <Container maxWidth="xl" style={{ padding: 'var(--spacing-8) var(--spacing-4)' }}>
      <HStack justify="between" align="center" style={{ marginBottom: 'var(--spacing-6)' }}>
        <div>
          <h1 style={{
            fontSize: 'var(--text-3xl)',
            fontWeight: 700,
            marginBottom: 'var(--spacing-1)',
            color: 'var(--color-text-primary)'
          }}>
            DS Monitor
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
            Monitoramento de uso do Design System
          </p>
        </div>
        <Badge variant={getCoverageBadge() as 'success' | 'warning' | 'error'} size="md">
          {coveragePercent}% Cobertura
        </Badge>
      </HStack>

      {/* Summary Cards */}
      <Grid cols={4} gap="md" style={{ marginBottom: 'var(--spacing-8)' }}>
        <Card variant="outlined" padding="md">
          <VStack gap="xs" align="start">
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Total DS
            </span>
            <span style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-text-primary)' }}>
              {totalCount}
            </span>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
              componentes disponíveis
            </span>
          </VStack>
        </Card>

        <Card variant="outlined" padding="md">
          <VStack gap="xs" align="start">
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Em Uso
            </span>
            <span style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-success)' }}>
              {usedCount}
            </span>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
              componentes ativos
            </span>
          </VStack>
        </Card>

        <Card variant="outlined" padding="md">
          <VStack gap="xs" align="start">
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Não Usados
            </span>
            <span style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-warning)' }}>
              {totalCount - usedCount}
            </span>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
              disponíveis para uso
            </span>
          </VStack>
        </Card>

        <Card variant="outlined" padding="md">
          <VStack gap="xs" align="start">
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Cobertura
            </span>
            <span style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: getCoverageColor() }}>
              {coveragePercent}%
            </span>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
              do Design System
            </span>
          </VStack>
        </Card>
      </Grid>

      {/* Progress Bar */}
      <Card variant="default" padding="lg" style={{ marginBottom: 'var(--spacing-8)' }}>
        <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 'var(--spacing-4)', color: 'var(--color-text-primary)' }}>
          Progresso de Adoção
        </h3>
        <div style={{
          width: '100%',
          height: '24px',
          backgroundColor: 'var(--color-border-subtle)',
          borderRadius: 'var(--radius-full)',
          overflow: 'hidden',
          position: 'relative'
        }}>
          <div style={{
            width: `${coveragePercent}%`,
            height: '100%',
            backgroundColor: getCoverageColor(),
            borderRadius: 'var(--radius-full)',
            transition: 'width 0.5s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingRight: 'var(--spacing-2)'
          }}>
            {coveragePercent >= 15 && (
              <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'white' }}>
                {coveragePercent}%
              </span>
            )}
          </div>
        </div>
        <HStack justify="between" style={{ marginTop: 'var(--spacing-2)' }}>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>0%</span>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Meta: 100%</span>
        </HStack>
      </Card>

      {/* Filter */}
      <HStack gap="sm" style={{ marginBottom: 'var(--spacing-4)' }}>
        <Button
          variant={filter === 'all' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          Todos ({totalCount})
        </Button>
        <Button
          variant={filter === 'used' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setFilter('used')}
        >
          Em Uso ({usedCount})
        </Button>
        <Button
          variant={filter === 'unused' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setFilter('unused')}
        >
          Não Usados ({totalCount - usedCount})
        </Button>
      </HStack>

      {/* Components Grid */}
      <Grid cols={2} gap="md">
        {/* Base Components */}
        <Card variant="default" padding="none">
          <CardHeader>
            <HStack justify="between" align="center">
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, margin: 0 }}>
                Componentes Base
              </h3>
              <Badge variant="info" size="sm">{baseComponents.length}</Badge>
            </HStack>
          </CardHeader>
          <CardBody style={{ padding: 0 }}>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {baseComponents.map((comp, idx) => (
                <div key={comp.name}>
                  <div style={{
                    padding: 'var(--spacing-3) var(--spacing-4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <HStack gap="sm" align="center">
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: comp.status === 'used' ? 'var(--color-success)' : 'var(--color-border)'
                      }} />
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 'var(--text-sm)',
                        color: comp.status === 'used' ? 'var(--color-text-primary)' : 'var(--color-text-muted)'
                      }}>
                        {comp.name}
                      </span>
                    </HStack>
                    {comp.status === 'used' ? (
                      <Badge variant="success" size="sm">{comp.usageCount}x</Badge>
                    ) : (
                      <Badge variant="default" size="sm">—</Badge>
                    )}
                  </div>
                  {idx < baseComponents.length - 1 && <Divider />}
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Layout Components */}
        <Card variant="default" padding="none">
          <CardHeader>
            <HStack justify="between" align="center">
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, margin: 0 }}>
                Componentes de Layout
              </h3>
              <Badge variant="info" size="sm">{layoutComponents.length}</Badge>
            </HStack>
          </CardHeader>
          <CardBody style={{ padding: 0 }}>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {layoutComponents.map((comp, idx) => (
                <div key={comp.name}>
                  <div style={{
                    padding: 'var(--spacing-3) var(--spacing-4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <HStack gap="sm" align="center">
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: comp.status === 'used' ? 'var(--color-success)' : 'var(--color-border)'
                      }} />
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 'var(--text-sm)',
                        color: comp.status === 'used' ? 'var(--color-text-primary)' : 'var(--color-text-muted)'
                      }}>
                        {comp.name}
                      </span>
                    </HStack>
                    {comp.status === 'used' ? (
                      <Badge variant="success" size="sm">{comp.usageCount}x</Badge>
                    ) : (
                      <Badge variant="default" size="sm">—</Badge>
                    )}
                  </div>
                  {idx < layoutComponents.length - 1 && <Divider />}
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </Grid>

      {/* Footer */}
      <div style={{
        marginTop: 'var(--spacing-8)',
        padding: 'var(--spacing-4)',
        backgroundColor: 'var(--color-border-subtle)',
        borderRadius: 'var(--radius-lg)',
        textAlign: 'center'
      }}>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', margin: 0 }}>
          Última atualização: {lastUpdate} •
          Execute <code style={{
            fontFamily: 'var(--font-mono)',
            backgroundColor: 'var(--color-surface)',
            padding: '2px 6px',
            borderRadius: 'var(--radius-sm)',
            fontSize: 'var(--text-xs)'
          }}>pnpm ds:monitor</code> para atualizar dados
        </p>
      </div>
    </Container>
  );
}
