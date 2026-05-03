'use client'

import { useState, useMemo } from 'react'
import { Plus, CheckCircle2, Circle } from 'lucide-react'
import { useExpenses }  from '@/hooks/useExpenses'
import { DataTable }    from '@/components/ui/DataTable'
import { Button }       from '@/components/ui/Button'
import { Modal }        from '@/components/ui/Modal'
import { Filters }      from '@/components/ui/Filters'
import { ExportMenu }   from '@/components/ui/ExportMenu'
import { ContaForm }    from '@/components/contas/ContaForm'
import { fmt }          from '@/lib/utils/currency'
import { exportToCSV, exportToPDF } from '@/lib/utils/export'
import type { Conta }   from '@/lib/types/domain.types'

const TIPOS = [
  { value: 'energia',  label: '⚡ Energia'  },
  { value: 'gas',      label: '🔥 Gás'      },
  { value: 'agua',     label: '💧 Água'     },
  { value: 'internet', label: '🌐 Internet' },
  { value: 'tv',       label: '📺 TV'       },
  { value: 'telefone', label: '📱 Telefone' },
]

type Props = { initialContas: Conta[]; isAdmin: boolean }

export function ContasClient({ isAdmin }: Props) {
  const { contas, isLoading, isPending, toggle, remove, totalPendente } = useExpenses()
  const [modalOpen, setModalOpen]   = useState(false)
  const [editTarget, setEditTarget] = useState<Conta | null>(null)
  const [categoria, setCategoria]   = useState('')
  const today = new Date()
  const [dateRange, setDateRange]   = useState({
    from: new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0],
    to:   today.toISOString().split('T')[0],
  })

  const filtered = useMemo(() =>
    contas.filter((c) => {
      const d    = new Date(c.vencimento)
      const from = new Date(dateRange.from)
      const to   = new Date(dateRange.to)
      return d >= from && d <= to && (!categoria || c.tipo === categoria)
    }),
    [contas, dateRange, categoria]
  )

  function handleExportCSV() {
    exportToCSV(filtered, [
      { key: 'tipo',       label: 'Tipo'       },
      { key: 'descricao',  label: 'Descrição'  },
      { key: 'valor',      label: 'Valor (€)', format: (v) => Number(v).toFixed(2) },
      { key: 'vencimento', label: 'Vencimento' },
      { key: 'pago',       label: 'Pago',      format: (v) => v ? 'Sim' : 'Não'   },
    ], `contas_${dateRange.from}_${dateRange.to}`)
  }

  function handleExportPDF() {
    const rows  = filtered.map((c) => `
      <tr>
        <td>${TIPOS.find((t) => t.value === c.tipo)?.label ?? c.tipo}</td>
        <td>${c.descricao ?? '—'}</td>
        <td style="text-align:right">${fmt(Number(c.valor))}</td>
        <td>${new Date(c.vencimento).toLocaleDateString('pt-PT')}</td>
        <td>${c.pago ? '✓' : '—'}</td>
      </tr>`).join('')
    const total = filtered.reduce((s, c) => s + Number(c.valor), 0)
    exportToPDF('Relatório de Contas', `
      <h1>Relatório de Contas</h1>
      <p class="sub">Gerado em ${new Date().toLocaleDateString('pt-PT')}</p>
      <table>
        <thead><tr><th>Tipo</th><th>Descrição</th><th>Valor</th><th>Vencimento</th><th>Pago</th></tr></thead>
        <tbody>${rows}</tbody>
        <tfoot><tr><td colspan="2">Total</td><td style="text-align:right">${fmt(total)}</td><td colspan="2"></td></tr></tfoot>
      </table>`)
  }

  const columns = [
    {
      key: 'tipo', label: 'Tipo',
      render: (r: Conta) => TIPOS.find((t) => t.value === r.tipo)?.label ?? r.tipo,
    },
    { key: 'descricao', label: 'Descrição', hideOnMobile: true },
    {
      key: 'vencimento', label: 'Vencimento', hideOnMobile: true,
      render: (r: Conta) => new Date(r.vencimento).toLocaleDateString('pt-PT'),
    },
    {
      key: 'valor', label: 'Valor', align: 'right' as const,
      render: (r: Conta) => (
        <span className="font-mono font-semibold">{fmt(Number(r.valor))}</span>
      ),
    },
    {
      key: 'pago', label: 'Estado', align: 'center' as const,
      render: (r: Conta) => isAdmin ? (
        <button
          onClick={(e) => { e.stopPropagation(); toggle(r.id, !r.pago) }}
          disabled={isPending}
          className="flex items-center justify-center w-full"
        >
          {r.pago
            ? <CheckCircle2 size={18} className="text-green-500" />
            : <Circle       size={18} className="text-slate-300 hover:text-slate-400" />}
        </button>
      ) : (
        r.pago
          ? <span className="text-xs text-green-600 font-medium">Paga</span>
          : <span className="text-xs text-amber-600 font-medium">Pendente</span>
      ),
    },
    ...(isAdmin ? [{
      key: 'actions', label: '',
      render: (r: Conta) => (
        <div className="flex gap-2 justify-end">
          <Button size="sm" variant="ghost"
            onClick={(e) => { e.stopPropagation(); setEditTarget(r); setModalOpen(true) }}>
            Editar
          </Button>
          <Button size="sm" variant="danger"
            onClick={(e) => { e.stopPropagation(); remove(r.id) }}>
            Apagar
          </Button>
        </div>
      ),
    }] : []),
  ]

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Contas</h1>
          {totalPendente > 0 && (
            <p className="text-sm text-amber-600 mt-0.5">{fmt(totalPendente)} em dívida</p>
          )}
        </div>
        <div className="flex gap-2">
          <ExportMenu onExportCSV={handleExportCSV} onExportPDF={handleExportPDF} disabled={!filtered.length} />
          {isAdmin && (
            <Button icon={<Plus size={16} />} onClick={() => { setEditTarget(null); setModalOpen(true) }}>
              Nova conta
            </Button>
          )}
        </div>
      </div>

      <Filters
        dateRange={dateRange} onDateChange={setDateRange}
        category={categoria} onCategoryChange={setCategoria}
        categoryOptions={TIPOS}
      />

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <DataTable
          columns={columns} data={filtered}
          keyExtractor={(r) => r.id} loading={isLoading}
          emptyMessage="Sem contas no período seleccionado"
        />
      </div>

      <Modal
        open={modalOpen} onClose={() => setModalOpen(false)}
        title={editTarget ? 'Editar conta' : 'Nova conta'}
      >
        <ContaForm defaultValues={editTarget ?? undefined} onSuccess={() => setModalOpen(false)} />
      </Modal>
    </div>
  )
}
