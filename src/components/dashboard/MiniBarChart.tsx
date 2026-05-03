'use client'

import { fmt } from '@/lib/utils/currency'

type Bar = { label: string; value: number }

export function MiniBarChart({ data }: { data: Bar[] }) {
  const max = Math.max(...data.map((d) => d.value), 1)

  return (
    <div className="flex items-end gap-2 h-40">
      {data.map((bar, i) => {
        const pct    = (bar.value / max) * 100
        const isLast = i === data.length - 1
        return (
          <div key={bar.label} className="flex flex-col items-center flex-1 gap-1">
            <span className="text-[10px] text-slate-400 font-mono">
              {bar.value > 0 ? fmt(bar.value, true) : ''}
            </span>
            <div className="w-full flex items-end" style={{ height: '100px' }}>
              <div
                className="w-full rounded-t-md transition-all duration-500"
                style={{
                  height: `${Math.max(pct, 4)}%`,
                  backgroundColor: isLast ? '#16a34a' : '#e2e8f0',
                }}
              />
            </div>
            <span className="text-[10px] text-slate-500 capitalize">{bar.label}</span>
          </div>
        )
      })}
    </div>
  )
}
