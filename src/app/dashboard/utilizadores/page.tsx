import { requireAdmin } from '@/lib/auth/auth.service'
import { getUsers }     from '@/lib/actions/users.actions'
import { UsersClient }  from '@/components/utilizadores/UsersClient'

export default async function UtilizadoresPage() {
  await requireAdmin()
  const { data: users } = await getUsers()
  return <UsersClient initialUsers={users ?? []} />
}
