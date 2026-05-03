'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ContaSchema } from '@/lib/validations/contas.schema'
import { useExpenses } from '@/hooks/useExpenses'
import { FormField, FormSelect } from '@/components/ui/FormField'
import { Button } from '@/components/ui/Button'
import type { ContaFormData } from '@/lib/validations/contas.schema'
import type { Conta } from '@/lib/types/domain.types'

const TIPO_OPTIONS = [
  { value: 'energia',  label: '⚡ Energia'   },
  { value: 'gas',      label: '🔥 Gás'       },
  { value: 'agua',     label: '💧 Água'      },
  { value: 'internet', label: '🌐 Internet'  },
  { value: 'tv',       label: '📺 TV'        },
  { value: 'telefone', label: '📱 Telefone'  },
]

type Props = {
  defaultValues?: Partial<Conta>
  onSuccess: () => void
}

export function ContaForm({ defaultValues, onSuccess }: Props) {
  const { create, update, isPending } = useExpenses()

  const { register, handleSubmit, watch, formState: { errors } } =
    useForm<ContaFormData>({
      resolver: zodResolver(ContaSchema),
      defaultValues: {
        tipo:       (defaultValues?.tipo as ContaFormData['tipo']) ?? 'energia',
        descricao:  defaultValues?.descricao ?? '',
        valor:      defaultValues?.valor ? Number(defaultValues.valor) : undefined,
        vencimento: defaultValues?.vencimento ?? new Date().toISOString().split('T')[0],
        pago:       defaultValues?.pago ?? false,
      },
    })

  const pago = watch('pago')

  async function onSubmit(data: ContaFormData) {
    const result = defaultValues?.id
      ? await update(defaultValues.id, data)
      : await create(data)
    if (!result?.error) onSuccess()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormSelect
        label="Tipo" required options={TIPO_OPTIONS}
        error={errors.tipo?.message}
        {...register('tipo')}
      />
      <FormField
        label="Descrição" placeholder="Referência da factura..."
        error={errors.descricao?.message}
        {...register('descricao')}
      />
      <div className="grid grid-cols-2 gap-3">
        <FormField
          label="Valor (€)" type="number" step="0.01" min="0" required
          placeholder="0,00" error={errors.valor?.message}
          {...register('valor', { valueAsNumber: true })}
        />
        <FormField
          label="Vencimento" type="date" required
          error={errors.vencimento?.message}
          {...register('vencimento')}
        />
      </div>
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          className="w-4 h-4 rounded accent-green-600"
          {...register('pago')}
        />
        <span className="text-sm text-slate-700">Marcar como paga</span>
      </label>
      {pago && (
        <FormField
          label="Data de pagamento" type="date"
          error={errors.data_pagamento?.message}
          {...register('data_pagamento')}
        />
      )}
      <div className="flex justify-end gap-2 pt-2">
        <Button type="submit" loading={isPending}>
          {defaultValues?.id ? 'Guardar alterações' : 'Criar conta'}
        </Button>
      </div>
    </form>
  )
}
