export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      enterprise_ai_chats: {
        Row: {
          ai_response: string
          created_at: string
          enterprise_id: string
          id: string
          user_query: string
        }
        Insert: {
          ai_response: string
          created_at?: string
          enterprise_id: string
          id?: string
          user_query: string
        }
        Update: {
          ai_response?: string
          created_at?: string
          enterprise_id?: string
          id?: string
          user_query?: string
        }
        Relationships: []
      }
      enterprise_compliance: {
        Row: {
          compliance_type: string
          created_at: string
          description: string
          due_date: string | null
          enterprise_id: string
          id: string
          remediation_plan: string | null
          severity: string | null
          status: string
          updated_at: string
        }
        Insert: {
          compliance_type: string
          created_at?: string
          description: string
          due_date?: string | null
          enterprise_id: string
          id?: string
          remediation_plan?: string | null
          severity?: string | null
          status: string
          updated_at?: string
        }
        Update: {
          compliance_type?: string
          created_at?: string
          description?: string
          due_date?: string | null
          enterprise_id?: string
          id?: string
          remediation_plan?: string | null
          severity?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      enterprise_esg_risks: {
        Row: {
          created_at: string
          enterprise_id: string
          id: string
          impact: string
          likelihood: string
          mitigation_plan: string | null
          risk_category: string
          risk_description: string
          risk_score: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          enterprise_id: string
          id?: string
          impact: string
          likelihood: string
          mitigation_plan?: string | null
          risk_category: string
          risk_description: string
          risk_score?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          enterprise_id?: string
          id?: string
          impact?: string
          likelihood?: string
          mitigation_plan?: string | null
          risk_category?: string
          risk_description?: string
          risk_score?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      enterprise_ghg_emissions: {
        Row: {
          created_at: string
          emission_source: string
          emission_unit: string
          emission_value: number
          enterprise_id: string
          id: string
          industry_category: string
          reporting_period_end: string
          reporting_period_start: string
          scope_type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          emission_source: string
          emission_unit: string
          emission_value: number
          enterprise_id: string
          id?: string
          industry_category: string
          reporting_period_end: string
          reporting_period_start: string
          scope_type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          emission_source?: string
          emission_unit?: string
          emission_value?: number
          enterprise_id?: string
          id?: string
          industry_category?: string
          reporting_period_end?: string
          reporting_period_start?: string
          scope_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      enterprise_sdg_progress: {
        Row: {
          created_at: string
          enterprise_id: string
          id: string
          initiatives: string | null
          metrics: string | null
          progress_percentage: number
          sdg_number: number
          target_description: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          enterprise_id: string
          id?: string
          initiatives?: string | null
          metrics?: string | null
          progress_percentage: number
          sdg_number: number
          target_description: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          enterprise_id?: string
          id?: string
          initiatives?: string | null
          metrics?: string | null
          progress_percentage?: number
          sdg_number?: number
          target_description?: string
          updated_at?: string
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
