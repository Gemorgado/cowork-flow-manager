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
      benefits: {
        Row: {
          description: string
          id: string
          name: string
        }
        Insert: {
          description: string
          id?: string
          name: string
        }
        Update: {
          description?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      client_service_locations: {
        Row: {
          client_service_id: string
          location_id: string
          location_type: string
        }
        Insert: {
          client_service_id: string
          location_id: string
          location_type: string
        }
        Update: {
          client_service_id?: string
          location_id?: string
          location_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_service_locations_client_service_id_fkey"
            columns: ["client_service_id"]
            isOneToOne: false
            referencedRelation: "client_services"
            referencedColumns: ["id"]
          },
        ]
      }
      client_services: {
        Row: {
          client_id: string
          created_at: string | null
          end_date: string
          id: string
          service_id: string
          start_date: string
          updated_at: string | null
          value: number
        }
        Insert: {
          client_id: string
          created_at?: string | null
          end_date: string
          id?: string
          service_id: string
          start_date: string
          updated_at?: string | null
          value: number
        }
        Update: {
          client_id?: string
          created_at?: string | null
          end_date?: string
          id?: string
          service_id?: string
          start_date?: string
          updated_at?: string | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "client_services_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_services_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          address: string
          company_name: string
          created_at: string | null
          document: string
          due_day: number
          email: string
          end_date: string
          id: string
          loyalty_months: number
          phone: string
          start_date: string
          trade_name: string
          updated_at: string | null
          value: number
        }
        Insert: {
          address: string
          company_name: string
          created_at?: string | null
          document: string
          due_day: number
          email: string
          end_date: string
          id?: string
          loyalty_months?: number
          phone: string
          start_date: string
          trade_name: string
          updated_at?: string | null
          value?: number
        }
        Update: {
          address?: string
          company_name?: string
          created_at?: string | null
          document?: string
          due_day?: number
          email?: string
          end_date?: string
          id?: string
          loyalty_months?: number
          phone?: string
          start_date?: string
          trade_name?: string
          updated_at?: string | null
          value?: number
        }
        Relationships: []
      }
      plan_prices: {
        Row: {
          created_at: string | null
          discount: number | null
          id: string
          installments: number | null
          period: Database["public"]["Enums"]["plan_period"]
          price: number
          service_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          discount?: number | null
          id?: string
          installments?: number | null
          period: Database["public"]["Enums"]["plan_period"]
          price: number
          service_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          discount?: number | null
          id?: string
          installments?: number | null
          period?: Database["public"]["Enums"]["plan_period"]
          price?: number
          service_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "plan_prices_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          created_at: string | null
          email: string
          id: string
          name: string
          permissions: string[] | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          email: string
          id: string
          name: string
          permissions?: string[] | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          permissions?: string[] | null
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      rooms: {
        Row: {
          area: number
          capacity: number
          client_id: string | null
          created_at: string | null
          floor: Database["public"]["Enums"]["floor_number"]
          id: string
          number: string
          status: Database["public"]["Enums"]["location_status"]
          updated_at: string | null
        }
        Insert: {
          area: number
          capacity: number
          client_id?: string | null
          created_at?: string | null
          floor: Database["public"]["Enums"]["floor_number"]
          id?: string
          number: string
          status?: Database["public"]["Enums"]["location_status"]
          updated_at?: string | null
        }
        Update: {
          area?: number
          capacity?: number
          client_id?: string | null
          created_at?: string | null
          floor?: Database["public"]["Enums"]["floor_number"]
          id?: string
          number?: string
          status?: Database["public"]["Enums"]["location_status"]
          updated_at?: string | null
        }
        Relationships: []
      }
      service_benefits: {
        Row: {
          benefit_id: string
          service_id: string
        }
        Insert: {
          benefit_id: string
          service_id: string
        }
        Update: {
          benefit_id?: string
          service_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_benefits_benefit_id_fkey"
            columns: ["benefit_id"]
            isOneToOne: false
            referencedRelation: "benefits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_benefits_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          created_at: string | null
          description: string
          id: string
          name: string
          type: Database["public"]["Enums"]["service_type"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          name: string
          type: Database["public"]["Enums"]["service_type"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          name?: string
          type?: Database["public"]["Enums"]["service_type"]
          updated_at?: string | null
        }
        Relationships: []
      }
      workstations: {
        Row: {
          client_id: string | null
          created_at: string | null
          floor: Database["public"]["Enums"]["floor_number"]
          id: string
          number: string
          status: Database["public"]["Enums"]["location_status"]
          type: string
          updated_at: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          floor: Database["public"]["Enums"]["floor_number"]
          id?: string
          number: string
          status?: Database["public"]["Enums"]["location_status"]
          type: string
          updated_at?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          floor?: Database["public"]["Enums"]["floor_number"]
          id?: string
          number?: string
          status?: Database["public"]["Enums"]["location_status"]
          type?: string
          updated_at?: string | null
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
      floor_number: "1" | "2" | "3"
      location_status:
        | "available"
        | "occupied"
        | "flex"
        | "reserved"
        | "maintenance"
      plan_period: "daily" | "weekly" | "monthly" | "biannual" | "annual"
      service_type:
        | "fiscal_address"
        | "flex_station"
        | "fixed_station"
        | "private_room"
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
    Enums: {
      floor_number: ["1", "2", "3"],
      location_status: [
        "available",
        "occupied",
        "flex",
        "reserved",
        "maintenance",
      ],
      plan_period: ["daily", "weekly", "monthly", "biannual", "annual"],
      service_type: [
        "fiscal_address",
        "flex_station",
        "fixed_station",
        "private_room",
      ],
    },
  },
} as const
