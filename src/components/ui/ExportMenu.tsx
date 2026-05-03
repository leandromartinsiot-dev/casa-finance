'use client'

import { useState, useRef, useEffect } from 'react'
import { Download, FileText, FileSpreadsheet } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

type Props = {
  onExportCSV: () => void
  onExportPDF: () => void
  disabled?: boolean
}

export function ExportMenu({ onExportCSV, onExportPDF, disabled }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        disabled={disabled}
        className={cn(
          'flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border',
          'border-slate-200 bg-white text-slate-600',
          'hover:bg-slate-50 transition-colors disabled:opacity-40',
        )}
      >
        <Download size={15} />
        Exportar
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl
                        border border-slate-200 shadow-lg z-20 py-1 overflow-hidden">
          <button
            onClick={() => { onExportCSV(); setOpen(false) }}
            className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm
                       text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <FileSpreadsheet size={15} className="text-green-600" />
            Exportar CSV
          </button>
          <button
            onClick={() => { onExportPDF(); setOpen(false) }}
            className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm
                       text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <FileText size={15} className="text-red-500" />
            Exportar PDF
          </button>
        </div>
      )}
    </div>
  )
}
