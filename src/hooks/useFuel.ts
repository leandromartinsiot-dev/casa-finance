'use client'

import { useState, useEffect, useTransition } from 'react'
import {
  getAbastecimentos, getConsumoVeiculo,
  createAbastecimento, deleteAbastecimento,
} from '@/lib/actions/combustivel.actions'
import type { Abastecimento } from '@/lib/types/domain.types'
import type { AbastecimentoFormData } from '@/lib/validations/combustivel.schema'

export function useFuel(veiculo?: string) {
  const [abastecimentos, setAbastecimentos] = useState<Abastecimento[]>([])
  const [consumo, setConsumo]               = useState<any[]>([])
  const [isLoading, setLoading]             = useState(true)
  const [isPending, startTransition]        = useTransition()

  async function load() {
    setLoading(true)
    const [abResult, conResult] = await Promise.all([
      getAbastecimentos(veiculo),
      getConsumoVeiculo(),
    ])
    setAbastecimentos(abResult.data ?? [])
    setConsumo(conResult.data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [veiculo])

  const create = (data: AbastecimentoFormData) =>
    startTransition(async () => {
      const result = await createAbastecimento(data)
      if (!result.error) await load()
      return result
    })

  const remove = (id: string) =>
    startTransition(async () => {
      const result = await deleteAbastecimento(id)
      if (!result.error) await load()
      return result
    })

  const totalGasto   = abastecimentos.reduce((s, a) => s + Number(a.valor_total), 0)
  const totalLitros  = abastecimentos.reduce((s, a) => s + Number(a.litros), 0)
  const precoMedio   = totalLitros > 0
    ? parseFloat((totalGasto / totalLitros).toFixed(4))
    : 0

  return {
    abastecimentos, consumo, isLoading, isPending,
    totalGasto, totalLitros, precoMedio,
    create, remove, refresh: load,
  }
}
