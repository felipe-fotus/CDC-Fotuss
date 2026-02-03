import fs from 'fs';
import path from 'path';
import fg from 'fast-glob';
import type { ComponentUsage, LocalComponent, MonitorConfig, MonitorReport } from './types.js';

// Componentes disponíveis no Design System
const DS_COMPONENTS = {
  base: [
    'Button',
    'Input',
    'Select',
    'Badge',
    'Card', 'CardHeader', 'CardBody', 'CardFooter',
    'Modal', 'ModalFooter',
    'Tooltip',
    'Skeleton', 'Spinner', 'LoadingOverlay',
    'Table', 'TableHeader', 'TableBody', 'TableRow', 'TableHead', 'TableCell',
    'EmptyState',
  ],
  layout: [
    'Container',
    'Stack', 'HStack', 'VStack',
    'Grid',
    'Divider',
    'Spacer',
  ],
  tokens: [
    'colors',
    'typography',
    'spacing',
    'borders',
    'breakpoints',
    'shadows',
  ],
};

const ALL_DS_COMPONENTS = [...DS_COMPONENTS.base, ...DS_COMPONENTS.layout];

export class DSAnalyzer {
  private config: MonitorConfig;
  private usages: ComponentUsage[] = [];
  private localComponents: LocalComponent[] = [];

  constructor(config: MonitorConfig) {
    this.config = config;
  }

  async analyze(): Promise<MonitorReport> {
    // 1. Encontrar todos os arquivos TSX/TS no frontend
    const files = await this.findSourceFiles();

    // 2. Analisar cada arquivo
    for (const file of files) {
      await this.analyzeFile(file);
    }

    // 3. Encontrar componentes locais
    await this.findLocalComponents();

    // 4. Gerar relatório
    return this.generateReport();
  }

  private async findSourceFiles(): Promise<string[]> {
    const pattern = path.join(this.config.frontendPath, 'src/**/*.{tsx,ts}').replace(/\\/g, '/');
    return fg(pattern, {
      ignore: ['**/*.test.*', '**/*.spec.*', '**/node_modules/**'],
    });
  }

  private async analyzeFile(filePath: string): Promise<void> {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    // Detectar imports do Design System
    const dsImportRegex = new RegExp(
      `import\\s*{([^}]+)}\\s*from\\s*['"]${this.config.dsPackageName}['"]`,
      'g'
    );

    // Detectar imports locais de componentes
    const localImportRegex = /import\s*{([^}]+)}\s*from\s*['"]\.\.?\/.*components\/ui\/([^'"]+)['"]/g;

    lines.forEach((line, index) => {
      // Check DS imports
      let match;
      while ((match = dsImportRegex.exec(line)) !== null) {
        const imports = match[1].split(',').map(i => i.trim().split(' as ')[0].trim());
        imports.forEach(componentName => {
          if (ALL_DS_COMPONENTS.includes(componentName)) {
            this.usages.push({
              component: componentName,
              file: filePath,
              line: index + 1,
              source: 'design-system',
            });
          }
        });
      }

      // Check local imports
      while ((match = localImportRegex.exec(line)) !== null) {
        const imports = match[1].split(',').map(i => i.trim().split(' as ')[0].trim());
        imports.forEach(componentName => {
          this.usages.push({
            component: componentName,
            file: filePath,
            line: index + 1,
            source: 'local',
          });
        });
      }
    });
  }

  private async findLocalComponents(): Promise<void> {
    const localPath = path.join(this.config.frontendPath, this.config.localComponentsPath).replace(/\\/g, '/');

    try {
      const files = await fg(`${localPath}/**/*.tsx`, {
        ignore: ['**/*.test.*', '**/*.spec.*'],
      });

      for (const file of files) {
        const fileName = path.basename(file, '.tsx');
        const hasDSEquivalent = ALL_DS_COMPONENTS.some(
          ds => ds.toLowerCase() === fileName.toLowerCase()
        );
        const dsEquivalent = ALL_DS_COMPONENTS.find(
          ds => ds.toLowerCase() === fileName.toLowerCase()
        );

        this.localComponents.push({
          name: fileName,
          path: file,
          hasDSEquivalent,
          dsEquivalent,
        });
      }
    } catch {
      // Local components path doesn't exist
    }
  }

  private generateReport(): MonitorReport {
    // Contar uso de cada componente DS
    const dsUsageMap = new Map<string, { count: number; files: Set<string> }>();

    ALL_DS_COMPONENTS.forEach(comp => {
      dsUsageMap.set(comp, { count: 0, files: new Set() });
    });

    this.usages
      .filter(u => u.source === 'design-system')
      .forEach(usage => {
        const entry = dsUsageMap.get(usage.component);
        if (entry) {
          entry.count++;
          entry.files.add(usage.file);
        }
      });

    // Componentes DS usados
    const usedDSComponents = Array.from(dsUsageMap.entries())
      .filter(([, data]) => data.count > 0)
      .map(([name, data]) => ({
        name,
        category: this.getComponentCategory(name),
        usageCount: data.count,
        usedIn: Array.from(data.files).map(f => path.relative(this.config.frontendPath, f)),
      }));

    // Componentes DS não usados
    const unusedDSComponents = Array.from(dsUsageMap.entries())
      .filter(([, data]) => data.count === 0)
      .map(([name]) => name);

    // Duplicados (componentes locais que tem equivalente no DS)
    const duplicates = this.localComponents
      .filter(lc => lc.hasDSEquivalent)
      .map(lc => ({
        localPath: path.relative(this.config.frontendPath, lc.path),
        dsComponent: lc.dsEquivalent!,
        recommendation: `Substituir por: import { ${lc.dsEquivalent} } from '${this.config.dsPackageName}'`,
      }));

    const coveragePercent = Math.round(
      (usedDSComponents.length / ALL_DS_COMPONENTS.length) * 100
    );

    return {
      timestamp: new Date().toISOString(),
      summary: {
        totalDSComponents: ALL_DS_COMPONENTS.length,
        usedDSComponents: usedDSComponents.length,
        coveragePercent,
        localComponentsCount: this.localComponents.length,
        duplicatesCount: duplicates.length,
      },
      dsComponents: usedDSComponents,
      localComponents: this.localComponents.map(lc => ({
        ...lc,
        path: path.relative(this.config.frontendPath, lc.path),
      })),
      duplicates,
      unusedDSComponents,
    };
  }

  private getComponentCategory(name: string): string {
    if (DS_COMPONENTS.base.includes(name)) return 'base';
    if (DS_COMPONENTS.layout.includes(name)) return 'layout';
    return 'unknown';
  }
}
