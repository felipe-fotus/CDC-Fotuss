/**
 * Retorna a data de ontem formatada (D-1).
 */
export function getYesterdayDate(): string {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(yesterday);
}

/**
 * Calcula a diferença em dias entre duas datas.
 */
export function daysBetween(date1: Date, date2: Date): number {
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Gera uma data aleatória no passado baseada nos dias de atraso.
 */
export function generateDueDateFromDaysOverdue(daysOverdue: number): string {
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() - daysOverdue);
  return dueDate.toISOString().split('T')[0];
}
