'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAdmin, requireAuth } from '@/lib/auth/auth.service'
import { SessaoCompraSchema } from '@/lib/validations/compras.schema'
import type { SessaoCompraFormData } from '@/lib/validations/compras.schema'

export async function getDespesas() {
  await requireAuth()
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('despesas')
    .select('*, sessoes_compra(descricao)')
    .order('data_compra', { ascending: false })
  return { data, error: error?.message ?? null }
}

export async function guardarSessaoComoDepesa(formData: SessaoCompraFormData) {
  const profile = await requireAdmin()
  const parsed = SessaoCompraSchema.safeParse(formData)
  if (!parsed.success) return { data: null, error: parsed.error.flatten().fieldErrors }

  const supabase = await createClient()
  const total = parsed.data.itens.reduce(
    (acc, item) => acc + item.valor * item.quantidade, 0
  )

  const { data: sessao, error: sessaoError } = await supabase
    .from('sessoes_compra')
    .insert({
      descricao: parsed.data.descricao,
      total: parseFloat(total.toFixed(2)),
      estado: 'guardado',
      created_by: profile.id,
    })
    .select()
    .single()

  if (sessaoError) return { data: null, error: sessaoError.message }

  const { error: itensError } = await supabase
    .from('itens_compra')
    .insert(
      parsed.data.itens.map((item) => ({
        sessao_id: sessao.id,
        nome: item.nome,
        valor: item.valor,
        quantidade: item.quantidade,
      }))
    )

  if (itensError) return { data: null, error: itensError.message }

  const { data: despesa, error: despesaError } = await supabase
    .from('despesas')
    .insert({
      sessao_id: sessao.id,
      descricao: parsed.data.descricao,
      valor_total: parseFloat(total.toFixed(2)),
      data_compra: new Date().toISOString().split('T')[0],
      created_by: profile.id,
    })
    .select()
    .single()

  if (despesaError) return { data: null, error: despesaError.message }

  revalidatePath('/dashboard/compras')
  return { data: { sessao, despesa }, error: null }
}

export async function deleteDespesa(id: string) {
  await requireAdmin()
  const supabase = await createClient()
  const { error } = await supabase.from('despesas').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/dashboard/compras')
  return { error: null }
}
