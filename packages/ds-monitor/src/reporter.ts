import pc from 'picocolors';
import type { MonitorReport } from './types.js';

export class DSReporter {
  private report: MonitorReport;

  constructor(report: MonitorReport) {
    this.report = report;
  }

  printConsole(): void {
    const { summary, dsComponents, duplicates, unusedDSComponents, localComponents } = this.report;

    console.log('\n' + pc.bold(pc.blue('═══════════════════════════════════════════════════════════')));
    console.log(pc.bold(pc.blue('                    DS MONITOR - RELATÓRIO                    ')));
    console.log(pc.bold(pc.blue('═══════════════════════════════════════════════════════════')) + '\n');

    // Summary
    console.log(pc.bold('📊 RESUMO\n'));

    const coverageColor = summary.coveragePercent >= 70 ? pc.green :
                          summary.coveragePercent >= 40 ? pc.yellow : pc.red;

    console.log(`   Componentes DS disponíveis: ${pc.cyan(String(summary.totalDSComponents))}`);
    console.log(`   Componentes DS em uso:      ${pc.cyan(String(summary.usedDSComponents))}`);
    console.log(`   Cobertura do DS:            ${coverageColor(summary.coveragePercent + '%')}`);
    console.log(`   Componentes locais:         ${pc.yellow(String(summary.localComponentsCount))}`);
    console.log(`   Duplicados detectados:      ${summary.duplicatesCount > 0 ? pc.red(String(summary.duplicatesCount)) : pc.green('0')}`);

    // Progress bar
    const barLength = 30;
    const filled = Math.round((summary.coveragePercent / 100) * barLength);
    const empty = barLength - filled;
    const progressBar = coverageColor('█'.repeat(filled)) + pc.gray('░'.repeat(empty));
    console.log(`\n   Adoção do DS: [${progressBar}] ${coverageColor(summary.coveragePercent + '%')}\n`);

    // Duplicates (urgent)
    if (duplicates.length > 0) {
      console.log(pc.bold(pc.red('\n⚠️  DUPLICADOS (componentes locais que deveriam usar o DS)\n')));
      duplicates.forEach(dup => {
        console.log(`   ${pc.red('•')} ${pc.yellow(dup.localPath)}`);
        console.log(`     ${pc.dim('→')} ${pc.green(dup.recommendation)}`);
      });
    }

    // DS Components in use
    if (dsComponents.length > 0) {
      console.log(pc.bold(pc.green('\n✅ COMPONENTES DS EM USO\n')));

      const byCategory = this.groupByCategory(dsComponents);
      for (const [category, components] of Object.entries(byCategory)) {
        console.log(`   ${pc.dim(category.toUpperCase())}`);
        components.forEach(comp => {
          console.log(`   ${pc.green('•')} ${pc.white(comp.name)} ${pc.dim(`(${comp.usageCount}x em ${comp.usedIn.length} arquivo${comp.usedIn.length > 1 ? 's' : ''})`)}`);
        });
        console.log('');
      }
    }

    // Unused DS Components
    if (unusedDSComponents.length > 0) {
      console.log(pc.bold(pc.yellow('\n📦 COMPONENTES DS DISPONÍVEIS (não utilizados)\n')));
      const chunks = this.chunkArray(unusedDSComponents, 5);
      chunks.forEach(chunk => {
        console.log(`   ${pc.dim(chunk.join(', '))}`);
      });
    }

    // Local components without DS equivalent
    const localOnly = localComponents.filter(lc => !lc.hasDSEquivalent);
    if (localOnly.length > 0) {
      console.log(pc.bold(pc.blue('\n📁 COMPONENTES LOCAIS (sem equivalente no DS)\n')));
      localOnly.forEach(lc => {
        console.log(`   ${pc.blue('•')} ${lc.name} ${pc.dim(`(${lc.path})`)}`);
      });
    }

    console.log('\n' + pc.dim(`Relatório gerado em: ${this.report.timestamp}`));
    console.log(pc.bold(pc.blue('\n═══════════════════════════════════════════════════════════\n')));
  }

  toMarkdown(): string {
    const { summary, dsComponents, duplicates, unusedDSComponents, localComponents } = this.report;

    let md = `# Design System Monitor - Relatório\n\n`;
    md += `> Gerado em: ${this.report.timestamp}\n\n`;

    // Summary
    md += `## 📊 Resumo\n\n`;
    md += `| Métrica | Valor |\n`;
    md += `|---------|-------|\n`;
    md += `| Componentes DS disponíveis | ${summary.totalDSComponents} |\n`;
    md += `| Componentes DS em uso | ${summary.usedDSComponents} |\n`;
    md += `| **Cobertura do DS** | **${summary.coveragePercent}%** |\n`;
    md += `| Componentes locais | ${summary.localComponentsCount} |\n`;
    md += `| Duplicados detectados | ${summary.duplicatesCount} |\n\n`;

    // Progress
    const emoji = summary.coveragePercent >= 70 ? '🟢' :
                  summary.coveragePercent >= 40 ? '🟡' : '🔴';
    md += `### Progresso de Adoção ${emoji}\n\n`;
    md += `\`\`\`\n`;
    md += `[${'█'.repeat(Math.round(summary.coveragePercent / 5))}${'░'.repeat(20 - Math.round(summary.coveragePercent / 5))}] ${summary.coveragePercent}%\n`;
    md += `\`\`\`\n\n`;

    // Duplicates
    if (duplicates.length > 0) {
      md += `## ⚠️ Duplicados (Ação Necessária)\n\n`;
      md += `Os seguintes componentes locais têm equivalentes no Design System e devem ser migrados:\n\n`;
      md += `| Componente Local | Equivalente DS | Ação |\n`;
      md += `|------------------|----------------|------|\n`;
      duplicates.forEach(dup => {
        md += `| \`${dup.localPath}\` | \`${dup.dsComponent}\` | Substituir import |\n`;
      });
      md += `\n`;
    }

    // DS Components in use
    if (dsComponents.length > 0) {
      md += `## ✅ Componentes DS em Uso\n\n`;
      const byCategory = this.groupByCategory(dsComponents);
      for (const [category, components] of Object.entries(byCategory)) {
        md += `### ${category.charAt(0).toUpperCase() + category.slice(1)}\n\n`;
        md += `| Componente | Uso | Arquivos |\n`;
        md += `|------------|-----|----------|\n`;
        components.forEach(comp => {
          md += `| ${comp.name} | ${comp.usageCount}x | ${comp.usedIn.length} |\n`;
        });
        md += `\n`;
      }
    }

    // Unused
    if (unusedDSComponents.length > 0) {
      md += `## 📦 Componentes DS Disponíveis (não utilizados)\n\n`;
      md += unusedDSComponents.map(c => `\`${c}\``).join(', ') + '\n\n';
    }

    // Local only
    const localOnly = localComponents.filter(lc => !lc.hasDSEquivalent);
    if (localOnly.length > 0) {
      md += `## 📁 Componentes Locais (sem equivalente no DS)\n\n`;
      localOnly.forEach(lc => {
        md += `- \`${lc.name}\` - ${lc.path}\n`;
      });
    }

    return md;
  }

  toJSON(): string {
    return JSON.stringify(this.report, null, 2);
  }

  private groupByCategory(components: typeof this.report.dsComponents) {
    return components.reduce((acc, comp) => {
      const cat = comp.category || 'other';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(comp);
      return acc;
    }, {} as Record<string, typeof components>);
  }

  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }
}
