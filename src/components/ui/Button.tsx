import { cn } from '@/lib/utils/cn'
import { Loader2 } from 'lucide-react'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: React.ReactNode
}

const VARIANTS = {
  primary:   'bg-green-600 text-white hover:bg-green-700 shadow-sm',
  secondary: 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50',
  danger:    'bg-red-600 text-white hover:bg-red-700',
  ghost:     'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
}

const SIZES = {
  sm: 'text-xs px-3 py-1.5 gap-1.5',
  md: 'text-sm px-4 py-2.5 gap-2',
  lg: 'text-base px-5 py-3 gap-2',
}

export function Button({
  variant = 'primary', size = 'md', loading, icon, children, className, disabled, ...props
}: Props) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-lg',
        'transition-all duration-150 focus:outline-none focus:ring-2',
        'focus:ring-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed',
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
    >
      {loading ? <Loader2 size={14} className="animate-spin" /> : icon}
      {children}
    </button>
  )
}
