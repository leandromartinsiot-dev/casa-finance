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
    <div className="bg-white rounded-xl border border-slate-200 p-3 md:p-5 shadow-sm">
      <div className="flex flex-col gap-2">
        {/* Ícone e label */}
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            {label}
          </p>
          <div className={cn('p-1.5 rounded-lg border shrink-0', VARIANTS[variant])}>
            <Icon size={16} />
          </div>
        </div>

        {/* Valor */}
        {loading ? (
          <div className="h-7 w-full bg-slate-100 animate-pulse rounded" />
        ) : (
          <p className="text-xl md:text-2xl font-bold text-slate-900 font-mono tabular-nums break-all">
            {value}
          </p>
        )}

        {/* Sub */}
        {sub && <p className="text-xs text-slate-400">{sub}</p>}
      </div>
    </div>
  )
}
