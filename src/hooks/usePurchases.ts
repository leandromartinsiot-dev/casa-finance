'use client'

import { useState, useTransition, useCallback, useEffect } from 'react'
import { getDespesas, guardarSessaoComoDepesa, deleteDespesa } from '@/lib/actions/compras.actions'
import type { ItemCompraFormData } from '@/lib/validations/compras.schema'
import type { Despesa } from '@/lib/types/domain.types'

type ItemRascunho = ItemCompraFormData & { id: string }

export function usePurchases() {
  const [itensRascunho, setItens] = useState<ItemRascunho[]>([])
  const [descricao, setDescricao] = useState('')
  const [despesas, setDespesas]   = useState<Despesa[]>([])
  const [isLoading, setLoading]   = useState(true)
  const [isPending, startTransition] = useTransition()

  async function loadDespesas() {
    setLoading(true)
    const { data } = await getDespesas()
    setDespesas((data as Despesa[]) ?? [])
    setLoading(false)
  }

  useEffect(() => { loadDespesas() }, [])

  const addItem = useCallback((item: ItemCompraFormData) => {
    setItens((prev) => [...prev, { ...item, id: crypto.randomUUID() }])
  }, [])

  const removeItem = useCallback((id: string) => {
    setItens((prev) => prev.filter((i) => i.id !== id))
  }, [])

  const updateItem = useCallback((id: string, data: Partial<ItemCompraFormData>) => {
    setItens((prev) => prev.map((i) => (i.id === id ? { ...i, ...data } : i)))
  }, [])

  const clearRascunho = useCallback(() => {
    setItens([])
    setDescricao('')
  }, [])

  const guardar = () =>
    startTransition(async () => {
      if (!descricao.trim() || itensRascunho.length === 0) return
      const result = await guardarSessaoComoDepesa({
        descricao,
        itens: itensRascunho.map(({ id: _id, ...rest }) => rest),
      })
      if (!result.error) {
        clearRascunho()
        await loadDespesas()
      }
      return result
    })

  const remove = (id: string) =>
    startTransition(async () => {
      const result = await deleteDespesa(id)
      if (!result.error) await loadDespesas()
      return result
    })

  const totalRascunho = itensRascunho.reduce(
    (acc, i) => acc + i.valor * i.quantidade, 0
  )

  const totalDespesasMes = despesas
    .filter((d) => {
      const mes = new Date().getMonth()
      return new Date(d.data_compra).getMonth() === mes
    })
    .reduce((acc, d) => acc + Number(d.valor_total), 0)

  return {
    itensRascunho, descricao, setDescricao, totalRascunho,
    addItem, removeItem, updateItem, clearRascunho, guardar,
    despesas, totalDespesasMes, isLoading, isPending,
    removeDespesa: remove, refresh: loadDespesas,
  }
}
