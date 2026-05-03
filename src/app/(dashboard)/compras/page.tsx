import { getCurrentProfile } from '@/lib/auth/auth.service'
import { ComprasClient }     from '@/components/compras/ComprasClient'

export default async function ComprasPage() {
  const profile = await getCurrentProfile()
  return <ComprasClient isAdmin={profile?.role === 'ADMIN'} />
}

export const dynamic = 'force-dynamic'
