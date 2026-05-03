'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

type Props = {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
}

const SIZES = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-2xl' }

export function Modal({ open, onClose, title, children, size = 'md' }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className={cn(
        'relative w-full bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl',
        SIZES[size],
      )}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <h2 className="text-base font-semibold text-slate-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400
                       hover:text-slate-700 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <div className="px-5 py-4 max-h-[80vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  )
}
