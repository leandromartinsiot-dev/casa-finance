import { z } from 'zod'

export const AbastecimentoSchema = z.object({
  data_abastecimento: z.string().date('Data inválida'),
  posto: z.string().max(100).optional(),
  tipo_combustivel: z.enum(['gasolina', 'gasoleo', 'gnv', 'eletrico']),
  litros: z
    .number()
    .positive('Litros devem ser positivos')
    .max(999.999, 'Valor de litros fora do intervalo'),
  valor_total: z.number().positive('Valor total deve ser positivo'),
  km_atual: z.number().int().positive().nullable().optional(),
  veiculo: z.string().max(50).optional(),
})

export type AbastecimentoFormData = z.infer<typeof AbastecimentoSchema>
