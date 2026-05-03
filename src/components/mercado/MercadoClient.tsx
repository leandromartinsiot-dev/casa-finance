'use client'

import { useState } from 'react'
import { Plus, AlertTriangle, CheckCircle2, Trash2, ShoppingCart } from 'lucide-react'
import { useMarket }   from '@/hooks/useMarket'
import { Button }      from '@/components/ui/Button'
import { Modal }       from '@/components/ui/Modal'
import { FormField }   from '@/components/ui/FormField'
import { fmt }         from '@/lib/utils/currency'
import { cn }          from '@/lib/utils/cn'
import type { ItensMercado } from '@/lib/types/domain.types'

export function MercadoClient({ isAdmin }: { isAdmin: boolean }) {
  const [listaId, setListaId] = useState<string | undefined>()
  const {
    listas, listaActual, isLoading, isPending, progresso,
    addItem, toggleItem, removeItem, createLista,
  } = useMarket(listaId)
  const [novoItem, setNovoItem] = useState({ nome: '', quantidade: 1, valor_unit: '' })
  const [novaLista, setNovaLista] = useState('')
  const [modalLista, setModalLista] = useState(false)

  async function handleAddItem() {
    if (!listaId || !novoItem.nome.trim()) return
    await addItem({
      lista_id:   listaId,
      nome:       novoItem.nome,
      quantidade: novoItem.quantidade,
      valor_unit: novoItem.valor_unit ? parseFloat(novoItem.valor_unit) : null,
      comprado:   false,
    })
    setNovoItem({ nome: '', quantidade: 1, valor_unit: '' })
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">Mercado</h1>
        {isAdmin && (
          <Button icon={<Plus size={16} />} onClick={() => setModalLista(true)}>
            Nova lista
          </Button>
        )}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {isLoading ? (
          <div className="h-9 w-32 bg-slate-100 animate-pulse rounded-full" />
        ) : listas.length === 0 ? (
          <p className="text-sm text-slate-400">Sem listas. Crie a primeira!</p>
        ) : (
          listas.map((l: any) => (
            <button
              key={l.id}
              onClick={() => setListaId(l.id)}
              className={cn(
                'shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors',
                listaId === l.id
                  ? 'bg-green-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              )}
            >
              {l.nome}
              {l.total_itens > 0 && (
                <span className="ml-1.5 text-xs opacity-70">
                  {l.itens_comprados}/{l.total_itens}
                </span>
              )}
            </button>
          ))
        )}
      </div>

      {listaActual && (
        <>
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium text-slate-700">Progresso — {progresso}%</span>
              <span className="text-green-600 font-mono font-semibold">
                {fmt(listaActual.total_calculado ?? 0)}
              </span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full transition-all duration-500"
                style={{ width: `${progresso}%` }}
              />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {(listaActual.itens ?? []).length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-sm">
                <ShoppingCart size={32} className="mx-auto mb-2 opacity-30" />
                Sem itens. Adicione abaixo.
              </div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {(listaActual.itens ?? []).map((item: ItensMercado) => {
                  const alertaBaixo = Number(item.quantidade) <= 1 && !item.comprado
                  return (
                    <li
                      key={item.id}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 transition-colors',
                        item.comprado && 'opacity-50',
                        alertaBaixo   && 'bg-amber-50',
                      )}
                    >
                      {isAdmin ? (
                        <button onClick={() => toggleItem(item.id, !item.comprado)}>
                          {item.comprado
                            ? <CheckCircle2 size={20} className="text-green-500" />
                            : <div className="w-5 h-5 rounded-full border-2 border-slate-300" />}
                        </button>
                      ) : (
                        item.comprado
                          ? <CheckCircle2 size={20} className="text-green-500" />
                          : <div className="w-5 h-5 rounded-full border-2 border-slate-200" />
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            'text-sm font-medium truncate',
                            item.comprado ? 'line-through text-slate-400' : 'text-slate-800'
                          )}>
                            {item.nome}
                          </span>
                          {alertaBaixo && (
                            <span className="flex items-center gap-0.5 text-[10px]
                                             text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-full shrink-0">
                              <AlertTriangle size={10} /> Baixo
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-400">
                          {item.quantidade} {item.unidade}
                          {item.valor_unit && ` · ${fmt(Number(item.valor_unit))}/un`}
                        </span>
                      </div>

                      {item.valor_unit && (
                        <span className="text-sm font-mono font-semibold text-slate-700">
                          {fmt(Number(item.valor_unit) * Number(item.quantidade))}
                        </span>
                      )}

                      {isAdmin && (
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1 text-slate-300 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </li>
                  )
                })}
              </ul>
            )}

            {isAdmin && (
              <div className="border-t border-slate-200 p-4 bg-slate-50">
                <div className="flex gap-2">
                  <input
                    type="text" placeholder="Nome do item..."
                    value={novoItem.nome}
                    onChange={(e) => setNovoItem({ ...novoItem, nome: e.target.value })}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
                    className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg
                               focus:outline-none focus:ring-2 focus:ring-green-500/30 bg-white"
                  />
                  <input
                    type="number" placeholder="Qtd" value={novoItem.quantidade}
                    onChange={(e) => setNovoItem({ ...novoItem, quantidade: Number(e.target.value) })}
                    className="w-16 px-2 py-2 text-sm border border-slate-200 rounded-lg
                               focus:outline-none text-center bg-white"
                    min="0.1" step="0.1"
                  />
                  <input
                    type="number" placeholder="€/un" value={novoItem.valor_unit}
                    onChange={(e) => setNovoItem({ ...novoItem, valor_unit: e.target.value })}
                    className="w-20 px-2 py-2 text-sm border border-slate-200 rounded-lg
                               focus:outline-none bg-white"
                    min="0" step="0.01"
                  />
                  <Button onClick={handleAddItem} loading={isPending} icon={<Plus size={16} />}>
                    <span className="hidden sm:block">Adicionar</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      <Modal open={modalLista} onClose={() => setModalLista(false)}
        title="Nova lista" size="sm">
        <div className="space-y-4">
          <FormField
            label="Nome da lista" placeholder="Ex: Semana 1 de Maio"
            value={novaLista} onChange={(e) => setNovaLista(e.target.value)}
          />
          <Button className="w-full" loading={isPending}
            onClick={async () => {
              await createLista({ nome: novaLista })
              setNovaLista(''); setModalLista(false)
            }}>
            Criar lista
          </Button>
        </div>
      </Modal>
    </div>
  )
}
