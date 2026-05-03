'use client'

import { useMemo } from 'react'
import { Receipt, Fuel, ShoppingBag, TrendingUp } from 'lucide-react'
import { StatCard }     from '@/components/ui/StatCard'
import { MiniBarChart } from '@/components/dashboard/MiniBarChart'
import { AlertasCard }  from '@/components/dashboard/AlertasCard'
import { fmt }          from '@/lib/utils/currency'
import type { Conta, Abastecimento, Despesa } from '@/lib/types/domain.types'

type Props = {
  contas: Conta[]
  abastecimentos: Abastecimento[]
  despesas: Despesa[]
}

export function DashboardClient({ contas, abastecimentos, despesas }: Props) {
  const now      = new Date()
  const mesAtual = now.getMonth()
  const anoAtual = now.getFullYear()

  const isMesAtual = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.getMonth() === mesAtual && d.getFullYear() === anoAtual
  }

  const stats = useMemo(() => ({
    contasPendentes:  contas.filter((c) => !c.pago && isMesAtual(c.vencimento)),
    totalContasMes:   contas.filter((c) => isMesAtual(c.vencimento))
                            .reduce((s, c) => s + Number(c.valor), 0),
    totalCombustivel: abastecimentos.filter((a) => isMesAtual(a.data_abastecimento))
                            .reduce((s, a) => s + Number(a.valor_total), 0),
    totalComprasMes:  despesas.filter((d) => isMesAtual(d.data_compra))
                            .reduce((s, d) => s + Number(d.valor_total), 0),
  }), [contas, abastecimentos, despesas])

  const totalMes = stats.totalContasMes + stats.totalCombustivel + stats.totalComprasMes

  const chartData = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => {
      const date = new Date(anoAtual, mesAtual - (5 - i), 1)
      const m = date.getMonth(), a = date.getFullYear()
      const isM = (s: string) => {
        const d = new Date(s)
        return d.getMonth() === m && d.getFullYear() === a
      }
      const total =
        contas.filter((c) => isM(c.vencimento)).reduce((s, c) => s + Number(c.valor), 0) +
        abastecimentos.filter((a) => isM(a.data_abastecimento)).reduce((s, a) => s + Number(a.valor_total), 0) +
        despesas.filter((d) => isM(d.data_compra)).reduce((s, d) => s + Number(d.valor_total), 0)
      return {
        label: date.toLocaleDateString('pt-PT', { month: 'short' }),
        value: total,
      }
    })
  }, [contas, abastecimentos, despesas])

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-lg md:text-xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          {now.toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* KPIs — 2 colunas no mobile, 4 no desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          label="Total mês" value={fmt(totalMes)}
          sub="todas categorias" icon={TrendingUp}
        />
        <StatCard
          label="Contas" value={fmt(stats.totalContasMes)}
          sub={`${stats.contasPendentes.length} pendente(s)`}
          icon={Receipt}
          variant={stats.contasPendentes.length > 0 ? 'warning' : 'success'}
        />
        <StatCard
          label="Compras" value={fmt(stats.totalComprasMes)}
          icon={ShoppingBag}
        />
        <StatCard
          label="Combustível" value={fmt(stats.totalCombustivel)}
          icon={Fuel}
        />
      </div>

      {/* Gráfico + Alertas — empilhados no mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-4 md:p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">
            Despesas — últimos 6 meses
          </h2>
          <MiniBarChart data={chartData} />
        </div>
        <AlertasCard contas={stats.contasPendentes} />
      </div>
    </div>
  )
}
