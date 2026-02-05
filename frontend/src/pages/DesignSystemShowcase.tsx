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

export default function DesignSystemShowcase() {
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selectValue, setSelectValue] = useState('');
  const [switchValue, setSwitchValue] = useState(false);
  const [switchValue2, setSwitchValue2] = useState(true);
  const [dateValue, setDateValue] = useState('');
  const [currencyValue, setCurrencyValue] = useState(0);

  const sectionStyles: React.CSSProperties = {
    marginBottom: 'var(--spacing-8)',
    padding: 'var(--spacing-6)',
    backgroundColor: 'var(--color-surface)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--color-border-subtle)',
  };

  const titleStyles: React.CSSProperties = {
    fontSize: 'var(--text-2xl)',
    fontWeight: 700,
    color: 'var(--color-text-primary)',
    marginBottom: 'var(--spacing-6)',
  };

  const subtitleStyles: React.CSSProperties = {
    fontSize: 'var(--text-lg)',
    fontWeight: 600,
    color: 'var(--color-text-primary)',
    marginBottom: 'var(--spacing-4)',
  };

  return (
    <Container maxWidth="xl" style={{ padding: 'var(--spacing-8) var(--spacing-4)' }}>
      <h1 style={{ ...titleStyles, fontSize: 'var(--text-4xl)', marginBottom: 'var(--spacing-2)' }}>
        Design System
      </h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-8)' }}>
        CDC Fotus - Componentes e Tokens
      </p>

      {/* Buttons */}
      <section style={sectionStyles}>
        <h2 style={titleStyles}>Buttons</h2>

        <h3 style={subtitleStyles}>Variants</h3>
        <HStack gap="sm" wrap style={{ marginBottom: 'var(--spacing-6)' }}>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
        </HStack>

        <h3 style={subtitleStyles}>Sizes</h3>
        <HStack gap="sm" align="center" style={{ marginBottom: 'var(--spacing-6)' }}>
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </HStack>

        <h3 style={subtitleStyles}>States</h3>
        <HStack gap="sm" wrap>
          <Button isLoading>Loading</Button>
          <Button disabled>Disabled</Button>
          <Button leftIcon={<span>+</span>}>With Icon</Button>
        </HStack>
      </section>

      {/* Inputs */}
      <section style={sectionStyles}>
        <h2 style={titleStyles}>Inputs</h2>

        <Grid cols={3} gap="md">
          <Input
            label="Default Input"
            placeholder="Digite algo..."
            value={inputValue}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
          />
          <Input
            label="Com Helper Text"
            placeholder="Digite algo..."
            helperText="Este é um texto de ajuda"
          />
          <Input
            label="Com Erro"
            placeholder="Digite algo..."
            error="Este campo é obrigatório"
          />
        </Grid>
      </section>

      {/* Select */}
      <section style={sectionStyles}>
        <h2 style={titleStyles}>Select</h2>

        <Grid cols={3} gap="md">
          <Select
            label="Default Select"
            placeholder="Selecione uma opção"
            value={selectValue}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectValue(e.target.value)}
            options={[
              { value: '1', label: 'Opção 1' },
              { value: '2', label: 'Opção 2' },
              { value: '3', label: 'Opção 3' },
            ]}
          />
          <Select
            label="Com Erro"
            error="Campo obrigatório"
            options={[
              { value: '1', label: 'Opção 1' },
            ]}
          />
        </Grid>
      </section>

      {/* Switch */}
      <section style={sectionStyles}>
        <h2 style={titleStyles}>Switch</h2>

        <h3 style={subtitleStyles}>Sizes</h3>
        <HStack gap="xl" style={{ marginBottom: 'var(--spacing-6)' }}>
          <Switch
            checked={switchValue}
            onChange={setSwitchValue}
            size="sm"
            label="Small"
          />
          <Switch
            checked={switchValue}
            onChange={setSwitchValue}
            size="md"
            label="Medium"
          />
          <Switch
            checked={switchValue}
            onChange={setSwitchValue}
            size="lg"
            label="Large"
          />
        </HStack>

        <h3 style={subtitleStyles}>With Description</h3>
        <VStack gap="md" align="start" style={{ marginBottom: 'var(--spacing-6)' }}>
          <Switch
            checked={switchValue2}
            onChange={setSwitchValue2}
            label="Notificações"
            description="Receber alertas por email"
          />
          <Switch
            checked={false}
            onChange={() => {}}
            disabled
            label="Desabilitado"
            description="Esta opção está bloqueada"
          />
        </VStack>
      </section>

      {/* DateInput */}
      <section style={sectionStyles}>
        <h2 style={titleStyles}>DateInput</h2>

        <Grid cols={3} gap="md">
          <DateInput
            label="Data de Vencimento"
            value={dateValue}
            onChange={(e) => setDateValue(e.target.value)}
          />
          <DateInput
            label="Com valor mínimo"
            value={dateValue}
            onChange={(e) => setDateValue(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            helperText="A partir de hoje"
          />
          <DateInput
            label="Com Erro"
            value=""
            onChange={() => {}}
            error="Data inválida"
          />
        </Grid>
      </section>

      {/* CurrencyInput */}
      <section style={sectionStyles}>
        <h2 style={titleStyles}>CurrencyInput</h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-4)' }}>
          Digite apenas números. Auto-formata para moeda brasileira (ex: 150000 = R$ 150.000,00)
        </p>

        <Grid cols={3} gap="md">
          <CurrencyInput
            label="Valor"
            value={currencyValue}
            onChange={setCurrencyValue}
          />
          <CurrencyInput
            label="Com Limites"
            value={currencyValue}
            onChange={setCurrencyValue}
            minValue={100}
            maxValue={10000}
            helperText="Mín: R$ 100,00 | Máx: R$ 10.000,00"
          />
          <CurrencyInput
            label="Com Erro"
            value={50}
            onChange={() => {}}
            error="Valor abaixo do mínimo"
          />
        </Grid>
      </section>

      {/* Toast */}
      <section style={sectionStyles}>
        <h2 style={titleStyles}>Toast</h2>

        <HStack gap="sm" wrap>
          <Button variant="primary" onClick={() => showToast('success', 'Operação realizada com sucesso!')}>
            Success Toast
          </Button>
          <Button variant="danger" onClick={() => showToast('error', 'Ocorreu um erro ao processar.')}>
            Error Toast
          </Button>
          <Button variant="secondary" onClick={() => showToast('warning', 'Atenção: verifique os dados.')}>
            Warning Toast
          </Button>
          <Button variant="ghost" onClick={() => showToast('info', 'Informação importante.')}>
            Info Toast
          </Button>
        </HStack>
      </section>

      {/* Badges */}
      <section style={sectionStyles}>
        <h2 style={titleStyles}>Badges</h2>

        <h3 style={subtitleStyles}>Semantic</h3>
        <HStack gap="sm" wrap style={{ marginBottom: 'var(--spacing-6)' }}>
          <Badge variant="default">Default</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="error">Error</Badge>
          <Badge variant="info">Info</Badge>
        </HStack>

        <h3 style={subtitleStyles}>Criticality</h3>
        <HStack gap="sm" wrap style={{ marginBottom: 'var(--spacing-6)' }}>
          <Badge variant="low">Low</Badge>
          <Badge variant="medium">Medium</Badge>
          <Badge variant="high">High</Badge>
          <Badge variant="critical">Critical</Badge>
        </HStack>

        <h3 style={subtitleStyles}>Sizes</h3>
        <HStack gap="sm" align="center">
          <Badge size="sm" variant="info">Small</Badge>
          <Badge size="md" variant="info">Medium</Badge>
        </HStack>
      </section>

      {/* Cards */}
      <section style={sectionStyles}>
        <h2 style={titleStyles}>Cards</h2>

        <Grid cols={3} gap="md">
          <Card variant="default">
            <CardHeader>
              <h4 style={{ margin: 0, fontWeight: 600 }}>Default Card</h4>
            </CardHeader>
            <CardBody>
              <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>
                Este é o conteúdo do card com borda sutil.
              </p>
            </CardBody>
            <CardFooter>
              <Button size="sm" variant="ghost">Cancelar</Button>
              <Button size="sm">Confirmar</Button>
            </CardFooter>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <h4 style={{ margin: 0, fontWeight: 600 }}>Elevated Card</h4>
            </CardHeader>
            <CardBody>
              <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>
                Este card tem sombra (elevated).
              </p>
            </CardBody>
          </Card>

          <Card variant="outlined">
            <CardHeader>
              <h4 style={{ margin: 0, fontWeight: 600 }}>Outlined Card</h4>
            </CardHeader>
            <CardBody>
              <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>
                Este card tem borda mais forte.
              </p>
            </CardBody>
          </Card>
        </Grid>
      </section>

      {/* Modal */}
      <section style={sectionStyles}>
        <h2 style={titleStyles}>Modal</h2>

        <Button onClick={() => setIsModalOpen(true)}>Abrir Modal</Button>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Exemplo de Modal"
          size="md"
        >
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-4)' }}>
            Este é um exemplo de modal do Design System. Ele suporta:
          </p>
          <ul style={{ color: 'var(--color-text-secondary)', paddingLeft: 'var(--spacing-4)' }}>
            <li>Fechar com ESC</li>
            <li>Fechar clicando no overlay</li>
            <li>Diferentes tamanhos (sm, md, lg, xl, full)</li>
            <li>Animação de entrada</li>
          </ul>
          <ModalFooter>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={() => setIsModalOpen(false)}>
              Confirmar
            </Button>
          </ModalFooter>
        </Modal>
      </section>

      {/* Tooltip */}
      <section style={sectionStyles}>
        <h2 style={titleStyles}>Tooltip</h2>

        <HStack gap="lg">
          <Tooltip content="Tooltip acima" position="top">
            <Button variant="secondary">Top</Button>
          </Tooltip>
          <Tooltip content="Tooltip abaixo" position="bottom">
            <Button variant="secondary">Bottom</Button>
          </Tooltip>
          <Tooltip content="Tooltip à esquerda" position="left">
            <Button variant="secondary">Left</Button>
          </Tooltip>
          <Tooltip content="Tooltip à direita" position="right">
            <Button variant="secondary">Right</Button>
          </Tooltip>
        </HStack>
      </section>

      {/* Loading States */}
      <section style={sectionStyles}>
        <h2 style={titleStyles}>Loading States</h2>

        <h3 style={subtitleStyles}>Skeleton</h3>
        <VStack gap="sm" style={{ marginBottom: 'var(--spacing-6)', maxWidth: '400px' }}>
          <Skeleton variant="text" width="100%" />
          <Skeleton variant="text" width="80%" />
          <Skeleton variant="text" width="60%" />
        </VStack>

        <HStack gap="md" style={{ marginBottom: 'var(--spacing-6)' }}>
          <Skeleton variant="circle" width={48} height={48} />
          <VStack gap="sm" style={{ flex: 1 }}>
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="40%" />
          </VStack>
        </HStack>

        <Skeleton variant="rectangle" width="100%" height={120} style={{ marginBottom: 'var(--spacing-6)' }} />

        <h3 style={subtitleStyles}>Spinner</h3>
        <HStack gap="lg" align="center" style={{ marginBottom: 'var(--spacing-6)' }}>
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" />
          <Spinner size="lg" color="var(--color-primary)" />
        </HStack>

        <h3 style={subtitleStyles}>Loading Overlay</h3>
        <LoadingOverlay isLoading={false} text="Carregando dados...">
          <Card padding="lg" style={{ maxWidth: '300px' }}>
            <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>
              Conteúdo que pode ter um overlay de loading.
            </p>
          </Card>
        </LoadingOverlay>
      </section>

      {/* Layout Components */}
      <section style={sectionStyles}>
        <h2 style={titleStyles}>Layout Components</h2>

        <h3 style={subtitleStyles}>Stack (Horizontal)</h3>
        <HStack gap="sm" style={{ marginBottom: 'var(--spacing-6)' }}>
          <div style={{ padding: 'var(--spacing-4)', backgroundColor: 'var(--color-primary-subtle)', borderRadius: 'var(--radius-md)' }}>Item 1</div>
          <div style={{ padding: 'var(--spacing-4)', backgroundColor: 'var(--color-primary-subtle)', borderRadius: 'var(--radius-md)' }}>Item 2</div>
          <div style={{ padding: 'var(--spacing-4)', backgroundColor: 'var(--color-primary-subtle)', borderRadius: 'var(--radius-md)' }}>Item 3</div>
        </HStack>

        <h3 style={subtitleStyles}>Stack (Vertical)</h3>
        <VStack gap="sm" style={{ marginBottom: 'var(--spacing-6)', maxWidth: '200px' }}>
          <div style={{ padding: 'var(--spacing-4)', backgroundColor: 'var(--color-success-light)', borderRadius: 'var(--radius-md)', width: '100%' }}>Item 1</div>
          <div style={{ padding: 'var(--spacing-4)', backgroundColor: 'var(--color-success-light)', borderRadius: 'var(--radius-md)', width: '100%' }}>Item 2</div>
          <div style={{ padding: 'var(--spacing-4)', backgroundColor: 'var(--color-success-light)', borderRadius: 'var(--radius-md)', width: '100%' }}>Item 3</div>
        </VStack>

        <h3 style={subtitleStyles}>Grid</h3>
        <Grid cols={4} gap="sm" style={{ marginBottom: 'var(--spacing-6)' }}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div
              key={n}
              style={{
                padding: 'var(--spacing-4)',
                backgroundColor: 'var(--color-warning-light)',
                borderRadius: 'var(--radius-md)',
                textAlign: 'center',
              }}
            >
              {n}
            </div>
          ))}
        </Grid>

        <h3 style={subtitleStyles}>Divider</h3>
        <VStack gap="md" style={{ maxWidth: '400px' }}>
          <p style={{ margin: 0 }}>Conteúdo acima</p>
          <Divider />
          <p style={{ margin: 0 }}>Conteúdo abaixo</p>
        </VStack>
      </section>

      {/* Table */}
      <section style={sectionStyles}>
        <h2 style={titleStyles}>Table</h2>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead sortable sortDirection="asc">Nome</TableHead>
              <TableHead sortable>Status</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow clickable zebra index={0}>
              <TableCell>Contrato #001</TableCell>
              <TableCell><Badge variant="success">Ativo</Badge></TableCell>
              <TableCell>R$ 1.500,00</TableCell>
              <TableCell>
                <Button size="sm" variant="ghost">Ver</Button>
              </TableCell>
            </TableRow>
            <TableRow clickable zebra index={1}>
              <TableCell>Contrato #002</TableCell>
              <TableCell><Badge variant="warning">Pendente</Badge></TableCell>
              <TableCell>R$ 2.300,00</TableCell>
              <TableCell>
                <Button size="sm" variant="ghost">Ver</Button>
              </TableCell>
            </TableRow>
            <TableRow clickable zebra index={2}>
              <TableCell>Contrato #003</TableCell>
              <TableCell><Badge variant="error">Inadimplente</Badge></TableCell>
              <TableCell>R$ 890,00</TableCell>
              <TableCell>
                <Button size="sm" variant="ghost">Ver</Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </section>

      {/* Empty State */}
      <section style={sectionStyles}>
        <h2 style={titleStyles}>Empty State</h2>

        <EmptyState
          title="Nenhum resultado encontrado"
          description="Tente ajustar os filtros ou fazer uma nova busca com termos diferentes."
          action={<Button>Limpar Filtros</Button>}
        />
      </section>

      {/* Color Tokens */}
      <section style={sectionStyles}>
        <h2 style={titleStyles}>Color Tokens</h2>

        <h3 style={subtitleStyles}>Primary</h3>
        <HStack gap="xs" wrap style={{ marginBottom: 'var(--spacing-6)' }}>
          {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
            <div
              key={shade}
              style={{
                width: '60px',
                height: '60px',
                backgroundColor: `var(--color-primary-${shade})`,
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: shade > 400 ? 'white' : 'black',
                fontSize: 'var(--text-xs)',
              }}
            >
              {shade}
            </div>
          ))}
        </HStack>

        <h3 style={subtitleStyles}>Slate (Neutral)</h3>
        <HStack gap="xs" wrap style={{ marginBottom: 'var(--spacing-6)' }}>
          {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
            <div
              key={shade}
              style={{
                width: '60px',
                height: '60px',
                backgroundColor: `var(--color-slate-${shade})`,
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: shade > 400 ? 'white' : 'black',
                fontSize: 'var(--text-xs)',
              }}
            >
              {shade}
            </div>
          ))}
        </HStack>

        <h3 style={subtitleStyles}>Semantic</h3>
        <HStack gap="md" wrap>
          <VStack gap="xs">
            <div style={{ width: '80px', height: '40px', backgroundColor: 'var(--color-success-light)', borderRadius: 'var(--radius-md)' }} />
            <div style={{ width: '80px', height: '40px', backgroundColor: 'var(--color-success)', borderRadius: 'var(--radius-md)' }} />
            <div style={{ width: '80px', height: '40px', backgroundColor: 'var(--color-success-dark)', borderRadius: 'var(--radius-md)' }} />
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>Success</span>
          </VStack>
          <VStack gap="xs">
            <div style={{ width: '80px', height: '40px', backgroundColor: 'var(--color-warning-light)', borderRadius: 'var(--radius-md)' }} />
            <div style={{ width: '80px', height: '40px', backgroundColor: 'var(--color-warning)', borderRadius: 'var(--radius-md)' }} />
            <div style={{ width: '80px', height: '40px', backgroundColor: 'var(--color-warning-dark)', borderRadius: 'var(--radius-md)' }} />
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>Warning</span>
          </VStack>
          <VStack gap="xs">
            <div style={{ width: '80px', height: '40px', backgroundColor: 'var(--color-error-light)', borderRadius: 'var(--radius-md)' }} />
            <div style={{ width: '80px', height: '40px', backgroundColor: 'var(--color-error)', borderRadius: 'var(--radius-md)' }} />
            <div style={{ width: '80px', height: '40px', backgroundColor: 'var(--color-error-dark)', borderRadius: 'var(--radius-md)' }} />
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>Error</span>
          </VStack>
          <VStack gap="xs">
            <div style={{ width: '80px', height: '40px', backgroundColor: 'var(--color-info-light)', borderRadius: 'var(--radius-md)' }} />
            <div style={{ width: '80px', height: '40px', backgroundColor: 'var(--color-info)', borderRadius: 'var(--radius-md)' }} />
            <div style={{ width: '80px', height: '40px', backgroundColor: 'var(--color-info-dark)', borderRadius: 'var(--radius-md)' }} />
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>Info</span>
          </VStack>
        </HStack>
      </section>

      {/* Typography */}
      <section style={sectionStyles}>
        <h2 style={titleStyles}>Typography</h2>

        <VStack gap="md" align="start">
          <span style={{ fontSize: 'var(--text-4xl)', fontWeight: 700 }}>Text 4XL (36px)</span>
          <span style={{ fontSize: 'var(--text-3xl)', fontWeight: 700 }}>Text 3XL (30px)</span>
          <span style={{ fontSize: 'var(--text-2xl)', fontWeight: 600 }}>Text 2XL (24px)</span>
          <span style={{ fontSize: 'var(--text-xl)', fontWeight: 600 }}>Text XL (20px)</span>
          <span style={{ fontSize: 'var(--text-lg)', fontWeight: 500 }}>Text LG (18px)</span>
          <span style={{ fontSize: 'var(--text-base)' }}>Text Base (16px)</span>
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>Text SM (14px)</span>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Text XS (12px)</span>
        </VStack>
      </section>

      {/* Spacing */}
      <section style={sectionStyles}>
        <h2 style={titleStyles}>Spacing</h2>

        <HStack gap="md" wrap align="end">
          {[1, 2, 3, 4, 5, 6, 8, 10, 12].map((n) => (
            <VStack key={n} gap="xs" align="center">
              <div
                style={{
                  width: `var(--spacing-${n})`,
                  height: `var(--spacing-${n})`,
                  backgroundColor: 'var(--color-primary)',
                  borderRadius: 'var(--radius-sm)',
                }}
              />
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                {n}
              </span>
            </VStack>
          ))}
        </HStack>
      </section>
    </Container>
  );
}
