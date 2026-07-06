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
      emergency_contacts: {
        Row: {
          created_at: string
          id: string
          is_primary: boolean
          name: string
          phone: string
          priority: number
          relationship: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_primary?: boolean
          name: string
          phone: string
          priority?: number
          relationship?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_primary?: boolean
          name?: string
          phone?: string
          priority?: number
          relationship?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      incident_reports: {
        Row: {
          address: string | null
          category: Database["public"]["Enums"]["incident_category"]
          created_at: string
          description: string
          id: string
          incident_time: string | null
          is_anonymous: boolean
          latitude: number | null
          longitude: number | null
          media_urls: string[] | null
          status: string
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          address?: string | null
          category: Database["public"]["Enums"]["incident_category"]
          created_at?: string
          description: string
          id?: string
          incident_time?: string | null
          is_anonymous?: boolean
          latitude?: number | null
          longitude?: number | null
          media_urls?: string[] | null
          status?: string
          title: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          address?: string | null
          category?: Database["public"]["Enums"]["incident_category"]
          created_at?: string
          description?: string
          id?: string
          incident_time?: string | null
          is_anonymous?: boolean
          latitude?: number | null
          longitude?: number | null
          media_urls?: string[] | null
          status?: string
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          blood_group: string | null
          created_at: string
          date_of_birth: string | null
          full_name: string | null
          home_address: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          blood_group?: string | null
          created_at?: string
          date_of_birth?: string | null
          full_name?: string | null
          home_address?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          blood_group?: string | null
          created_at?: string
          date_of_birth?: string | null
          full_name?: string | null
          home_address?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      sos_alerts: {
        Row: {
          accuracy: number | null
          address: string | null
          alert_type: Database["public"]["Enums"]["sos_type"]
          audio_url: string | null
          battery_level: number | null
          created_at: string
          id: string
          latitude: number | null
          longitude: number | null
          notes: string | null
          resolved_at: string | null
          responded_at: string | null
          responded_by: string | null
          status: Database["public"]["Enums"]["sos_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          accuracy?: number | null
          address?: string | null
          alert_type?: Database["public"]["Enums"]["sos_type"]
          audio_url?: string | null
          battery_level?: number | null
          created_at?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          notes?: string | null
          resolved_at?: string | null
          responded_at?: string | null
          responded_by?: string | null
          status?: Database["public"]["Enums"]["sos_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          accuracy?: number | null
          address?: string | null
          alert_type?: Database["public"]["Enums"]["sos_type"]
          audio_url?: string | null
          battery_level?: number | null
          created_at?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          notes?: string | null
          resolved_at?: string | null
          responded_at?: string | null
          responded_by?: string | null
          status?: Database["public"]["Enums"]["sos_status"]
          updated_at?: string
          user_id?: string
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
      app_role: "user" | "police" | "admin"
      incident_category:
        | "harassment"
        | "stalking"
        | "theft"
        | "domestic_violence"
        | "assault"
        | "other"
      sos_status: "active" | "acknowledged" | "resolved" | "false_alarm"
      sos_type: "panic" | "silent" | "voice" | "timer"
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
      app_role: ["user", "police", "admin"],
      incident_category: [
        "harassment",
        "stalking",
        "theft",
        "domestic_violence",
        "assault",
        "other",
      ],
      sos_status: ["active", "acknowledged", "resolved", "false_alarm"],
      sos_type: ["panic", "silent", "voice", "timer"],
    },
  },
} as const
