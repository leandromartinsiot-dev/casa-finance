import { cn } from '@/lib/utils/cn'

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string
  error?: string
  hint?: string
}

export function FormField({ label, error, hint, className, ...props }: InputProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-slate-700">
        {label}
        {props.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        {...props}
        className={cn(
          'w-full px-3 py-2.5 rounded-lg border text-sm text-slate-900',
          'placeholder:text-slate-400 bg-white transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500',
          error
            ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20'
            : 'border-slate-200 hover:border-slate-300',
          className,
        )}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
      {hint && !error && <p className="text-xs text-slate-400">{hint}</p>}
    </div>
  )
}

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string
  error?: string
  options: { value: string; label: string }[]
}

export function FormSelect({ label, error, options, className, ...props }: SelectProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-slate-700">
        {label}
        {props.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        {...props}
        className={cn(
          'w-full px-3 py-2.5 rounded-lg border text-sm text-slate-900 bg-white',
          'focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500',
          error ? 'border-red-400' : 'border-slate-200',
          className,
        )}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
