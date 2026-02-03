import type { CriticalityLevel } from '@cdc-fotus/types';

interface CriticalityInput {
  diasAtraso: number;
  valorAtraso: number;
}

/**
 * Determina o nivel de criticidade baseado em dias e valor
 */
export function getCriticalityLevel(input: CriticalityInput): CriticalityLevel {
  const { diasAtraso, valorAtraso } = input;

  // Critico: dias >= 180 OU valor >= 50000
  if (diasAtraso >= 180 || valorAtraso >= 50000) {
    return 'critical';
  }

  // Alto: dias >= 90 OU valor >= 20000
  if (diasAtraso >= 90 || valorAtraso >= 20000) {
    return 'high';
  }

  // Medio: dias >= 30 OU valor >= 5000
  if (diasAtraso >= 30 || valorAtraso >= 5000) {
    return 'medium';
  }

  // Baixo: default
  return 'low';
}

/**
 * Retorna label em portugues para criticidade
 */
export function getCriticalityLabel(level: CriticalityLevel): string {
  const labels: Record<CriticalityLevel, string> = {
    low: 'Baixo',
    medium: 'Medio',
    high: 'Alto',
    critical: 'Critico',
  };
  return labels[level];
}

/**
 * Determina faixa de atraso baseado em dias
 */
export function getDelayRange(days: number): string {
  if (days <= 30) return 'D+30';
  if (days <= 60) return 'D+60';
  if (days <= 90) return 'D+90';
  if (days <= 120) return 'D+120';
  if (days <= 150) return 'D+150';
  if (days <= 180) return 'D+180';
  if (days <= 360) return 'D+360';
  if (days <= 540) return 'D+540';
  if (days <= 720) return 'D+720';
  if (days <= 900) return 'D+900';
  return 'D+1080';
}
