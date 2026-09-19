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
      admins: {
        Row: {
          created_at: string
          email: string
          id: string
          password_hash: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          password_hash: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          password_hash?: string
        }
        Relationships: []
      }
      governorates: {
        Row: {
          id: string
          name: string
          shipping_cost: number
          sort_order: number
        }
        Insert: {
          id?: string
          name: string
          shipping_cost?: number
          sort_order?: number
        }
        Update: {
          id?: string
          name?: string
          shipping_cost?: number
          sort_order?: number
        }
        Relationships: []
      }
      leads: {
        Row: {
          created_at: string
          email: string
          email_consent: boolean
          id: string
          phone: string | null
          promo_code: string | null
          sms_consent: boolean
          source: string
        }
        Insert: {
          created_at?: string
          email: string
          email_consent?: boolean
          id?: string
          phone?: string | null
          promo_code?: string | null
          sms_consent?: boolean
          source?: string
        }
        Update: {
          created_at?: string
          email?: string
          email_consent?: boolean
          id?: string
          phone?: string | null
          promo_code?: string | null
          sms_consent?: boolean
          source?: string
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          source: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          source?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          source?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          address_line: string
          city: string | null
          created_at: string
          discount: number
          email: string
          full_name: string
          governorate: string
          id: string
          items: Json
          notes: string | null
          order_number: string
          payer_account: string | null
          payer_name: string | null
          payment_method: string
          payment_proof_path: string | null
          phone: string
          promo_code: string | null
          shipping_cost: number
          status: string
          subtotal: number
          total: number
          transfer_amount: number | null
        }
        Insert: {
          address_line: string
          city?: string | null
          created_at?: string
          discount?: number
          email: string
          full_name: string
          governorate: string
          id?: string
          items?: Json
          notes?: string | null
          order_number?: string
          payer_account?: string | null
          payer_name?: string | null
          payment_method: string
          payment_proof_path?: string | null
          phone: string
          promo_code?: string | null
          shipping_cost?: number
          status?: string
          subtotal?: number
          total?: number
          transfer_amount?: number | null
        }
        Update: {
          address_line?: string
          city?: string | null
          created_at?: string
          discount?: number
          email?: string
          full_name?: string
          governorate?: string
          id?: string
          items?: Json
          notes?: string | null
          order_number?: string
          payer_account?: string | null
          payer_name?: string | null
          payment_method?: string
          payment_proof_path?: string | null
          phone?: string
          promo_code?: string | null
          shipping_cost?: number
          status?: string
          subtotal?: number
          total?: number
          transfer_amount?: number | null
        }
        Relationships: []
      }
      products: {
        Row: {
          brand: string
          category: string
          colors: Json
          created_at: string
          description: string
          details: string
          id: string
          images: Json
          is_best_seller: boolean
          is_new: boolean
          name: string
          old_price: number | null
          price: number
          rating: number
          sizes: string[]
          slug: string
          sold_out: boolean
          stock: number
        }
        Insert: {
          brand?: string
          category: string
          colors?: Json
          created_at?: string
          description?: string
          details?: string
          id?: string
          images?: Json
          is_best_seller?: boolean
          is_new?: boolean
          name: string
          old_price?: number | null
          price: number
          rating?: number
          sizes?: string[]
          slug: string
          sold_out?: boolean
          stock?: number
        }
        Update: {
          brand?: string
          category?: string
          colors?: Json
          created_at?: string
          description?: string
          details?: string
          id?: string
          images?: Json
          is_best_seller?: boolean
          is_new?: boolean
          name?: string
          old_price?: number | null
          price?: number
          rating?: number
          sizes?: string[]
          slug?: string
          sold_out?: boolean
          stock?: number
        }
        Relationships: []
      }
      promo_codes: {
        Row: {
          active: boolean
          code: string
          created_at: string
          current_uses: number
          expires_at: string | null
          id: string
          max_uses: number
          percent_off: number
          valid_days: number
        }
        Insert: {
          active?: boolean
          code: string
          created_at?: string
          current_uses?: number
          expires_at?: string | null
          id?: string
          max_uses?: number
          percent_off?: number
          valid_days?: number
        }
        Update: {
          active?: boolean
          code?: string
          created_at?: string
          current_uses?: number
          expires_at?: string | null
          id?: string
          max_uses?: number
          percent_off?: number
          valid_days?: number
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          customer_name: string
          id: string
          location: string
          quote: string
          rating: number
          sort_order: number
        }
        Insert: {
          customer_name: string
          id?: string
          location?: string
          quote: string
          rating?: number
          sort_order?: number
        }
        Update: {
          customer_name?: string
          id?: string
          location?: string
          quote?: string
          rating?: number
          sort_order?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
