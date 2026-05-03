'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAdmin, requireAuth } from '@/lib/auth/auth.service'
import { AbastecimentoSchema } from '@/lib/validations/combustivel.schema'
import type { AbastecimentoFormData } from '@/lib/validations/combustivel.schema'

export async function getAbastecimentos(veiculo?: string) {
  await requireAuth()
  const supabase = await createClient()
  let query = supabase
    .from('abastecimentos')
    .select('*')
    .order('data_abastecimento', { ascending: false })
  if (veiculo) query = query.eq('veiculo', veiculo)
  const { data, error } = await query
  return { data, error: error?.message ?? null }
}

export async function getConsumoVeiculo() {
  await requireAuth()
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('v_consumo_veiculo')
    .select('*')
    .order('total_gasto', { ascending: false })
  return { data, error: error?.message ?? null }
}

export async function createAbastecimento(formData: AbastecimentoFormData) {
  const profile = await requireAdmin()
  const parsed = AbastecimentoSchema.safeParse(formData)
  if (!parsed.success) return { data: null, error: parsed.error.flatten().fieldErrors }
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('abastecimentos')
    .insert({ ...parsed.data, created_by: profile.id })
    .select()
    .single()
  if (error) return { data: null, error: error.message }
  revalidatePath('/dashboard/combustivel')
  return { data, error: null }
}

export async function deleteAbastecimento(id: string) {
  await requireAdmin()
  const supabase = await createClient()
  const { error } = await supabase.from('abastecimentos').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/dashboard/combustivel')
  return { error: null }
}
