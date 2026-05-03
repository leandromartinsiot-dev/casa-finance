import { getCurrentProfile } from '@/lib/auth/auth.service'
import { MercadoClient }     from '@/components/mercado/MercadoClient'

export default async function MercadoPage() {
  const profile = await getCurrentProfile()
  return <MercadoClient isAdmin={profile?.role === 'ADMIN'} />
}
