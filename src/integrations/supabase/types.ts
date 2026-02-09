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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      activities: {
        Row: {
          created_at: string
          icon: string | null
          id: string
          related_id: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          icon?: string | null
          id?: string
          related_id?: string | null
          title: string
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          icon?: string | null
          id?: string
          related_id?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      campaigns: {
        Row: {
          budget: number | null
          channels: string[] | null
          conversions: number | null
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          leads_count: number | null
          name: string
          revenue: number | null
          spent: number | null
          start_date: string | null
          status: Database["public"]["Enums"]["campaign_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          budget?: number | null
          channels?: string[] | null
          conversions?: number | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          leads_count?: number | null
          name: string
          revenue?: number | null
          spent?: number | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["campaign_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          budget?: number | null
          channels?: string[] | null
          conversions?: number | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          leads_count?: number | null
          name?: string
          revenue?: number | null
          spent?: number | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["campaign_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      contract_templates: {
        Row: {
          academic_year: string
          created_at: string
          field_mapping: Json | null
          id: string
          is_active: boolean | null
          language: string
          name: string
          template_content: string
          updated_at: string
          user_id: string
        }
        Insert: {
          academic_year: string
          created_at?: string
          field_mapping?: Json | null
          id?: string
          is_active?: boolean | null
          language?: string
          name: string
          template_content?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          academic_year?: string
          created_at?: string
          field_mapping?: Json | null
          id?: string
          is_active?: boolean | null
          language?: string
          name?: string
          template_content?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      contracts: {
        Row: {
          academic_year: string
          contract_data: Json
          contract_number: string
          created_at: string
          docx_url: string | null
          grade: number
          id: string
          language: string
          pdf_url: string | null
          sent_at: string | null
          signed_at: string | null
          status: string
          updated_at: string
          user_id: string
          visitor_id: string
        }
        Insert: {
          academic_year?: string
          contract_data?: Json
          contract_number: string
          created_at?: string
          docx_url?: string | null
          grade: number
          id?: string
          language?: string
          pdf_url?: string | null
          sent_at?: string | null
          signed_at?: string | null
          status?: string
          updated_at?: string
          user_id: string
          visitor_id: string
        }
        Update: {
          academic_year?: string
          contract_data?: Json
          contract_number?: string
          created_at?: string
          docx_url?: string | null
          grade?: number
          id?: string
          language?: string
          pdf_url?: string | null
          sent_at?: string | null
          signed_at?: string | null
          status?: string
          updated_at?: string
          user_id?: string
          visitor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contracts_visitor_id_fkey"
            columns: ["visitor_id"]
            isOneToOne: false
            referencedRelation: "visitors"
            referencedColumns: ["id"]
          },
        ]
      }
      email_templates: {
        Row: {
          body_html: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          subject: string
          template_type: string
          updated_at: string
          variables: string[] | null
        }
        Insert: {
          body_html: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          subject: string
          template_type: string
          updated_at?: string
          variables?: string[] | null
        }
        Update: {
          body_html?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          subject?: string
          template_type?: string
          updated_at?: string
          variables?: string[] | null
        }
        Relationships: []
      }
      leads: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          notes: string | null
          phone: string | null
          source: string | null
          status: Database["public"]["Enums"]["lead_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          source?: string | null
          status?: Database["public"]["Enums"]["lead_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          source?: string | null
          status?: Database["public"]["Enums"]["lead_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      pricing: {
        Row: {
          created_at: string
          deposit_amount: number
          extended_stay_fee: number
          id: string
          is_active: boolean
          registration_fee_domestic: number
          registration_fee_foreign: number
          school_year: string
          sibling_discount_2nd: number
          sibling_discount_3rd: number
          tuition_1_4_domestic: number
          tuition_1_4_foreign: number
          tuition_5_9_domestic: number
          tuition_5_9_foreign: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          deposit_amount?: number
          extended_stay_fee?: number
          id?: string
          is_active?: boolean
          registration_fee_domestic?: number
          registration_fee_foreign?: number
          school_year: string
          sibling_discount_2nd?: number
          sibling_discount_3rd?: number
          tuition_1_4_domestic?: number
          tuition_1_4_foreign?: number
          tuition_5_9_domestic?: number
          tuition_5_9_foreign?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          deposit_amount?: number
          extended_stay_fee?: number
          id?: string
          is_active?: boolean
          registration_fee_domestic?: number
          registration_fee_foreign?: number
          school_year?: string
          sibling_discount_2nd?: number
          sibling_discount_3rd?: number
          tuition_1_4_domestic?: number
          tuition_1_4_foreign?: number
          tuition_5_9_domestic?: number
          tuition_5_9_foreign?: number
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          language: string | null
          theme: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          language?: string | null
          theme?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          language?: string | null
          theme?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      visitors: {
        Row: {
          after_visit_email_sent_at: string | null
          child_address: string
          child_citizenship: string
          child_date_of_birth: string
          child_first_name: string
          child_last_name: string
          created_at: string
          deposit_amount: number | null
          enrollment_decision:
            | Database["public"]["Enums"]["enrollment_decision"]
            | null
          enrollment_decision_notes: string | null
          enrollment_semester: number | null
          extended_stay_fee: number | null
          father_email: string | null
          father_first_name: string | null
          father_last_name: string | null
          father_phone: string | null
          father_profession: string | null
          guardian_email: string | null
          guardian_phone: string | null
          id: string
          months_to_pay: number | null
          mother_email: string | null
          mother_first_name: string | null
          mother_last_name: string | null
          mother_phone: string | null
          mother_profession: string | null
          payment_type: Database["public"]["Enums"]["payment_type"]
          referral_source: string | null
          registration_fee: number | null
          registration_fee_waived: boolean | null
          resident_type: Database["public"]["Enums"]["resident_type"]
          scholarship_percent: number | null
          scholarship_type: string | null
          sibling_discount_percent: number | null
          status: Database["public"]["Enums"]["visitor_status"]
          target_grade: Database["public"]["Enums"]["grade_level"] | null
          target_school_year: string | null
          total_amount_due: number | null
          total_tuition_after_discounts: number | null
          tuition_fee: number | null
          updated_at: string
          user_id: string
          uses_extended_stay: boolean | null
          visit_date: string | null
          visit_notes: string | null
          visit_scheduled_at: string | null
          visit_type: Database["public"]["Enums"]["visit_type"]
        }
        Insert: {
          after_visit_email_sent_at?: string | null
          child_address: string
          child_citizenship: string
          child_date_of_birth: string
          child_first_name: string
          child_last_name: string
          created_at?: string
          deposit_amount?: number | null
          enrollment_decision?:
            | Database["public"]["Enums"]["enrollment_decision"]
            | null
          enrollment_decision_notes?: string | null
          enrollment_semester?: number | null
          extended_stay_fee?: number | null
          father_email?: string | null
          father_first_name?: string | null
          father_last_name?: string | null
          father_phone?: string | null
          father_profession?: string | null
          guardian_email?: string | null
          guardian_phone?: string | null
          id?: string
          months_to_pay?: number | null
          mother_email?: string | null
          mother_first_name?: string | null
          mother_last_name?: string | null
          mother_phone?: string | null
          mother_profession?: string | null
          payment_type?: Database["public"]["Enums"]["payment_type"]
          referral_source?: string | null
          registration_fee?: number | null
          registration_fee_waived?: boolean | null
          resident_type?: Database["public"]["Enums"]["resident_type"]
          scholarship_percent?: number | null
          scholarship_type?: string | null
          sibling_discount_percent?: number | null
          status?: Database["public"]["Enums"]["visitor_status"]
          target_grade?: Database["public"]["Enums"]["grade_level"] | null
          target_school_year?: string | null
          total_amount_due?: number | null
          total_tuition_after_discounts?: number | null
          tuition_fee?: number | null
          updated_at?: string
          user_id: string
          uses_extended_stay?: boolean | null
          visit_date?: string | null
          visit_notes?: string | null
          visit_scheduled_at?: string | null
          visit_type?: Database["public"]["Enums"]["visit_type"]
        }
        Update: {
          after_visit_email_sent_at?: string | null
          child_address?: string
          child_citizenship?: string
          child_date_of_birth?: string
          child_first_name?: string
          child_last_name?: string
          created_at?: string
          deposit_amount?: number | null
          enrollment_decision?:
            | Database["public"]["Enums"]["enrollment_decision"]
            | null
          enrollment_decision_notes?: string | null
          enrollment_semester?: number | null
          extended_stay_fee?: number | null
          father_email?: string | null
          father_first_name?: string | null
          father_last_name?: string | null
          father_phone?: string | null
          father_profession?: string | null
          guardian_email?: string | null
          guardian_phone?: string | null
          id?: string
          months_to_pay?: number | null
          mother_email?: string | null
          mother_first_name?: string | null
          mother_last_name?: string | null
          mother_phone?: string | null
          mother_profession?: string | null
          payment_type?: Database["public"]["Enums"]["payment_type"]
          referral_source?: string | null
          registration_fee?: number | null
          registration_fee_waived?: boolean | null
          resident_type?: Database["public"]["Enums"]["resident_type"]
          scholarship_percent?: number | null
          scholarship_type?: string | null
          sibling_discount_percent?: number | null
          status?: Database["public"]["Enums"]["visitor_status"]
          target_grade?: Database["public"]["Enums"]["grade_level"] | null
          target_school_year?: string | null
          total_amount_due?: number | null
          total_tuition_after_discounts?: number | null
          tuition_fee?: number | null
          updated_at?: string
          user_id?: string
          uses_extended_stay?: boolean | null
          visit_date?: string | null
          visit_notes?: string | null
          visit_scheduled_at?: string | null
          visit_type?: Database["public"]["Enums"]["visit_type"]
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "manager" | "user"
      campaign_status: "active" | "paused" | "completed" | "draft"
      enrollment_decision:
        | "approved"
        | "conditional"
        | "rejected"
        | "pending_review"
      grade_level: "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"
      lead_status: "new" | "contacted" | "qualified" | "converted" | "rejected"
      payment_type: "full" | "installments"
      resident_type: "domestic" | "foreign"
      visit_type: "in_person" | "online"
      visitor_status:
        | "scheduled"
        | "visited"
        | "enrolled"
        | "rejected"
        | "pending"
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
    Enums: {
      app_role: ["admin", "manager", "user"],
      campaign_status: ["active", "paused", "completed", "draft"],
      enrollment_decision: [
        "approved",
        "conditional",
        "rejected",
        "pending_review",
      ],
      grade_level: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
      lead_status: ["new", "contacted", "qualified", "converted", "rejected"],
      payment_type: ["full", "installments"],
      resident_type: ["domestic", "foreign"],
      visit_type: ["in_person", "online"],
      visitor_status: [
        "scheduled",
        "visited",
        "enrolled",
        "rejected",
        "pending",
      ],
    },
  },
} as const
