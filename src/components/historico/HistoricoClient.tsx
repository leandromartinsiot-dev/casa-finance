'use client'

import { useState, useMemo } from 'react'
import { Receipt, Fuel, ShoppingBag, Filter } from 'lucide-react'
import { ExportMenu }  from '@/components/ui/ExportMenu'
import { Filters }     from '@/components/ui/Filters'
import { fmt }         from '@/lib/utils/currency'
import { exportToCSV, exportToPDF } from '@/lib/utils/export'
import { cn }          from '@/lib/utils/cn'

type Entry = {
  id: string
  tipo: 'conta' | 'combustivel' | 'compra'
  subtipo: string
  descricao: string
  valor: number
  data: string
  pago: boolean
}

const TIPO_CONFIG = {
  conta:       { icon: Receipt,     color: 'text-amber-600', bg: 'bg-amber-50',  label: 'Conta'       },
  combustivel: { icon: Fuel,        color: 'text-blue-600',  bg: 'bg-blue-50',   label: 'Combustível' },
  compra:      { icon: ShoppingBag, color: 'text-green-600', bg: 'bg-green-50',  label: 'Compra'      },
}

const hoje = new Date()
const DEFAULT_RANGE = {
  from: new Date(hoje.getFullYear(), hoje.getMonth() - 2, 1).toISOString().split('T')[0],
  to:   hoje.toISOString().split('T')[0],
}

export function HistoricoClient({ entries }: { entries: Entry[] }) {
  const [dateRange, setDateRange] = useState(DEFAULT_RANGE)
  const [categoria, setCategoria] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const filtered = useMemo(() => {
    const from = new Date(dateRange.from)
    const to   = new Date(dateRange.to)
    return entries.filter((e) => {
      const d = new Date(e.data)
      return d >= from && d <= to && (!categoria || e.tipo === categoria)
    })
  }, [entries, dateRange, categoria])

  const totalFiltrado = filtered.reduce((s, e) => s + e.valor, 0)

  const grouped = useMemo(() => {
    const map = new Map<string, Entry[]>()
    filtered.forEach((e) => {
      const key = new Date(e.data).toLocaleDateString('pt-PT', {
        month: 'long', year: 'numeric',
      })
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(e)
    })
    return map
  }, [filtered])

  function handleExportCSV() {
    exportToCSV(filtered, [
      { key: 'data',      label: 'Data'       },
      { key: 'tipo',      label: 'Categoria'  },
      { key: 'descricao', label: 'Descrição'  },
      { key: 'valor',     label: 'Valor (€)', format: (v) => Number(v).toFixed(2) },
      { key: 'pago',      label: 'Pago',      format: (v) => v ? 'Sim' : 'Não'   },
    ], `historico_${dateRange.from}_${dateRange.to}`)
  }

  function handleExportPDF() {
    const rows = filtered.map((e) => `
      <tr>
        <td>${new Date(e.data).toLocaleDateString('pt-PT')}</td>
        <td>${TIPO_CONFIG[e.tipo].label}</td>
        <td>${e.descricao}</td>
        <td style="text-align:right">${fmt(e.valor)}</td>
      </tr>`).join('')
    exportToPDF('Histórico de Despesas', `
      <h1>Histórico de Despesas</h1>
      <p class="sub">${dateRange.from} → ${dateRange.to} · Total: ${fmt(totalFiltrado)}</p>
      <table>
        <thead><tr><th>Data</th><th>Categoria</th><th>Descrição</th><th>Valor</th></tr></thead>
        <tbody>${rows}</tbody>
        <tfoot><tr><td colspan="3">Total</td><td style="text-align:right">${fmt(totalFiltrado)}</td></tr></tfoot>
      </table>`)
  }

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Histórico</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {filtered.length} registos ·{' '}
            <span className="font-semibold text-slate-700">{fmt(totalFiltrado)}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters((p) => !p)}
            className={cn(
              'flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border',
              'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors',
              showFilters && 'bg-green-50 border-green-200 text-green-700',
            )}
          >
            <Filter size={15} />
            Filtros
          </button>
          <ExportMenu onExportCSV={handleExportCSV} onExportPDF={handleExportPDF}
            disabled={!filtered.length} />
        </div>
      </div>

      {showFilters && (
        <Filters
          dateRange={dateRange} onDateChange={setDateRange}
          category={categoria} onCategoryChange={setCategoria}
          categoryOptions={[
            { value: 'conta',       label: '🧾 Contas'      },
            { value: 'combustivel', label: '⛽ Combustível' },
            { value: 'compra',      label: '🛍️ Compras'    },
          ]}
        />
      )}

      <div className="grid grid-cols-3 gap-3">
        {(['conta', 'combustivel', 'compra'] as const).map((tipo) => {
          const cfg   = TIPO_CONFIG[tipo]
          const Icon  = cfg.icon
          const total = filtered.filter((e) => e.tipo === tipo)
                                .reduce((s, e) => s + e.valor, 0)
          return (
            <button
              key={tipo}
              onClick={() => setCategoria((p) => p === tipo ? '' : tipo)}
              className={cn(
                'flex flex-col p-3 rounded-xl border transition-all text-left',
                categoria === tipo
                  ? 'border-green-300 bg-green-50 shadow-sm'
                  : 'border-slate-200 bg-white hover:bg-slate-50',
              )}
            >
              <div className={cn('p-1.5 rounded-lg w-fit mb-2', cfg.bg)}>
                <Icon size={14} className={cfg.color} />
              </div>
              <span className="text-xs text-slate-500">{cfg.label}</span>
              <span className="text-sm font-bold text-slate-800 font-mono mt-0.5">
                {fmt(total)}
              </span>
            </button>
          )
        })}
      </div>

      {grouped.size === 0 ? (
        <div className="text-center py-16 text-slate-400 text-sm">
          Sem registos no período seleccionado
        </div>
      ) : (
        Array.from(grouped.entries()).map(([mes, items]) => {
          const totalMes = items.reduce((s, e) => s + e.valor, 0)
          return (
            <div key={mes}>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wide capitalize">
                  {mes}
                </h2>
                <span className="text-xs font-mono font-semibold text-slate-600">
                  {fmt(totalMes)}
                </span>
              </div>
              <div className="bg-white rounded-xl border border-slate-200
                              shadow-sm overflow-hidden divide-y divide-slate-100">
                {items.map((e) => {
                  const cfg  = TIPO_CONFIG[e.tipo]
                  const Icon = cfg.icon
                  return (
                    <div key={e.id} className="flex items-center gap-3 px-4 py-3">
                      <div className={cn('p-2 rounded-lg shrink-0', cfg.bg)}>
                        <Icon size={15} className={cfg.color} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate">
                          {e.descricao}
                        </p>
                        <p className="text-xs text-slate-400">
                          {new Date(e.data).toLocaleDateString('pt-PT')}
                          {!e.pago && (
                            <span className="ml-2 text-amber-600 font-medium">pendente</span>
                          )}
                        </p>
                      </div>
                      <span className="text-sm font-mono font-semibold text-slate-800 shrink-0">
                        {fmt(e.valor)}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}
