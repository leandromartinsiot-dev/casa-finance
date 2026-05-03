'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAdmin, requireAuth } from '@/lib/auth/auth.service'
import { ContaSchema } from '@/lib/validations/contas.schema'
import type { ContaFormData } from '@/lib/validations/contas.schema'

export async function getContas() {
  await requireAuth()
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('contas')
    .select('*')
    .order('vencimento', { ascending: true })
  return { data, error: error?.message ?? null }
}

export async function createConta(formData: ContaFormData) {
  const profile = await requireAdmin()
  const parsed = ContaSchema.safeParse(formData)
  if (!parsed.success) {
    return { data: null, error: parsed.error.flatten().fieldErrors }
  }
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('contas')
    .insert({ ...parsed.data, created_by: profile.id })
    .select()
    .single()
  if (error) return { data: null, error: error.message }
  revalidatePath('/dashboard/contas')
  return { data, error: null }
}

export async function updateConta(id: string, formData: Partial<ContaFormData>) {
  await requireAdmin()
  const parsed = ContaSchema.partial().safeParse(formData)
  if (!parsed.success) {
    return { data: null, error: parsed.error.flatten().fieldErrors }
  }
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('contas')
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  if (error) return { data: null, error: error.message }
  revalidatePath('/dashboard/contas')
  return { data, error: null }
}

export async function deleteConta(id: string) {
  await requireAdmin()
  const supabase = await createClient()
  const { error } = await supabase.from('contas').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/dashboard/contas')
  return { error: null }
}

export async function togglePagamento(id: string, pago: boolean) {
  await requireAdmin()
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('contas')
    .update({
      pago,
      data_pagamento: pago ? new Date().toISOString().split('T')[0] : null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()
  if (error) return { data: null, error: error.message }
  revalidatePath('/dashboard/contas')
  return { data, error: null }
}
