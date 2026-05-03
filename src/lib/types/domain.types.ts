import type { Database } from './database.types'

type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']

type Inserts<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert']

type Updates<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update']

export type Profile             = Tables<'profiles'>
export type Conta               = Tables<'contas'>
export type ContaInsert         = Inserts<'contas'>
export type ContaUpdate         = Updates<'contas'>

export type ListaMercado        = Tables<'listas_mercado'>
export type ItensMercado        = Tables<'itens_mercado'>
export type ItensMercadoInsert  = Inserts<'itens_mercado'>

export type SessaoCompra        = Tables<'sessoes_compra'>
export type ItemCompra          = Tables<'itens_compra'>
export type Despesa             = Tables<'despesas'>

export type Abastecimento       = Tables<'abastecimentos'>
export type AbastecimentoInsert = Inserts<'abastecimentos'>

export type UserRole = 'ADMIN' | 'USER'

export type ListaMercadoComItens = ListaMercado & {
  itens: ItensMercado[]
  total_calculado: number
  total_itens: number
  itens_comprados: number
}

export type SessaoCompraComItens = SessaoCompra & {
  itens: ItemCompra[]
}
