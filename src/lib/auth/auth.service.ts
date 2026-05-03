'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { UserRole } from '@/lib/types/domain.types'

export async function signIn(email: string, password: string) {
  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) {
    return { error: mapAuthError(error.message) }
  }
  redirect('/dashboard')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export async function getCurrentUser() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return null
  return user
}

export async function getCurrentProfile() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()
  return profile
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  return user
}

export async function requireAdmin() {
  const profile = await getCurrentProfile()
  if (!profile || profile.role !== 'ADMIN') redirect('/dashboard')
  return profile
}

function mapAuthError(message: string): string {
  const map: Record<string, string> = {
    'Invalid login credentials': 'Email ou password incorrectos',
    'Email not confirmed':       'Confirme o seu email antes de entrar',
    'Too many requests':         'Demasiadas tentativas. Aguarde alguns minutos',
  }
  return map[message] ?? 'Erro de autenticação. Tente novamente'
}
