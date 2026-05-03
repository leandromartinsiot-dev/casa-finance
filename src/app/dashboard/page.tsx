import { getContas }         from '@/lib/actions/contas.actions'
import { getAbastecimentos } from '@/lib/actions/combustivel.actions'
import { getDespesas }       from '@/lib/actions/compras.actions'
import { DashboardClient }   from '@/components/dashboard/DashboardClient'

export default async function DashboardPage() {
  const [contasResult, abResult, despesasResult] = await Promise.all([
    getContas(),
    getAbastecimentos(),
    getDespesas(),
  ])

  return (
    <DashboardClient
      contas={contasResult.data ?? []}
      abastecimentos={abResult.data ?? []}
      despesas={despesasResult.data ?? []}
    />
  )
}
