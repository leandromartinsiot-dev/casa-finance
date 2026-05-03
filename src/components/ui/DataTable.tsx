import { cn } from '@/lib/utils/cn'

type Column<T> = {
  key: string
  label: string
  render?: (row: T) => React.ReactNode
  align?: 'left' | 'right' | 'center'
  hideOnMobile?: boolean
}

type Props<T> = {
  columns: Column<T>[]
  data: T[]
  keyExtractor: (row: T) => string
  loading?: boolean
  emptyMessage?: string
  onRowClick?: (row: T) => void
}

export function DataTable<T>({
  columns, data, keyExtractor, loading, emptyMessage = 'Sem registos', onRowClick,
}: Props<T>) {
  if (loading) {
    return (
      <div className="space-y-2 p-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 bg-slate-100 rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  if (!data.length) {
    return (
      <div className="text-center py-12 text-slate-400 text-sm">
        {emptyMessage}
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  'px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide',
                  col.align === 'right'  && 'text-right',
                  col.align === 'center' && 'text-center',
                  col.hideOnMobile       && 'hidden md:table-cell',
                )}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.map((row) => (
            <tr
              key={keyExtractor(row)}
              onClick={() => onRowClick?.(row)}
              className={cn(
                'transition-colors',
                onRowClick && 'cursor-pointer hover:bg-slate-50',
              )}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={cn(
                    'px-4 py-3 text-slate-700',
                    col.align === 'right'  && 'text-right',
                    col.align === 'center' && 'text-center',
                    col.hideOnMobile       && 'hidden md:table-cell',
                  )}
                >
                  {col.render ? col.render(row) : String((row as any)[col.key] ?? '—')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
