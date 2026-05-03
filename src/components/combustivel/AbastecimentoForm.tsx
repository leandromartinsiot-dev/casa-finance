'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AbastecimentoSchema } from '@/lib/validations/combustivel.schema'
import { useFuel } from '@/hooks/useFuel'
import { FormField, FormSelect } from '@/components/ui/FormField'
import { Button } from '@/components/ui/Button'
import type { AbastecimentoFormData } from '@/lib/validations/combustivel.schema'

const TIPO_OPTIONS = [
  { value: 'gasolina', label: '⛽ Gasolina' },
  { value: 'gasoleo',  label: '🛢️ Gasóleo'  },
  { value: 'gnv',      label: '💨 GNV'      },
  { value: 'eletrico', label: '⚡ Elétrico' },
]

export function AbastecimentoForm({ onSuccess }: { onSuccess: () => void }) {
  const { create, isPending } = useFuel()

  const { register, handleSubmit, formState: { errors } } =
    useForm<AbastecimentoFormData>({
      resolver: zodResolver(AbastecimentoSchema),
      defaultValues: {
        data_abastecimento: new Date().toISOString().split('T')[0],
        tipo_combustivel:   'gasolina',
      },
    })

  async function onSubmit(data: AbastecimentoFormData) {
    const result = await create(data)
    if (!result?.error) onSuccess()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <FormField
          label="Data" type="date" required
          error={errors.data_abastecimento?.message}
          {...register('data_abastecimento')}
        />
        <FormSelect
          label="Tipo" required options={TIPO_OPTIONS}
          error={errors.tipo_combustivel?.message}
          {...register('tipo_combustivel')}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <FormField
          label="Litros" type="number" step="0.001" min="0" required
          placeholder="45.000"
          error={errors.litros?.message}
          {...register('litros', { valueAsNumber: true })}
        />
        <FormField
          label="Total (€)" type="number" step="0.01" min="0" required
          placeholder="70,00"
          error={errors.valor_total?.message}
          {...register('valor_total', { valueAsNumber: true })}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <FormField
          label="Km actuais" type="number" min="0"
          placeholder="45000"
          error={errors.km_atual?.message}
          {...register('km_atual', { valueAsNumber: true })}
        />
        <FormField
          label="Veículo" placeholder="Ex: Peugeot 208"
          error={errors.veiculo?.message}
          {...register('veiculo')}
        />
      </div>
      <FormField
        label="Posto" placeholder="Ex: Galp Lisboa"
        error={errors.posto?.message}
        {...register('posto')}
      />
      <div className="flex justify-end pt-2">
        <Button type="submit" loading={isPending}>
          Registar abastecimento
        </Button>
      </div>
    </form>
  )
}
