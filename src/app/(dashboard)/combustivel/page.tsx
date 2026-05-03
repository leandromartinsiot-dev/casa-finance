import { getCurrentProfile } from '@/lib/auth/auth.service'
import { CombustivelClient } from '@/components/combustivel/CombustivelClient'

export default async function CombustivelPage() {
  const profile = await getCurrentProfile()
  return <CombustivelClient isAdmin={profile?.role === 'ADMIN'} />
}
