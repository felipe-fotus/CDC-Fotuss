import type { CriticalityLevel } from '../types/contract';

/**
 * Determina o nível de criticidade com base nos dias em atraso.
 * Faixas:
 * - low: Até D+60
 * - medium: D+61 até D+70
 * - high: D+71 até D+89
 * - critical: D+90 ou superior
 */
export function getCriticalityLevel(diasAtraso: number): CriticalityLevel {
  if (diasAtraso <= 60) {
    return 'low';
  }
  if (diasAtraso <= 70) {
    return 'medium';
  }
  if (diasAtraso < 90) {
    return 'high';
  }
  return 'critical';
}

/**
 * Retorna a cor de fundo da linha baseada na criticidade.
 */
export function getCriticalityRowStyle(level: CriticalityLevel): React.CSSProperties {
  const styles: Record<CriticalityLevel, React.CSSProperties> = {
    low: {
      borderLeft: '3px solid var(--color-criticality-low-border)',
    },
    medium: {
      borderLeft: '3px solid var(--color-criticality-medium-border)',
      backgroundColor: 'rgba(254, 252, 232, 0.3)',
    },
    high: {
      borderLeft: '3px solid var(--color-criticality-high-border)',
      backgroundColor: 'rgba(255, 247, 237, 0.4)',
    },
    critical: {
      borderLeft: '3px solid var(--color-criticality-critical-border)',
      backgroundColor: 'rgba(254, 242, 242, 0.4)',
    },
  };

  return styles[level];
}

/**
 * Retorna o variant do Badge baseado na criticidade.
 */
export function getCriticalityBadgeVariant(level: CriticalityLevel): 'low' | 'medium' | 'high' | 'critical' {
  return level;
}
