'use client'

import { useState, useEffect, useTransition } from 'react'
import {
  getContas, createConta, updateConta,
  deleteConta, togglePagamento,
} from '@/lib/actions/contas.actions'
import type { Conta } from '@/lib/types/domain.types'
import type { ContaFormData } from '@/lib/validations/contas.schema'

export function useExpenses() {
  const [contas, setContas]     = useState<Conta[]>([])
  const [isLoading, setLoading] = useState(true)
  const [error, setError]       = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  async function load() {
    setLoading(true)
    const { data, error } = await getContas()
    if (error) setError(error)
    else setContas(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const create = async (data: ContaFormData): Promise<{ error?: string }> => {
    const result = await createConta(data)
    if (!result.error) await load()
    return result
  }

  const update = async (id: string, data: Partial<ContaFormData>): Promise<{ error?: string }> => {
    const result = await updateConta(id, data)
    if (!result.error) await load()
    return result
  }

  const remove = (id: string) =>
    startTransition(async () => {
      const result = await deleteConta(id)
      if (!result.error) await load()
      return result
    })

  const toggle = (id: string, pago: boolean) =>
    startTransition(async () => {
      const result = await togglePagamento(id, pago)
      if (!result.error) await load()
      return result
    })

  const totalPendente = contas
    .filter((c) => !c.pago)
    .reduce((acc, c) => acc + Number(c.valor), 0)

  const totalMes = contas
    .filter((c) => {
      const mes = new Date().getMonth()
      return new Date(c.vencimento).getMonth() === mes
    })
    .reduce((acc, c) => acc + Number(c.valor), 0)

  return {
    contas, isLoading, isPending, error,
    totalPendente, totalMes,
    create, update, remove, toggle, refresh: load,
  }
}
