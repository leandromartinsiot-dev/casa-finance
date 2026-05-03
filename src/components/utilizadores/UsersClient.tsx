'use client'

import { useState, useTransition } from 'react'
import { useForm }   from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z }         from 'zod'
import { UserPlus, Shield, User, Trash2 } from 'lucide-react'
import { getUsers, createUser, updateUser, deleteUser } from '@/lib/actions/users.actions'
import { Button }    from '@/components/ui/Button'
import { Modal }     from '@/components/ui/Modal'
import { FormField, FormSelect } from '@/components/ui/FormField'
import type { Profile } from '@/lib/types/domain.types'

const CreateSchema = z.object({
  email:     z.string().email(),
  password:  z.string().min(8),
  full_name: z.string().min(2),
  role:      z.enum(['ADMIN', 'USER']),
})

type CreateForm = z.infer<typeof CreateSchema>

const ROLE_OPTIONS = [
  { value: 'USER',  label: '👤 Utilizador (read-only)' },
  { value: 'ADMIN', label: '🛡️ Admin (acesso total)'   },
]

export function UsersClient({ initialUsers }: { initialUsers: Profile[] }) {
  const [users, setUsers]       = useState(initialUsers)
  const [createOpen, setCreate] = useState(false)
  const [isPending, startT]     = useTransition()
  const [serverError, setErr]   = useState('')

  async function refresh() {
    const { data } = await getUsers()
    setUsers(data ?? [])
  }

  const { register, handleSubmit, reset, formState: { errors } } =
    useForm<CreateForm>({
      resolver: zodResolver(CreateSchema),
      defaultValues: { role: 'USER' },
    })

  async function onCreateSubmit(data: CreateForm) {
    setErr('')
    const result = await createUser(data)
    if (result.error && typeof result.error === 'string') {
      setErr(result.error); return
    }
    reset(); setCreate(false); await refresh()
  }

  async function handleRoleChange(userId: string, role: 'ADMIN' | 'USER') {
    startT(async () => { await updateUser(userId, { role }); await refresh() })
  }

  async function handleDelete(userId: string) {
    if (!confirm('Eliminar utilizador? Esta acção é irreversível.')) return
    startT(async () => {
      const result = await deleteUser(userId)
      if (result.error) { alert(result.error); return }
      await refresh()
    })
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">Utilizadores</h1>
        <Button icon={<UserPlus size={16} />} onClick={() => setCreate(true)}>
          Novo utilizador
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {users.length === 0 ? (
          <p className="text-center py-10 text-slate-400 text-sm">Sem utilizadores</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {users.map((u) => (
              <li key={u.id} className="flex items-center gap-4 px-5 py-4">
                <div className="w-9 h-9 rounded-full bg-green-100 flex items-center
                                justify-center shrink-0 text-green-700 font-semibold text-sm">
                  {(u.full_name ?? 'U')[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">
                    {u.full_name ?? '—'}
                  </p>
                  <p className="text-xs text-slate-400">
                    Desde {new Date(u.created_at).toLocaleDateString('pt-PT')}
                  </p>
                </div>
                <button
                  onClick={() => handleRoleChange(u.id, u.role === 'ADMIN' ? 'USER' : 'ADMIN')}
                  disabled={isPending}
                  className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full
                              font-semibold transition-all ${
                                u.role === 'ADMIN'
                                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                >
                  {u.role === 'ADMIN'
                    ? <><Shield size={11} /> Admin</>
                    : <><User   size={11} /> User</>}
                </button>
                <button
                  onClick={() => handleDelete(u.id)}
                  disabled={isPending}
                  className="p-1.5 text-slate-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={15} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Modal open={createOpen} onClose={() => setCreate(false)}
        title="Novo utilizador" size="sm">
        <form onSubmit={handleSubmit(onCreateSubmit)} className="space-y-4">
          <FormField label="Nome completo" required placeholder="Ana Silva"
            error={errors.full_name?.message} {...register('full_name')} />
          <FormField label="Email" type="email" required placeholder="ana@exemplo.pt"
            error={errors.email?.message} {...register('email')} />
          <FormField label="Password" type="password" required placeholder="mínimo 8 caracteres"
            error={errors.password?.message} {...register('password')} />
          <FormSelect label="Perfil" required options={ROLE_OPTIONS}
            error={errors.role?.message} {...register('role')} />
          {serverError && (
            <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
              {serverError}
            </p>
          )}
          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="secondary"
              onClick={() => { reset(); setCreate(false) }}>
              Cancelar
            </Button>
            <Button type="submit" loading={isPending}>
              Criar utilizador
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
