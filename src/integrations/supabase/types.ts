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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      daily_completions: {
        Row: {
          completed_at: string
          daily_mission_id: string
          day: string
          user_id: string
        }
        Insert: {
          completed_at?: string
          daily_mission_id: string
          day?: string
          user_id?: string
        }
        Update: {
          completed_at?: string
          daily_mission_id?: string
          day?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_completions_daily_mission_id_fkey"
            columns: ["daily_mission_id"]
            isOneToOne: false
            referencedRelation: "daily_missions"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_missions: {
        Row: {
          id: string
          sort: number
          title: string
          xp: number
        }
        Insert: {
          id?: string
          sort: number
          title: string
          xp?: number
        }
        Update: {
          id?: string
          sort?: number
          title?: string
          xp?: number
        }
        Relationships: []
      }
      mission_steps: {
        Row: {
          id: string
          mission_id: string
          position: number
          title: string
        }
        Insert: {
          id?: string
          mission_id: string
          position: number
          title: string
        }
        Update: {
          id?: string
          mission_id?: string
          position?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "mission_steps_mission_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "missions"
            referencedColumns: ["id"]
          },
        ]
      }
      missions: {
        Row: {
          category: string
          description: string
          difficulty: string
          ends_at: string
          id: string
          sort: number
          starts_at: string
          title: string
          xp_bonus: number
          xp_per_step: number
        }
        Insert: {
          category: string
          description: string
          difficulty: string
          ends_at?: string
          id?: string
          sort?: number
          starts_at?: string
          title: string
          xp_bonus?: number
          xp_per_step?: number
        }
        Update: {
          category?: string
          description?: string
          difficulty?: string
          ends_at?: string
          id?: string
          sort?: number
          starts_at?: string
          title?: string
          xp_bonus?: number
          xp_per_step?: number
        }
        Relationships: []
      }
      opportunities: {
        Row: {
          category: string
          description: string
          details: string
          id: string
          level: string
          published_at: string
          tags: string[]
          title: string
        }
        Insert: {
          category: string
          description: string
          details: string
          id?: string
          level: string
          published_at?: string
          tags?: string[]
          title: string
        }
        Update: {
          category?: string
          description?: string
          details?: string
          id?: string
          level?: string
          published_at?: string
          tags?: string[]
          title?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          id?: string
        }
        Relationships: []
      }
      project_ideas: {
        Row: {
          audience: string
          created_at: string
          description: string
          difficulty: string
          first_steps: string
          id: string
          monetization: string
          name: string
          problem: string
          solution: string
          user_id: string
        }
        Insert: {
          audience?: string
          created_at?: string
          description?: string
          difficulty?: string
          first_steps?: string
          id?: string
          monetization?: string
          name: string
          problem?: string
          solution?: string
          user_id?: string
        }
        Update: {
          audience?: string
          created_at?: string
          description?: string
          difficulty?: string
          first_steps?: string
          id?: string
          monetization?: string
          name?: string
          problem?: string
          solution?: string
          user_id?: string
        }
        Relationships: []
      }
      project_tasks: {
        Row: {
          done: boolean
          done_at: string | null
          id: string
          position: number
          project_id: string
          title: string
          user_id: string
        }
        Insert: {
          done?: boolean
          done_at?: string | null
          id?: string
          position?: number
          project_id: string
          title: string
          user_id?: string
        }
        Update: {
          done?: boolean
          done_at?: string | null
          id?: string
          position?: number
          project_id?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          category: string
          created_at: string
          description: string
          id: string
          name: string
          notes: string
          status: string
          user_id: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string
          id?: string
          name: string
          notes?: string
          status?: string
          user_id?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          id?: string
          name?: string
          notes?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      subscription_events: {
        Row: {
          created_at: string
          email: string | null
          event_type: string | null
          id: string
          next_renewal: string | null
          order_id: string | null
          payload: Json
          plan: string | null
          product_id: string | null
          started_at: string | null
          status: string | null
          subscription_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          event_type?: string | null
          id?: string
          next_renewal?: string | null
          order_id?: string | null
          payload?: Json
          plan?: string | null
          product_id?: string | null
          started_at?: string | null
          status?: string | null
          subscription_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          event_type?: string | null
          id?: string
          next_renewal?: string | null
          order_id?: string | null
          payload?: Json
          plan?: string | null
          product_id?: string | null
          started_at?: string | null
          status?: string | null
          subscription_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          base_active: boolean
          base_next_renewal: string | null
          base_status: string | null
          base_subscription_id: string | null
          pro_active: boolean
          pro_next_renewal: string | null
          pro_status: string | null
          pro_subscription_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          base_active?: boolean
          base_next_renewal?: string | null
          base_status?: string | null
          base_subscription_id?: string | null
          pro_active?: boolean
          pro_next_renewal?: string | null
          pro_status?: string | null
          pro_subscription_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          base_active?: boolean
          base_next_renewal?: string | null
          base_status?: string | null
          base_subscription_id?: string | null
          pro_active?: boolean
          pro_next_renewal?: string | null
          pro_status?: string | null
          pro_subscription_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_step_progress: {
        Row: {
          completed_at: string
          step_id: string
          user_id: string
        }
        Insert: {
          completed_at?: string
          step_id: string
          user_id?: string
        }
        Update: {
          completed_at?: string
          step_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_step_progress_step_id_fkey"
            columns: ["step_id"]
            isOneToOne: false
            referencedRelation: "mission_steps"
            referencedColumns: ["id"]
          },
        ]
      }
      xp_events: {
        Row: {
          amount: number
          created_at: string
          id: string
          reason: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          reason: string
          user_id?: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          reason?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_base: { Args: { _user_id: string }; Returns: boolean }
      has_pro: { Args: { _user_id: string }; Returns: boolean }
      user_id_by_email: { Args: { _email: string }; Returns: string }
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
