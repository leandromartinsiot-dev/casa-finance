import { z } from 'zod'

export const ListaMercadoSchema = z.object({
  nome: z.string().min(1, 'Nome obrigatório').max(100),
})

export const ItemMercadoSchema = z.object({
  lista_id: z.string().uuid(),
  nome: z.string().min(1, 'Nome do item obrigatório').max(150),
  quantidade: z.number().positive('Quantidade deve ser positiva'),
  unidade: z.string().max(10).default('un'),
  valor_unit: z.number().min(0).nullable().optional(),
  comprado: z.boolean().default(false),
})

export type ListaMercadoFormData = z.infer<typeof ListaMercadoSchema>
export type ItemMercadoFormData  = z.infer<typeof ItemMercadoSchema>
