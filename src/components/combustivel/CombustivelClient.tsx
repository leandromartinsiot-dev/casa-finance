'use client'

import { useState } from 'react'
import { Plus, Fuel, TrendingDown } from 'lucide-react'
import { useFuel }      from '@/hooks/useFuel'
import { DataTable }    from '@/components/ui/DataTable'
import { Button }       from '@/components/ui/Button'
import { StatCard }     from '@/components/ui/StatCard'
import { Modal }        from '@/components/ui/Modal'
import { ExportMenu }   from '@/components/ui/ExportMenu'
import { AbastecimentoForm } from '@/components/combustivel/AbastecimentoForm'
import { fmt }          from '@/lib/utils/currency'
import { exportToCSV, exportToPDF } from '@/lib/utils/export'
import type { Abastecimento } from '@/lib/types/domain.types'

const TIPO_BADGE: Record<string, string> = {
  gasolina: 'bg-orange-100 text-orange-700',
  gasoleo:  'bg-slate-100  text-slate-700',
  gnv:      'bg-blue-100   text-blue-700',
  eletrico: 'bg-green-100  text-green-700',
}

export function CombustivelClient({ isAdmin }: { isAdmin: boolean }) {
  const { abastecimentos, consumo, isLoading,
          totalGasto, totalLitros, precoMedio, remove } = useFuel()
  const [modalOpen, setModalOpen] = useState(false)

  function handleExportCSV() {
    exportToCSV(abastecimentos, [
      { key: 'data_abastecimento', label: 'Data'       },
      { key: 'tipo_combustivel',   label: 'Tipo'       },
      { key: 'veiculo',            label: 'Veículo'    },
      { key: 'litros',             label: 'Litros',    format: (v) => Number(v).toFixed(3) },
      { key: 'valor_total',        label: 'Total (€)', format: (v) => Number(v).toFixed(2) },
    ], `combustivel_${new Date().toISOString().split('T')[0]}`)
  }

  function handleExportPDF() {
    const rows = abastecimentos.map((a) => `
      <tr>
        <td>${new Date(a.data_abastecimento).toLocaleDateString('pt-PT')}</td>
        <td>${a.tipo_combustivel}</td>
        <td>${a.veiculo ?? '—'}</td>
        <td style="text-align:right">${Number(a.litros).toFixed(2)} L</td>
        <td style="text-align:right">${fmt(Number(a.valor_total))}</td>
      </tr>`).join('')
    exportToPDF('Relatório de Combustível', `
      <h1>Relatório de Combustível</h1>
      <p class="sub">Total gasto: ${fmt(totalGasto)} · ${totalLitros.toFixed(1)} L</p>
      <table>
        <thead><tr><th>Data</th><th>Tipo</th><th>Veículo</th><th>Litros</th><th>Total</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>`)
  }

  const columns = [
    {
      key: 'data_abastecimento', label: 'Data',
      render: (r: Abastecimento) =>
        new Date(r.data_abastecimento).toLocaleDateString('pt-PT'),
    },
    {
      key: 'tipo_combustivel', label: 'Tipo',
      render: (r: Abastecimento) => (
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TIPO_BADGE[r.tipo_combustivel] ?? ''}`}>
          {r.tipo_combustivel}
        </span>
      ),
    },
    { key: 'veiculo', label: 'Veículo', hideOnMobile: true,
      render: (r: Abastecimento) => r.veiculo ?? '—' },
    {
      key: 'litros', label: 'Litros', align: 'right' as const, hideOnMobile: true,
      render: (r: Abastecimento) => (
        <span className="font-mono">{Number(r.litros).toFixed(2)} L</span>
      ),
    },
    {
      key: 'preco_litro', label: '€/L', align: 'right' as const,
      render: (r: Abastecimento) => (
        <span className="font-mono text-slate-500">
          {r.preco_litro ? `${Number(r.preco_litro).toFixed(3)} €` : '—'}
        </span>
      ),
    },
    {
      key: 'valor_total', label: 'Total', align: 'right' as const,
      render: (r: Abastecimento) => (
        <span className="font-mono font-semibold">{fmt(Number(r.valor_total))}</span>
      ),
    },
    ...(isAdmin ? [{
      key: 'del', label: '',
      render: (r: Abastecimento) => (
        <button onClick={() => remove(r.id)}
          className="text-xs text-red-400 hover:text-red-600 transition-colors">
          Apagar
        </button>
      ),
    }] : []),
  ]

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-xl font-bold text-slate-900">Combustível</h1>
        <div className="flex gap-2">
          <ExportMenu onExportCSV={handleExportCSV} onExportPDF={handleExportPDF}
            disabled={!abastecimentos.length} />
          {isAdmin && (
            <Button icon={<Plus size={16} />} onClick={() => setModalOpen(true)}>
              Registar
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Total gasto"   value={fmt(totalGasto)}               icon={Fuel}         />
        <StatCard label="Total litros"  value={`${totalLitros.toFixed(1)} L`} icon={TrendingDown} />
        <StatCard label="Preço médio/L" value={`${precoMedio.toFixed(3)} €`}  icon={Fuel}         />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <DataTable
          columns={columns} data={abastecimentos}
          keyExtractor={(r) => r.id} loading={isLoading}
          emptyMessage="Sem abastecimentos registados"
        />
      </div>

      {consumo.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-slate-700 mb-3">Por veículo</h2>
          <div className="space-y-2">
            {consumo.map((v: any) => (
              <div key={v.veiculo} className="flex items-center gap-3">
                <span className="text-sm font-medium text-slate-700 flex-1">{v.veiculo}</span>
                <span className="text-xs text-slate-400">{Number(v.total_litros).toFixed(1)} L</span>
                <span className="text-sm font-mono font-semibold">{fmt(Number(v.total_gasto))}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}
        title="Registar abastecimento">
        <AbastecimentoForm onSuccess={() => setModalOpen(false)} />
      </Modal>
    </div>
  )
}
