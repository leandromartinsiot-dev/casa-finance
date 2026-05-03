'use client'

import { useState } from 'react'
import { Plus, Trash2, ShoppingBag, Save, RotateCcw } from 'lucide-react'
import { usePurchases }  from '@/hooks/usePurchases'
import { DataTable }     from '@/components/ui/DataTable'
import { Button }        from '@/components/ui/Button'
import { fmt }           from '@/lib/utils/currency'
import type { Despesa }  from '@/lib/types/domain.types'

export function ComprasClient({ isAdmin }: { isAdmin: boolean }) {
  const {
    itensRascunho, descricao, setDescricao, totalRascunho,
    addItem, removeItem, clearRascunho, guardar,
    despesas, totalDespesasMes, isLoading, isPending, removeDespesa,
  } = usePurchases()

  const [nome, setNome]   = useState('')
  const [valor, setValor] = useState('')
  const [qtd, setQtd]     = useState('1')

  function handleAdd() {
    if (!nome.trim() || !valor) return
    addItem({ nome, valor: parseFloat(valor), quantidade: parseInt(qtd) || 1 })
    setNome(''); setValor(''); setQtd('1')
  }

  const despesaColumns = [
    {
      key: 'descricao', label: 'Descrição',
      render: (r: Despesa) => <span className="font-medium">{r.descricao}</span>,
    },
    {
      key: 'data_compra', label: 'Data', hideOnMobile: true,
      render: (r: Despesa) => new Date(r.data_compra).toLocaleDateString('pt-PT'),
    },
    {
      key: 'valor_total', label: 'Total', align: 'right' as const,
      render: (r: Despesa) => (
        <span className="font-mono font-semibold">{fmt(Number(r.valor_total))}</span>
      ),
    },
    ...(isAdmin ? [{
      key: 'del', label: '',
      render: (r: Despesa) => (
        <button onClick={() => removeDespesa(r.id)}
          className="p-1.5 text-slate-300 hover:text-red-500 transition-colors">
          <Trash2 size={15} />
        </button>
      ),
    }] : []),
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Compras</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Este mês:{' '}
            <span className="font-semibold text-slate-700">{fmt(totalDespesasMes)}</span>
          </p>
        </div>
      </div>

      {isAdmin && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200 bg-slate-50
                          flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag size={18} className="text-green-500" />
              <h2 className="font-semibold text-slate-800 text-sm">Calculadora</h2>
            </div>
            <div className="text-2xl font-bold text-green-600 font-mono tabular-nums">
              {fmt(totalRascunho)}
            </div>
          </div>

          {itensRascunho.length > 0 && (
            <ul className="divide-y divide-slate-100 max-h-60 overflow-y-auto">
              {itensRascunho.map((item) => (
                <li key={item.id} className="flex items-center gap-3 px-5 py-2.5">
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-slate-800 truncate block">
                      {item.nome}
                    </span>
                    <span className="text-xs text-slate-400">
                      {item.quantidade}× {fmt(item.valor)}
                    </span>
                  </div>
                  <span className="text-sm font-mono font-semibold text-slate-700">
                    {fmt(item.valor * item.quantidade)}
                  </span>
                  <button onClick={() => removeItem(item.id)}
                    className="p-1 text-slate-300 hover:text-red-500 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </li>
              ))}
            </ul>
          )}

          {itensRascunho.length === 0 && (
            <div className="py-8 text-center text-slate-400 text-sm">
              Adicione itens abaixo para começar
            </div>
          )}

          <div className="border-t border-slate-200 p-4 bg-slate-50">
            <div className="flex gap-2 mb-3">
              <input
                type="text" placeholder="Nome do produto..."
                value={nome} onChange={(e) => setNome(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-green-500/30 bg-white"
              />
              <input
                type="number" placeholder="Qtd" value={qtd}
                onChange={(e) => setQtd(e.target.value)}
                className="w-14 px-2 py-2 text-sm border border-slate-200 rounded-lg
                           focus:outline-none text-center bg-white"
                min="1"
              />
              <input
                type="number" placeholder="€" value={valor}
                onChange={(e) => setValor(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                className="w-24 px-3 py-2 text-sm border border-slate-200 rounded-lg
                           focus:outline-none bg-white font-mono"
                min="0" step="0.01"
              />
              <Button onClick={handleAdd} icon={<Plus size={16} />} size="sm">
                <span className="hidden sm:block">Add</span>
              </Button>
            </div>

            {itensRascunho.length > 0 && (
              <div className="flex gap-2 pt-2 border-t border-slate-200">
                <input
                  type="text"
                  placeholder="Nome desta compra (ex: Supermercado 2 Mai)"
                  value={descricao} onChange={(e) => setDescricao(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg
                             focus:outline-none focus:ring-2 focus:ring-green-500/30 bg-white"
                />
                <Button icon={<Save size={15} />} onClick={guardar}
                  loading={isPending} disabled={!descricao.trim()}>
                  Guardar
                </Button>
                <Button variant="ghost" icon={<RotateCcw size={15} />}
                  onClick={clearRascunho} title="Limpar" />
              </div>
            )}
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200">
          <h2 className="font-semibold text-slate-800 text-sm">Histórico de compras</h2>
        </div>
        <DataTable
          columns={despesaColumns} data={despesas}
          keyExtractor={(r) => r.id} loading={isLoading}
          emptyMessage="Sem compras registadas"
        />
      </div>
    </div>
  )
}
