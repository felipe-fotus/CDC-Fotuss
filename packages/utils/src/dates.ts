/**
 * Formata data para exibicao (DD/MM/YYYY)
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('pt-BR');
}

/**
 * Formata data completa (DD/MM/YYYY HH:mm)
 */
export function formatDateTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('pt-BR');
}

/**
 * Calcula dias de atraso a partir de uma data
 */
export function calculateDelayDays(dueDate: string | Date): number {
  const due = typeof dueDate === 'string' ? new Date(dueDate) : new Date(dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - due.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return Math.max(0, diffDays);
}

/**
 * Verifica se uma data esta vencida
 */
export function isOverdue(dueDate: string | Date): boolean {
  return calculateDelayDays(dueDate) > 0;
}

/**
 * Retorna data formatada para API (YYYY-MM-DD)
 */
export function toAPIDate(date: Date): string {
  return date.toISOString().split('T')[0];
}
