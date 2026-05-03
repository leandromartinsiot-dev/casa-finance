import { getContas }         from '@/lib/actions/contas.actions'
import { getCurrentProfile } from '@/lib/auth/auth.service'
import { ContasClient }      from '@/components/contas/ContasClient'

export default async function ContasPage() {
  const [contasResult, profile] = await Promise.all([
    getContas(),
    getCurrentProfile(),
  ])

  return (
    <ContasClient
      initialContas={contasResult.data ?? []}
      isAdmin={profile?.role === 'ADMIN'}
    />
  )
}
