import Link from 'next/link'
import { AlertCircle, ChevronRight } from 'lucide-react'
import { fmt } from '@/lib/utils/currency'
import type { Conta } from '@/lib/types/domain.types'

const TIPO_LABELS: Record<string, string> = {
  energia:  '⚡ Energia',
  gas:      '🔥 Gás',
  agua:     '💧 Água',
  internet: '🌐 Internet',
  tv:       '📺 TV',
  telefone: '📱 Telefone',
}

export function AlertasCard({ contas }: { contas: Conta[] }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <AlertCircle size={16} className="text-amber-500" />
        <h2 className="text-sm font-semibold text-slate-700">Contas pendentes</h2>
        {contas.length > 0 && (
          <span className="ml-auto text-xs bg-amber-100 text-amber-700
                           px-2 py-0.5 rounded-full font-semibold">
            {contas.length}
          </span>
        )}
      </div>

      {contas.length === 0 ? (
        <p className="text-sm text-slate-400 text-center py-6">✅ Todas pagas</p>
      ) : (
        <div className="space-y-2">
          {contas.slice(0, 5).map((c) => (
            <div key={c.id} className="flex items-center justify-between
                                        p-2.5 rounded-lg bg-amber-50 border border-amber-100">
              <div>
                <p className="text-xs font-medium text-slate-700">
                  {TIPO_LABELS[c.tipo] ?? c.tipo}
                </p>
                <p className="text-[10px] text-slate-400">
                  Vence {new Date(c.vencimento).toLocaleDateString('pt-PT')}
                </p>
              </div>
              <span className="text-sm font-bold text-amber-700 font-mono">
                {fmt(Number(c.valor))}
              </span>
            </div>
          ))}
          {contas.length > 5 && (
            <Link
              href="/dashboard/contas"
              className="flex items-center justify-center gap-1 text-xs
                         text-green-600 hover:underline mt-1"
            >
              Ver todas <ChevronRight size={12} />
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
