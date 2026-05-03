'use client'

import { useState, useEffect, useTransition } from 'react'
import {
  getListas, getListaComItens, createLista,
  upsertItem, toggleItemComprado, deleteItem,
} from '@/lib/actions/mercado.actions'
import type { ListaMercadoComItens } from '@/lib/types/domain.types'

export function useMarket(listaId?: string) {
  const [listas, setListas]           = useState<any[]>([])
  const [listaActual, setListaActual] = useState<ListaMercadoComItens | null>(null)
  const [isLoading, setLoading]       = useState(true)
  const [isPending, startTransition]  = useTransition()

  async function loadListas() {
    setLoading(true)
    const { data } = await getListas()
    setListas(data ?? [])
    setLoading(false)
  }

  async function loadLista(id: string) {
    const { data } = await getListaComItens(id)
    setListaActual(data as ListaMercadoComItens)
  }

  useEffect(() => { loadListas() }, [])
  useEffect(() => { if (listaId) loadLista(listaId) }, [listaId])

  const addItem = (data: Parameters<typeof upsertItem>[0]) =>
    startTransition(async () => {
      const result = await upsertItem(data)
      if (!result.error && listaId) await loadLista(listaId)
      return result
    })

  const toggleItem = (itemId: string, comprado: boolean) =>
    startTransition(async () => {
      const result = await toggleItemComprado(itemId, comprado)
      if (!result.error && listaId) await loadLista(listaId)
      return result
    })

  const removeItem = (itemId: string) =>
    startTransition(async () => {
      const result = await deleteItem(itemId)
      if (!result.error && listaId) await loadLista(listaId)
      return result
    })

  const progresso = listaActual
    ? Math.round(
        ((listaActual.itens?.filter((i) => i.comprado).length ?? 0) /
          Math.max(listaActual.itens?.length ?? 0, 1)) * 100
      )
    : 0

  return {
    listas, listaActual, isLoading, isPending, progresso,
    createLista, addItem, toggleItem, removeItem, refresh: loadListas,
  }
}
