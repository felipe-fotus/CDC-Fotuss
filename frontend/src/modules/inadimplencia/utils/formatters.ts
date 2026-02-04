/**
 * Formata um valor numérico para moeda brasileira (R$).
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

/**
 * Formata uma data ISO para o formato brasileiro (DD/MM/AAAA).
 */
export function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

/**
 * Formata os dias em atraso (apenas o numero).
 */
export function formatDaysOverdue(days: number): string {
  return String(days);
}

/**
 * Trunca texto com ellipsis se exceder o limite.
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength - 3) + '...';
}
