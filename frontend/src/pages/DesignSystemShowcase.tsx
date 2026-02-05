import { useState } from 'react';
import {
  Button,
  Input,
  Select,
  Badge,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Modal,
  ModalFooter,
  Tooltip,
  Skeleton,
  Spinner,
  LoadingOverlay,
  Container,
  HStack,
  VStack,
  Grid,
  Divider,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  EmptyState,
  Switch,
  DateInput,
  CurrencyInput,
  useToast,
} from '@cdc-fotus/design-system';

// ============ ICONS ============
// Todos os ícones utilizados no sistema

const Icons = {
  Check: ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Close: ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  ArrowLeft: ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  ),
  ChevronLeft: ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  ),
  ChevronRight: ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
  Search: ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  Boleto: ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="9" y1="21" x2="9" y2="9" />
    </svg>
  ),
  Copy: ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  ),
  Chat: ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  Calendar: ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  Circle: ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
    </svg>
  ),
  Info: ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
  Warning: ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  Filter: ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  ),
  File: ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  ),
};

export default function DesignSystemShowcase() {
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selectValue, setSelectValue] = useState('');
  const [switchValue, setSwitchValue] = useState(false);
  const [switchValue2, setSwitchValue2] = useState(true);
  const [dateValue, setDateValue] = useState('');
  const [currencyValue, setCurrencyValue] = useState(1500);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopy = () => {
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const sectionStyles: React.CSSProperties = {
    marginBottom: 'var(--spacing-6)',
    padding: 'var(--spacing-5)',
    backgroundColor: 'var(--color-surface)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--color-border)',
  };

  const titleStyles: React.CSSProperties = {
    fontSize: 'var(--text-lg)',
    fontWeight: 700,
    color: 'var(--color-text-primary)',
    marginBottom: 'var(--spacing-4)',
  };

  const subtitleStyles: React.CSSProperties = {
    fontSize: 'var(--text-xs)',
    fontWeight: 600,
    color: 'var(--color-text-muted)',
    marginBottom: 'var(--spacing-3)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  };

  return (
    <Container maxWidth="xl" style={{ padding: 'var(--spacing-6) var(--spacing-4)' }}>
      <div style={{ marginBottom: 'var(--spacing-6)' }}>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>
          Design System
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--spacing-1)', fontSize: 'var(--text-sm)' }}>
          CDC Fotus - Componentes, Ícones e Tokens
        </p>
      </div>

      {/* ============ ICONS ============ */}
      <section style={sectionStyles}>
        <h2 style={titleStyles}>Icons</h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-4)', fontSize: 'var(--text-xs)' }}>
          SVG inline com stroke="currentColor" para herdar cor do texto.
        </p>
        <Grid cols={6} gap="sm">
          {Object.entries(Icons).map(([name, Icon]) => (
            <VStack key={name} gap="xs" align="center" style={{ padding: 'var(--spacing-3)', backgroundColor: 'var(--color-bg)', borderRadius: 'var(--radius-md)' }}>
              <Icon size={20} />
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{name}</span>
            </VStack>
          ))}
        </Grid>
      </section>

      {/* ============ BUTTONS ============ */}
      <section style={sectionStyles}>
        <h2 style={titleStyles}>Button</h2>
        <h3 style={subtitleStyles}>Variants</h3>
        <HStack gap="sm" wrap style={{ marginBottom: 'var(--spacing-4)' }}>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
        </HStack>
        <h3 style={subtitleStyles}>Sizes</h3>
        <HStack gap="sm" align="center" style={{ marginBottom: 'var(--spacing-4)' }}>
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </HStack>
        <h3 style={subtitleStyles}>Com Ícones (uso real)</h3>
        <HStack gap="sm" wrap style={{ marginBottom: 'var(--spacing-4)' }}>
          <Button variant="secondary" size="sm" leftIcon={<Icons.ArrowLeft size={14} />}>Voltar</Button>
          <Button variant="primary" size="sm" leftIcon={<Icons.Boleto size={14} />}>Gerar Boleto</Button>
          <Button variant="ghost" size="sm" leftIcon={<Icons.Chat size={14} />}>Anotações</Button>
          <Button variant="ghost" size="sm" leftIcon={<Icons.Filter size={14} />}>Filtros</Button>
        </HStack>
        <h3 style={subtitleStyles}>Estados</h3>
        <HStack gap="sm" wrap>
          <Button isLoading>Loading</Button>
          <Button disabled>Disabled</Button>
        </HStack>
      </section>

      {/* ============ INPUTS ============ */}
      <section style={sectionStyles}>
        <h2 style={titleStyles}>Input</h2>
        <Grid cols={3} gap="md">
          <Input label="Default" placeholder="Digite algo..." value={inputValue} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)} />
          <Input label="Helper Text" placeholder="Digite..." helperText="Texto de ajuda" />
          <Input label="Com Erro" placeholder="Digite..." error="Campo obrigatório" />
        </Grid>
      </section>

      {/* ============ DATE INPUT ============ */}
      <section style={sectionStyles}>
        <h2 style={titleStyles}>DateInput</h2>
        <Grid cols={3} gap="md">
          <DateInput label="Vencimento" value={dateValue} onChange={(e) => setDateValue(e.target.value)} />
          <DateInput label="Com Mínimo" value={dateValue} onChange={(e) => setDateValue(e.target.value)} min={new Date().toISOString().split('T')[0]} helperText="A partir de hoje" />
          <DateInput label="Com Erro" value="" onChange={() => {}} error="Data inválida" />
        </Grid>
      </section>

      {/* ============ CURRENCY INPUT ============ */}
      <section style={sectionStyles}>
        <h2 style={titleStyles}>CurrencyInput</h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-3)', fontSize: 'var(--text-xs)' }}>
          Auto-formata: 150000 = R$ 150.000,00 | Auto-corrige min/max
        </p>
        <Grid cols={3} gap="md">
          <CurrencyInput label="Valor" value={currencyValue} onChange={setCurrencyValue} />
          <CurrencyInput label="Com Limites" value={currencyValue} onChange={setCurrencyValue} minValue={100} maxValue={10000} helperText="Mín: 100 | Máx: 10.000" />
          <CurrencyInput label="Com Erro" value={50} onChange={() => {}} error="Abaixo do mínimo" />
        </Grid>
      </section>

      {/* ============ SELECT ============ */}
      <section style={sectionStyles}>
        <h2 style={titleStyles}>Select</h2>
        <Grid cols={3} gap="md">
          <Select label="Selecione" placeholder="Escolha..." value={selectValue} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectValue(e.target.value)} options={[{ value: '1', label: 'Opção 1' }, { value: '2', label: 'Opção 2' }]} />
          <Select label="Com Erro" error="Obrigatório" options={[{ value: '1', label: 'Opção 1' }]} />
        </Grid>
      </section>

      {/* ============ SWITCH ============ */}
      <section style={sectionStyles}>
        <h2 style={titleStyles}>Switch</h2>
        <h3 style={subtitleStyles}>Tamanhos</h3>
        <HStack gap="xl" style={{ marginBottom: 'var(--spacing-4)' }}>
          <Switch checked={switchValue} onChange={setSwitchValue} size="sm" label="Small" />
          <Switch checked={switchValue} onChange={setSwitchValue} size="md" label="Medium" />
          <Switch checked={switchValue} onChange={setSwitchValue} size="lg" label="Large" />
        </HStack>
        <h3 style={subtitleStyles}>Com Descrição</h3>
        <VStack gap="md" align="start">
          <Switch checked={switchValue2} onChange={setSwitchValue2} label="Boleto Único" description="Consolidar em um único boleto" />
          <Switch checked={false} onChange={() => {}} disabled label="Desabilitado" description="Opção bloqueada" />
        </VStack>
      </section>

      {/* ============ BADGES ============ */}
      <section style={sectionStyles}>
        <h2 style={titleStyles}>Badge</h2>
        <h3 style={subtitleStyles}>Semânticos</h3>
        <HStack gap="sm" wrap style={{ marginBottom: 'var(--spacing-4)' }}>
          <Badge variant="default">Default</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="error">Error</Badge>
          <Badge variant="info">Info</Badge>
        </HStack>
        <h3 style={subtitleStyles}>Criticidade (tabela de contratos)</h3>
        <HStack gap="sm" wrap style={{ marginBottom: 'var(--spacing-4)' }}>
          <Badge variant="low" style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>D+30</Badge>
          <Badge variant="medium" style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>D+60</Badge>
          <Badge variant="high" style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>D+90</Badge>
          <Badge variant="critical" style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>D+120</Badge>
        </HStack>
        <h3 style={subtitleStyles}>Com Ícones</h3>
        <HStack gap="sm" wrap>
          <Badge variant="success"><HStack gap="xs" align="center"><Icons.Check size={12} /><span>Pago</span></HStack></Badge>
          <Badge variant="warning"><HStack gap="xs" align="center"><Icons.Circle size={12} /><span>Pendente</span></HStack></Badge>
          <Badge variant="error"><HStack gap="xs" align="center"><Icons.Warning size={12} /><span>Vencido</span></HStack></Badge>
        </HStack>
      </section>

      {/* ============ TOAST ============ */}
      <section style={sectionStyles}>
        <h2 style={titleStyles}>Toast</h2>
        <HStack gap="sm" wrap>
          <Button variant="primary" size="sm" onClick={() => showToast('success', 'Boleto gerado!')} leftIcon={<Icons.Check size={14} />}>Success</Button>
          <Button variant="danger" size="sm" onClick={() => showToast('error', 'Erro ao processar.')} leftIcon={<Icons.Close size={14} />}>Error</Button>
          <Button variant="secondary" size="sm" onClick={() => showToast('warning', 'Verifique os dados.')} leftIcon={<Icons.Warning size={14} />}>Warning</Button>
          <Button variant="ghost" size="sm" onClick={() => showToast('info', 'Informação.')} leftIcon={<Icons.Info size={14} />}>Info</Button>
        </HStack>
      </section>

      {/* ============ INTERACTIVE PATTERNS ============ */}
      <section style={sectionStyles}>
        <h2 style={titleStyles}>Padrões Interativos</h2>
        <h3 style={subtitleStyles}>Botão de Copiar</h3>
        <HStack gap="md" align="center" style={{ marginBottom: 'var(--spacing-4)' }}>
          <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>CTR-2024-001234</span>
          <button onClick={handleCopy} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', padding: 0, backgroundColor: copySuccess ? 'rgba(16, 185, 129, 0.1)' : 'transparent', color: copySuccess ? '#10b981' : 'var(--color-text-muted)', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>
            {copySuccess ? <Icons.Check size={14} /> : <Icons.Copy size={14} />}
          </button>
        </HStack>
        <h3 style={subtitleStyles}>Chips de Filtro</h3>
        <HStack gap="xs" wrap>
          {['D+30', 'D+60', 'D+90', 'D+120', 'D+150'].map((label, i) => (
            <button key={label} style={{ padding: '0.25rem 0.625rem', fontSize: 'var(--text-xs)', fontWeight: 600, border: `1px solid ${i < 2 ? 'var(--color-primary)' : 'var(--color-border)'}`, backgroundColor: i < 2 ? 'var(--color-primary-subtle)' : 'transparent', color: i < 2 ? 'var(--color-primary)' : 'var(--color-text-secondary)', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>{label}</button>
          ))}
        </HStack>
      </section>

      {/* ============ CARDS ============ */}
      <section style={sectionStyles}>
        <h2 style={titleStyles}>Card</h2>
        <Grid cols={3} gap="md">
          <Card variant="default">
            <CardHeader><h4 style={{ margin: 0, fontWeight: 600, fontSize: 'var(--text-sm)' }}>Default</h4></CardHeader>
            <CardBody><p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: 'var(--text-xs)' }}>Borda sutil</p></CardBody>
            <CardFooter><Button size="sm" variant="ghost">Cancelar</Button><Button size="sm">OK</Button></CardFooter>
          </Card>
          <Card variant="elevated">
            <CardHeader><h4 style={{ margin: 0, fontWeight: 600, fontSize: 'var(--text-sm)' }}>Elevated</h4></CardHeader>
            <CardBody><p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: 'var(--text-xs)' }}>Com sombra</p></CardBody>
          </Card>
          <Card variant="outlined">
            <CardHeader><h4 style={{ margin: 0, fontWeight: 600, fontSize: 'var(--text-sm)' }}>Outlined</h4></CardHeader>
            <CardBody><p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: 'var(--text-xs)' }}>Borda forte</p></CardBody>
          </Card>
        </Grid>
      </section>

      {/* ============ MODAL ============ */}
      <section style={sectionStyles}>
        <h2 style={titleStyles}>Modal</h2>
        <Button onClick={() => setIsModalOpen(true)}>Abrir Modal</Button>
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Exemplo" size="md">
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>Suporta ESC, overlay click, tamanhos sm/md/lg/xl/full.</p>
          <ModalFooter>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button onClick={() => setIsModalOpen(false)}>Confirmar</Button>
          </ModalFooter>
        </Modal>
      </section>

      {/* ============ TABLE ============ */}
      <section style={sectionStyles}>
        <h2 style={titleStyles}>Table</h2>
        <div style={{ overflowX: 'auto' }}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead sortable sortDirection="asc">ID</TableHead>
                <TableHead sortable>Cliente</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow clickable zebra index={0}>
                <TableCell><span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>CTR-001</span></TableCell>
                <TableCell>Maria Silva</TableCell>
                <TableCell><Badge variant="low" style={{ fontFamily: 'var(--font-mono)' }}>D+30</Badge></TableCell>
                <TableCell><span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>R$ 1.500</span></TableCell>
                <TableCell><HStack gap="xs"><Button size="sm" variant="ghost"><Icons.File size={14} /></Button><Button size="sm" variant="ghost"><Icons.Chat size={14} /></Button></HStack></TableCell>
              </TableRow>
              <TableRow clickable zebra index={1}>
                <TableCell><span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>CTR-002</span></TableCell>
                <TableCell>João Santos</TableCell>
                <TableCell><Badge variant="critical" style={{ fontFamily: 'var(--font-mono)' }}>D+150</Badge></TableCell>
                <TableCell><span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>R$ 2.300</span></TableCell>
                <TableCell><HStack gap="xs"><Button size="sm" variant="ghost"><Icons.File size={14} /></Button><Button size="sm" variant="ghost"><Icons.Chat size={14} /></Button></HStack></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </section>

      {/* ============ EMPTY STATE ============ */}
      <section style={sectionStyles}>
        <h2 style={titleStyles}>EmptyState</h2>
        <EmptyState title="Nenhum contrato" description="Ajuste os filtros." icon={<Icons.Search size={48} />} action={<Button variant="secondary" size="sm" leftIcon={<Icons.Filter size={14} />}>Limpar</Button>} />
      </section>

      {/* ============ TOOLTIP ============ */}
      <section style={sectionStyles}>
        <h2 style={titleStyles}>Tooltip</h2>
        <HStack gap="lg">
          <Tooltip content="Top" position="top"><Button variant="secondary" size="sm">Top</Button></Tooltip>
          <Tooltip content="Bottom" position="bottom"><Button variant="secondary" size="sm">Bottom</Button></Tooltip>
          <Tooltip content="Left" position="left"><Button variant="secondary" size="sm">Left</Button></Tooltip>
          <Tooltip content="Right" position="right"><Button variant="secondary" size="sm">Right</Button></Tooltip>
        </HStack>
      </section>

      {/* ============ LOADING ============ */}
      <section style={sectionStyles}>
        <h2 style={titleStyles}>Loading States</h2>
        <h3 style={subtitleStyles}>Skeleton</h3>
        <HStack gap="md" style={{ marginBottom: 'var(--spacing-4)' }}>
          <Skeleton variant="circle" width={40} height={40} />
          <VStack gap="xs" style={{ flex: 1, maxWidth: '200px' }}>
            <Skeleton variant="text" width="100%" />
            <Skeleton variant="text" width="70%" />
          </VStack>
        </HStack>
        <h3 style={subtitleStyles}>Spinner</h3>
        <HStack gap="lg" align="center" style={{ marginBottom: 'var(--spacing-4)' }}>
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" color="var(--color-primary)" />
        </HStack>
        <h3 style={subtitleStyles}>Loading Overlay</h3>
        <LoadingOverlay isLoading={false} text="Carregando...">
          <Card padding="lg" style={{ maxWidth: '200px' }}><p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Conteúdo</p></Card>
        </LoadingOverlay>
      </section>

      {/* ============ LAYOUT ============ */}
      <section style={sectionStyles}>
        <h2 style={titleStyles}>Layout</h2>
        <h3 style={subtitleStyles}>HStack / VStack / Grid</h3>
        <HStack gap="sm" style={{ marginBottom: 'var(--spacing-3)' }}>
          <div style={{ padding: 'var(--spacing-2)', backgroundColor: 'var(--color-primary-subtle)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-xs)' }}>H1</div>
          <div style={{ padding: 'var(--spacing-2)', backgroundColor: 'var(--color-primary-subtle)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-xs)' }}>H2</div>
          <div style={{ padding: 'var(--spacing-2)', backgroundColor: 'var(--color-primary-subtle)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-xs)' }}>H3</div>
        </HStack>
        <Grid cols={4} gap="xs" style={{ maxWidth: '200px', marginBottom: 'var(--spacing-3)' }}>
          {[1,2,3,4].map(n => <div key={n} style={{ padding: 'var(--spacing-2)', backgroundColor: 'var(--color-warning-light)', borderRadius: 'var(--radius-sm)', textAlign: 'center', fontSize: 'var(--text-xs)' }}>{n}</div>)}
        </Grid>
        <Divider />
      </section>

      {/* ============ COLORS ============ */}
      <section style={sectionStyles}>
        <h2 style={titleStyles}>Colors</h2>
        <h3 style={subtitleStyles}>Primary</h3>
        <HStack gap="xs" wrap style={{ marginBottom: 'var(--spacing-3)' }}>
          {[50,100,200,300,400,500,600,700,800,900].map(s => <div key={s} style={{ width: '32px', height: '32px', backgroundColor: `var(--color-primary-${s})`, borderRadius: 'var(--radius-sm)' }} />)}
        </HStack>
        <h3 style={subtitleStyles}>Semantic</h3>
        <HStack gap="md">
          <VStack gap="xs" align="center"><div style={{ width: '40px', height: '24px', backgroundColor: 'var(--color-success)', borderRadius: 'var(--radius-sm)' }} /><span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Success</span></VStack>
          <VStack gap="xs" align="center"><div style={{ width: '40px', height: '24px', backgroundColor: 'var(--color-warning)', borderRadius: 'var(--radius-sm)' }} /><span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Warning</span></VStack>
          <VStack gap="xs" align="center"><div style={{ width: '40px', height: '24px', backgroundColor: 'var(--color-error)', borderRadius: 'var(--radius-sm)' }} /><span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Error</span></VStack>
          <VStack gap="xs" align="center"><div style={{ width: '40px', height: '24px', backgroundColor: 'var(--color-info)', borderRadius: 'var(--radius-sm)' }} /><span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Info</span></VStack>
        </HStack>
      </section>

      {/* ============ TYPOGRAPHY ============ */}
      <section style={sectionStyles}>
        <h2 style={titleStyles}>Typography</h2>
        <VStack gap="xs" align="start">
          <span style={{ fontSize: 'var(--text-2xl)', fontWeight: 700 }}>2XL (24px)</span>
          <span style={{ fontSize: 'var(--text-xl)', fontWeight: 600 }}>XL (20px)</span>
          <span style={{ fontSize: 'var(--text-lg)', fontWeight: 600 }}>LG (18px)</span>
          <span style={{ fontSize: 'var(--text-base)' }}>Base (16px)</span>
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>SM (14px)</span>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>XS (12px)</span>
          <span style={{ fontSize: 'var(--text-sm)', fontFamily: 'var(--font-mono)' }}>Mono - IDs e valores</span>
        </VStack>
      </section>
    </Container>
  );
}
