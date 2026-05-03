'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAdmin, requireAuth } from '@/lib/auth/auth.service'
import { ListaMercadoSchema, ItemMercadoSchema } from '@/lib/validations/mercado.schema'
import type { ListaMercadoFormData, ItemMercadoFormData } from '@/lib/validations/mercado.schema'

export async function getListas() {
  await requireAuth()
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('v_listas_mercado_totais')
    .select('*')
    .order('created_at', { ascending: false })
  return { data, error: error?.message ?? null }
}

export async function getListaComItens(listaId: string) {
  await requireAuth()
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('listas_mercado')
    .select(`*, itens_mercado (*)`)
    .eq('id', listaId)
    .single()
  return { data, error: error?.message ?? null }
}

export async function createLista(formData: ListaMercadoFormData) {
  const profile = await requireAdmin()
  const parsed = ListaMercadoSchema.safeParse(formData)
  if (!parsed.success) return { data: null, error: parsed.error.flatten().fieldErrors }
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('listas_mercado')
    .insert({ ...parsed.data, created_by: profile.id })
    .select()
    .single()
  if (error) return { data: null, error: error.message }
  revalidatePath('/dashboard/mercado')
  return { data, error: null }
}

export async function upsertItem(formData: ItemMercadoFormData) {
  await requireAdmin()
  const parsed = ItemMercadoSchema.safeParse(formData)
  if (!parsed.success) return { data: null, error: parsed.error.flatten().fieldErrors }
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('itens_mercado')
    .upsert(parsed.data)
    .select()
    .single()
  if (error) return { data: null, error: error.message }
  revalidatePath('/dashboard/mercado')
  return { data, error: null }
}

export async function toggleItemComprado(itemId: string, comprado: boolean) {
  await requireAdmin()
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('itens_mercado')
    .update({ comprado })
    .eq('id', itemId)
    .select()
    .single()
  if (error) return { data: null, error: error.message }
  revalidatePath('/dashboard/mercado')
  return { data, error: null }
}

export async function deleteItem(itemId: string) {
  await requireAdmin()
  const supabase = await createClient()
  const { error } = await supabase.from('itens_mercado').delete().eq('id', itemId)
  if (error) return { error: error.message }
  revalidatePath('/dashboard/mercado')
  return { error: null }
}
