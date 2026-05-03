'use server'

import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth/auth.service'
import { z } from 'zod'

const CreateUserSchema = z.object({
  email:     z.string().email('Email inválido'),
  password:  z.string().min(8, 'Mínimo 8 caracteres'),
  full_name: z.string().min(2, 'Nome obrigatório'),
  role:      z.enum(['ADMIN', 'USER']),
})

const UpdateUserSchema = z.object({
  full_name: z.string().min(2).optional(),
  role:      z.enum(['ADMIN', 'USER']).optional(),
})

export async function getUsers() {
  await requireAdmin()
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })
  return { data, error: error?.message ?? null }
}

export async function createUser(formData: z.infer<typeof CreateUserSchema>) {
  await requireAdmin()
  const parsed = CreateUserSchema.safeParse(formData)
  if (!parsed.success) return { data: null, error: parsed.error.flatten().fieldErrors }

  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email:         parsed.data.email,
    password:      parsed.data.password,
    email_confirm: true,
    user_metadata: { full_name: parsed.data.full_name },
  })

  if (authError) return { data: null, error: authError.message }

  const { error: profileError } = await supabaseAdmin
    .from('profiles')
    .update({ role: parsed.data.role, full_name: parsed.data.full_name })
    .eq('id', authData.user.id)

  if (profileError) return { data: null, error: profileError.message }

  revalidatePath('/dashboard/utilizadores')
  return { data: authData.user, error: null }
}

export async function updateUser(userId: string, formData: z.infer<typeof UpdateUserSchema>) {
  await requireAdmin()
  const parsed = UpdateUserSchema.safeParse(formData)
  if (!parsed.success) return { data: null, error: parsed.error.flatten().fieldErrors }

  const { error } = await supabaseAdmin
    .from('profiles')
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq('id', userId)

  if (error) return { data: null, error: error.message }

  revalidatePath('/dashboard/utilizadores')
  return { data: null, error: null }
}

export async function deleteUser(userId: string) {
  const admin = await requireAdmin()
  if (admin.id === userId) {
    return { error: 'Não pode eliminar a sua própria conta' }
  }
  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId)
  if (error) return { error: error.message }
  revalidatePath('/dashboard/utilizadores')
  return { error: null }
}
