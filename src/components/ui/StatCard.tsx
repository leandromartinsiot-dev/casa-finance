import { cn } from '@/lib/utils/cn'
import type { LucideIcon } from 'lucide-react'

type Props = {
  label: string
  value: string
  sub?: string
  icon: LucideIcon
  variant?: 'default' | 'success' | 'warning' | 'danger'
  loading?: boolean
}

const VARIANTS = {
  default: 'bg-slate-50  text-slate-600  border-slate-200',
  success: 'bg-green-50  text-green-600  border-green-200',
  warning: 'bg-amber-50  text-amber-600  border-amber-200',
  danger:  'bg-red-50    text-red-600    border-red-200',
}

export function StatCard({ label, value, sub, icon: Icon, variant = 'default', loading }: Props) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 md:p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide truncate">
            {label}
          </p>
          {loading ? (
            <div className="h-7 w-28 bg-slate-100 animate-pulse rounded mt-1.5" />
          ) : (
            <p className="text-2xl font-bold text-slate-900 mt-0.5 font-mono tabular-nums">
              {value}
            </p>
          )}
          {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
        </div>
        <div className={cn('p-2.5 rounded-lg border shrink-0', VARIANTS[variant])}>
          <Icon size={20} />
        </div>
      </div>
    </div>
  )
}
