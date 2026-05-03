import { z } from 'zod'

export const ItemCompraSchema = z.object({
  nome: z.string().min(1, 'Nome obrigatório').max(150),
  valor: z.number().min(0, 'Valor não pode ser negativo'),
  quantidade: z.number().int().positive().default(1),
})

export const SessaoCompraSchema = z.object({
  descricao: z.string().min(1, 'Descrição obrigatória').max(200),
  itens: z.array(ItemCompraSchema).min(1, 'Adicione pelo menos um item'),
})

export type ItemCompraFormData   = z.infer<typeof ItemCompraSchema>
export type SessaoCompraFormData = z.infer<typeof SessaoCompraSchema>
