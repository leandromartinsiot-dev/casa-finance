import { createClient }     from '@/lib/supabase/server'
import { requireAuth }      from '@/lib/auth/auth.service'
import { HistoricoClient }  from '@/components/historico/HistoricoClient'

export default async function HistoricoPage() {
  await requireAuth()
  const supabase = await createClient()

  const [contas, abastecimentos, despesas] = await Promise.all([
    supabase.from('contas').select('*').order('vencimento', { ascending: false }),
    supabase.from('abastecimentos').select('*').order('data_abastecimento', { ascending: false }),
    supabase.from('despesas').select('*').order('data_compra', { ascending: false }),
  ])

  const entries = [
    ...(contas.data ?? []).map((c) => ({
      id: c.id, tipo: 'conta' as const, subtipo: c.tipo,
      descricao: c.descricao ?? c.tipo, valor: Number(c.valor),
      data: c.vencimento, pago: c.pago,
    })),
    ...(abastecimentos.data ?? []).map((a) => ({
      id: a.id, tipo: 'combustivel' as const, subtipo: a.tipo_combustivel,
      descricao: a.veiculo ? `${a.veiculo} — ${a.posto ?? 'posto'}` : (a.posto ?? 'Abastecimento'),
      valor: Number(a.valor_total), data: a.data_abastecimento, pago: true,
    })),
    ...(despesas.data ?? []).map((d) => ({
      id: d.id, tipo: 'compra' as const, subtipo: 'compra',
      descricao: d.descricao, valor: Number(d.valor_total),
      data: d.data_compra, pago: true,
    })),
  ].sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())

  return <HistoricoClient entries={entries} />
}

export const dynamic = 'force-dynamic'
