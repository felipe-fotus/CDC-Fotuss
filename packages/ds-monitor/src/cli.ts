#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pc from 'picocolors';
import { DSAnalyzer } from './analyzer.js';
import { DSReporter } from './reporter.js';
import type { MonitorConfig } from './types.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'report';

  // Find project root (where pnpm-workspace.yaml is)
  let projectRoot = process.cwd();
  while (!fs.existsSync(path.join(projectRoot, 'pnpm-workspace.yaml'))) {
    const parent = path.dirname(projectRoot);
    if (parent === projectRoot) {
      console.error(pc.red('Erro: Não foi possível encontrar a raiz do projeto (pnpm-workspace.yaml)'));
      process.exit(1);
    }
    projectRoot = parent;
  }

  const config: MonitorConfig = {
    frontendPath: path.join(projectRoot, 'frontend'),
    dsPackageName: '@cdc-fotus/design-system',
    localComponentsPath: 'src/components/ui',
    outputPath: path.join(projectRoot, 'docs'),
  };

  console.log(pc.dim(`\nAnalisando: ${config.frontendPath}\n`));

  const analyzer = new DSAnalyzer(config);
  const report = await analyzer.analyze();
  const reporter = new DSReporter(report);

  switch (command) {
    case 'report':
    case 'r':
      reporter.printConsole();
      break;

    case 'json':
    case 'j':
      console.log(reporter.toJSON());
      break;

    case 'markdown':
    case 'md':
    case 'm':
      console.log(reporter.toMarkdown());
      break;

    case 'save':
    case 's':
      // Save markdown report
      const outputDir = config.outputPath || projectRoot;
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      const mdPath = path.join(outputDir, 'DS-MONITOR-REPORT.md');
      fs.writeFileSync(mdPath, reporter.toMarkdown());
      console.log(pc.green(`✅ Relatório salvo em: ${mdPath}`));

      // Save JSON for CI/tooling
      const jsonPath = path.join(outputDir, 'ds-monitor-report.json');
      fs.writeFileSync(jsonPath, reporter.toJSON());
      console.log(pc.green(`✅ JSON salvo em: ${jsonPath}`));
      break;

    case 'check':
    case 'c':
      // CI mode - fail if duplicates exist
      reporter.printConsole();
      if (report.summary.duplicatesCount > 0) {
        console.log(pc.red(`\n❌ Falha: ${report.summary.duplicatesCount} componente(s) duplicado(s) encontrado(s).`));
        console.log(pc.yellow('   Migre os componentes locais para usar o Design System.\n'));
        process.exit(1);
      }
      if (report.summary.coveragePercent < 50) {
        console.log(pc.yellow(`\n⚠️  Aviso: Cobertura do DS abaixo de 50% (${report.summary.coveragePercent}%)\n`));
      }
      console.log(pc.green('\n✅ Verificação passou!\n'));
      break;

    case 'help':
    case 'h':
    case '--help':
    case '-h':
      printHelp();
      break;

    default:
      console.log(pc.red(`Comando desconhecido: ${command}`));
      printHelp();
      process.exit(1);
  }
}

function printHelp() {
  console.log(`
${pc.bold('DS Monitor')} - Monitoramento de uso do Design System

${pc.bold('Uso:')}
  pnpm ds:monitor [comando]

${pc.bold('Comandos:')}
  ${pc.cyan('report, r')}     Exibe relatório no console (padrão)
  ${pc.cyan('json, j')}       Exibe relatório em JSON
  ${pc.cyan('markdown, m')}   Exibe relatório em Markdown
  ${pc.cyan('save, s')}       Salva relatórios em docs/
  ${pc.cyan('check, c')}      Modo CI - falha se houver duplicados
  ${pc.cyan('help, h')}       Exibe esta ajuda

${pc.bold('Exemplos:')}
  pnpm ds:monitor           # Relatório no console
  pnpm ds:monitor save      # Salva em docs/
  pnpm ds:monitor check     # Para uso em CI/CD
`);
}

main().catch(err => {
  console.error(pc.red('Erro:'), err);
  process.exit(1);
});
