export function fmt(value: number, compact = false): string {
  return new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: 'EUR',
    notation: compact && value >= 1000 ? 'compact' : 'standard',
    maximumFractionDigits: 2,
  }).format(value)
}
