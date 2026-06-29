export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          city: string | null
          area: string | null
          latitude: number | null
          longitude: number | null
          is_verified: boolean
          created_at: string
        }
        Insert: {
          id: string
          name: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          city?: string | null
          area?: string | null
          latitude?: number | null
          longitude?: number | null
          is_verified?: boolean
          created_at?: string
        }
        Update: {
          name?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          city?: string | null
          area?: string | null
          latitude?: number | null
          longitude?: number | null
          is_verified?: boolean
        }
        Relationships: []
      }
      donors: {
        Row: {
          id: string
          user_id: string
          blood_group: Database["public"]["Enums"]["blood_group"]
          is_available: boolean
          last_donated: string | null
          total_donations: number
          reward_points: number
          badge: Database["public"]["Enums"]["badge_level"]
          cnic: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          blood_group: Database["public"]["Enums"]["blood_group"]
          is_available?: boolean
          last_donated?: string | null
          total_donations?: number
          reward_points?: number
          badge?: Database["public"]["Enums"]["badge_level"]
          cnic?: string | null
          created_at?: string
        }
        Update: {
          blood_group?: Database["public"]["Enums"]["blood_group"]
          is_available?: boolean
          last_donated?: string | null
          total_donations?: number
          reward_points?: number
          badge?: Database["public"]["Enums"]["badge_level"]
          cnic?: string | null
        }
        Relationships: []
      }
      blood_requests: {
        Row: {
          id: string
          request_code: string
          patient_id: string
          blood_group: Database["public"]["Enums"]["blood_group"]
          units_needed: number
          urgency: Database["public"]["Enums"]["urgency_level"]
          hospital_name: string
          city: string
          latitude: number
          longitude: number
          status: Database["public"]["Enums"]["request_status"]
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          request_code: string
          patient_id: string
          blood_group: Database["public"]["Enums"]["blood_group"]
          units_needed: number
          urgency?: Database["public"]["Enums"]["urgency_level"]
          hospital_name: string
          city: string
          latitude: number
          longitude: number
          status?: Database["public"]["Enums"]["request_status"]
          notes?: string | null
          created_at?: string
        }
        Update: {
          blood_group?: Database["public"]["Enums"]["blood_group"]
          units_needed?: number
          urgency?: Database["public"]["Enums"]["urgency_level"]
          hospital_name?: string
          city?: string
          latitude?: number
          longitude?: number
          status?: Database["public"]["Enums"]["request_status"]
          notes?: string | null
        }
        Relationships: []
      }
      donor_responses: {
        Row: {
          id: string
          request_id: string
          donor_id: string
          status: Database["public"]["Enums"]["response_status"]
          location_lat: number | null
          location_lng: number | null
          responded_at: string
        }
        Insert: {
          id?: string
          request_id: string
          donor_id: string
          status?: Database["public"]["Enums"]["response_status"]
          location_lat?: number | null
          location_lng?: number | null
          responded_at?: string
        }
        Update: {
          status?: Database["public"]["Enums"]["response_status"]
          location_lat?: number | null
          location_lng?: number | null
        }
        Relationships: []
      }
      hospitals: {
        Row: {
          id: string
          user_id: string
          name: string
          address: string | null
          city: string
          latitude: number | null
          longitude: number | null
          phone: string | null
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          address?: string | null
          city: string
          latitude?: number | null
          longitude?: number | null
          phone?: string | null
        }
        Update: {
          name?: string
          address?: string | null
          city?: string
          latitude?: number | null
          longitude?: number | null
          phone?: string | null
        }
        Relationships: []
      }
      blood_inventory: {
        Row: {
          id: string
          hospital_id: string
          blood_group: Database["public"]["Enums"]["blood_group"]
          units: number
          max_units: number
          updated_at: string
        }
        Insert: {
          id?: string
          hospital_id: string
          blood_group: Database["public"]["Enums"]["blood_group"]
          units?: number
          max_units?: number
          updated_at?: string
        }
        Update: {
          units?: number
          max_units?: number
          updated_at?: string
        }
        Relationships: []
      }
      donations: {
        Row: {
          id: string
          donor_id: string
          request_id: string | null
          hospital_name: string
          blood_group: Database["public"]["Enums"]["blood_group"]
          units: number
          donated_at: string
        }
        Insert: {
          id?: string
          donor_id: string
          request_id?: string | null
          hospital_name: string
          blood_group: Database["public"]["Enums"]["blood_group"]
          units?: number
          donated_at?: string
        }
        Update: {
          request_id?: string | null
          hospital_name?: string
          blood_group?: Database["public"]["Enums"]["blood_group"]
          units?: number
          donated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: Database["public"]["Enums"]["notification_type"]
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          type?: Database["public"]["Enums"]["notification_type"]
          is_read?: boolean
          created_at?: string
        }
        Update: {
          title?: string
          message?: string
          type?: Database["public"]["Enums"]["notification_type"]
          is_read?: boolean
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
      user_role: "donor" | "patient" | "hospital" | "admin"
      blood_group: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-"
      badge_level: "none" | "bronze" | "silver" | "gold" | "lifesaver"
      urgency_level: "critical" | "high" | "normal"
      request_status: "submitted" | "matching" | "accepted" | "en_route" | "delivered" | "cancelled"
      response_status: "accepted" | "rejected" | "pending"
      notification_type: "sos" | "request" | "reward" | "info"
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
      user_role: ["donor", "patient", "hospital", "admin"],
      blood_group: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      badge_level: ["none", "bronze", "silver", "gold", "lifesaver"],
      urgency_level: ["critical", "high", "normal"],
      request_status: ["submitted", "matching", "accepted", "en_route", "delivered", "cancelled"],
      response_status: ["accepted", "rejected", "pending"],
      notification_type: ["sos", "request", "reward", "info"],
    },
  },
} as const
