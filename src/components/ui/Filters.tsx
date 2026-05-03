'use client'

type Props = {
  onDateChange: (range: { from: string; to: string }) => void
  onCategoryChange?: (value: string) => void
  categoryOptions?: { value: string; label: string }[]
  dateRange: { from: string; to: string }
  category?: string
}

const QUICK_RANGES = [
  { label: 'Este mês',        days: 0   },
  { label: 'Últimos 30 dias', days: 30  },
  { label: 'Últimos 90 dias', days: 90  },
  { label: 'Este ano',        days: 365 },
]

export function Filters({
  onDateChange, onCategoryChange, categoryOptions, dateRange, category,
}: Props) {
  function applyQuickRange(days: number) {
    const to   = new Date()
    const from = days === 0
      ? new Date(to.getFullYear(), to.getMonth(), 1)
      : new Date(Date.now() - days * 86_400_000)
    onDateChange({
      from: from.toISOString().split('T')[0],
      to:   to.toISOString().split('T')[0],
    })
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
      <div className="flex flex-wrap gap-2">
        {QUICK_RANGES.map((r) => (
          <button
            key={r.label}
            onClick={() => applyQuickRange(r.days)}
            className="text-xs px-3 py-1.5 rounded-full border border-slate-200
                       hover:bg-green-50 hover:border-green-200 hover:text-green-700
                       transition-colors text-slate-600"
          >
            {r.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-2 flex-1">
          <input
            type="date"
            value={dateRange.from}
            onChange={(e) => onDateChange({ ...dateRange, from: e.target.value })}
            className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-green-500/30"
          />
          <span className="self-center text-slate-400 text-sm">até</span>
          <input
            type="date"
            value={dateRange.to}
            onChange={(e) => onDateChange({ ...dateRange, to: e.target.value })}
            className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-green-500/30"
          />
        </div>

        {categoryOptions && onCategoryChange && (
          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="px-3 py-2 text-sm border border-slate-200 rounded-lg
                       bg-white focus:outline-none focus:ring-2 focus:ring-green-500/30"
          >
            <option value="">Todas as categorias</option>
            {categoryOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        )}
      </div>
    </div>
  )
}
