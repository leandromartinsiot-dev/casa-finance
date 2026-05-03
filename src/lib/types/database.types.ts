export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      abastecimentos: {
        Row: {
          created_at: string
          created_by: string
          data_abastecimento: string
          id: string
          km_atual: number | null
          litros: number
          posto: string | null
          preco_litro: number | null
          tipo_combustivel: string
          valor_total: number
          veiculo: string | null
        }
        Insert: {
          created_at?: string
          created_by: string
          data_abastecimento?: string
          id?: string
          km_atual?: number | null
          litros: number
          posto?: string | null
          preco_litro?: number | null
          tipo_combustivel?: string
          valor_total: number
          veiculo?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string
          data_abastecimento?: string
          id?: string
          km_atual?: number | null
          litros?: number
          posto?: string | null
          preco_litro?: number | null
          tipo_combustivel?: string
          valor_total?: number
          veiculo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "abastecimentos_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      contas: {
        Row: {
          created_at: string
          created_by: string
          data_pagamento: string | null
          descricao: string | null
          id: string
          pago: boolean
          tipo: string
          updated_at: string
          valor: number
          vencimento: string
        }
        Insert: {
          created_at?: string
          created_by: string
          data_pagamento?: string | null
          descricao?: string | null
          id?: string
          pago?: boolean
          tipo: string
          updated_at?: string
          valor: number
          vencimento: string
        }
        Update: {
          created_at?: string
          created_by?: string
          data_pagamento?: string | null
          descricao?: string | null
          id?: string
          pago?: boolean
          tipo?: string
          updated_at?: string
          valor?: number
          vencimento?: string
        }
        Relationships: [
          {
            foreignKeyName: "contas_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      despesas: {
        Row: {
          created_at: string
          created_by: string
          data_compra: string
          descricao: string
          id: string
          sessao_id: string | null
          valor_total: number
        }
        Insert: {
          created_at?: string
          created_by: string
          data_compra?: string
          descricao: string
          id?: string
          sessao_id?: string | null
          valor_total: number
        }
        Update: {
          created_at?: string
          created_by?: string
          data_compra?: string
          descricao?: string
          id?: string
          sessao_id?: string | null
          valor_total?: number
        }
        Relationships: [
          {
            foreignKeyName: "despesas_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "despesas_sessao_id_fkey"
            columns: ["sessao_id"]
            isOneToOne: false
            referencedRelation: "sessoes_compra"
            referencedColumns: ["id"]
          },
        ]
      }
      itens_compra: {
        Row: {
          created_at: string
          id: string
          nome: string
          quantidade: number
          sessao_id: string
          valor: number
        }
        Insert: {
          created_at?: string
          id?: string
          nome: string
          quantidade?: number
          sessao_id: string
          valor: number
        }
        Update: {
          created_at?: string
          id?: string
          nome?: string
          quantidade?: number
          sessao_id?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "itens_compra_sessao_id_fkey"
            columns: ["sessao_id"]
            isOneToOne: false
            referencedRelation: "sessoes_compra"
            referencedColumns: ["id"]
          },
        ]
      }
      itens_mercado: {
        Row: {
          comprado: boolean
          created_at: string
          id: string
          lista_id: string
          nome: string
          quantidade: number
          unidade: string | null
          valor_unit: number | null
        }
        Insert: {
          comprado?: boolean
          created_at?: string
          id?: string
          lista_id: string
          nome: string
          quantidade?: number
          unidade?: string | null
          valor_unit?: number | null
        }
        Update: {
          comprado?: boolean
          created_at?: string
          id?: string
          lista_id?: string
          nome?: string
          quantidade?: number
          unidade?: string | null
          valor_unit?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "itens_mercado_lista_id_fkey"
            columns: ["lista_id"]
            isOneToOne: false
            referencedRelation: "listas_mercado"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "itens_mercado_lista_id_fkey"
            columns: ["lista_id"]
            isOneToOne: false
            referencedRelation: "v_listas_mercado_totais"
            referencedColumns: ["id"]
          },
        ]
      }
      listas_mercado: {
        Row: {
          created_at: string
          created_by: string
          id: string
          nome: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          nome?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          nome?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "listas_mercado_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id: string
          role?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      sessoes_compra: {
        Row: {
          created_at: string
          created_by: string
          descricao: string
          estado: string
          id: string
          total: number
        }
        Insert: {
          created_at?: string
          created_by: string
          descricao?: string
          estado?: string
          id?: string
          total?: number
        }
        Update: {
          created_at?: string
          created_by?: string
          descricao?: string
          estado?: string
          id?: string
          total?: number
        }
        Relationships: [
          {
            foreignKeyName: "sessoes_compra_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      v_consumo_veiculo: {
        Row: {
          created_by: string | null
          km_percorridos: number | null
          preco_medio_litro: number | null
          total_abastecimentos: number | null
          total_gasto: number | null
          total_litros: number | null
          veiculo: string | null
        }
        Relationships: [
          {
            foreignKeyName: "abastecimentos_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      v_listas_mercado_totais: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string | null
          itens_comprados: number | null
          nome: string | null
          total_calculado: number | null
          total_itens: number | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "listas_mercado_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      get_my_role: { Args: never; Returns: string }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
