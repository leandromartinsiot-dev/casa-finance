import { z } from 'zod'

export const ContaSchema = z.object({
  tipo: z.enum(['energia', 'gas', 'agua', 'internet', 'tv', 'telefone'], {
    errorMap: () => ({ message: 'Tipo de conta inválido' }),
  }),
  descricao: z.string().max(200).optional(),
  valor: z
    .number({ invalid_type_error: 'Valor obrigatório' })
    .positive('O valor deve ser maior que zero')
    .multipleOf(0.01, 'Máximo 2 casas decimais'),
  vencimento: z.string().date('Data de vencimento inválida'),
  pago: z.boolean().default(false),
  data_pagamento: z.string().date().nullable().optional(),
})
.refine(
  (data) => !data.pago || data.data_pagamento != null,
  { message: 'Data de pagamento obrigatória quando marcado como pago', path: ['data_pagamento'] }
)

export type ContaFormData = z.infer<typeof ContaSchema>
