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
      bookings: {
        Row: {
          booking_id: string
          check_in: string
          check_out: string
          created_at: string | null
          guest_email: string | null
          guest_name: string
          guest_phone: string | null
          id: string
          nights: number
          payment_status: string | null
          room_number: string | null
          room_type: string | null
          special_requests: string | null
          status: string
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          booking_id: string
          check_in: string
          check_out: string
          created_at?: string | null
          guest_email?: string | null
          guest_name: string
          guest_phone?: string | null
          id?: string
          nights: number
          payment_status?: string | null
          room_number?: string | null
          room_type?: string | null
          special_requests?: string | null
          status: string
          total_amount: number
          updated_at?: string | null
        }
        Update: {
          booking_id?: string
          check_in?: string
          check_out?: string
          created_at?: string | null
          guest_email?: string | null
          guest_name?: string
          guest_phone?: string | null
          id?: string
          nights?: number
          payment_status?: string | null
          room_number?: string | null
          room_type?: string | null
          special_requests?: string | null
          status?: string
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      campaigns: {
        Row: {
          audience: string | null
          budget: number | null
          created_at: string | null
          end_date: string | null
          id: string
          name: string
          owner: string | null
          progress: number | null
          property: string | null
          spent: number | null
          start_date: string | null
          status: string
          type: string
          updated_at: string | null
        }
        Insert: {
          audience?: string | null
          budget?: number | null
          created_at?: string | null
          end_date?: string | null
          id?: string
          name: string
          owner?: string | null
          progress?: number | null
          property?: string | null
          spent?: number | null
          start_date?: string | null
          status: string
          type: string
          updated_at?: string | null
        }
        Update: {
          audience?: string | null
          budget?: number | null
          created_at?: string | null
          end_date?: string | null
          id?: string
          name?: string
          owner?: string | null
          progress?: number | null
          property?: string | null
          spent?: number | null
          start_date?: string | null
          status?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      companies: {
        Row: {
          address: string | null
          assigned_to: string | null
          company_id: string
          created_at: string | null
          id: string
          industry: string | null
          name: string
          notes: string | null
          relationship_manager: string | null
          relationship_manager_name: string | null
          revenue: number | null
          size: string | null
          status: string
          updated_at: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          assigned_to?: string | null
          company_id: string
          created_at?: string | null
          id?: string
          industry?: string | null
          name: string
          notes?: string | null
          relationship_manager?: string | null
          relationship_manager_name?: string | null
          revenue?: number | null
          size?: string | null
          status: string
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          assigned_to?: string | null
          company_id?: string
          created_at?: string | null
          id?: string
          industry?: string | null
          name?: string
          notes?: string | null
          relationship_manager?: string | null
          relationship_manager_name?: string | null
          revenue?: number | null
          size?: string | null
          status?: string
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      contacts: {
        Row: {
          company_id: string | null
          company_name: string | null
          contact_id: string
          created_at: string | null
          email: string | null
          id: string
          last_contact_date: string | null
          name: string
          notes: string | null
          phone: string | null
          position: string | null
          relationship_manager: string | null
          relationship_manager_name: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          company_id?: string | null
          company_name?: string | null
          contact_id: string
          created_at?: string | null
          email?: string | null
          id?: string
          last_contact_date?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          position?: string | null
          relationship_manager?: string | null
          relationship_manager_name?: string | null
          status: string
          updated_at?: string | null
        }
        Update: {
          company_id?: string | null
          company_name?: string | null
          contact_id?: string
          created_at?: string | null
          email?: string | null
          id?: string
          last_contact_date?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          position?: string | null
          relationship_manager?: string | null
          relationship_manager_name?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      content_items: {
        Row: {
          assignee: string | null
          created_at: string | null
          date: string
          id: string
          platform: string | null
          property: string | null
          status: string
          title: string
          type: string
          updated_at: string | null
        }
        Insert: {
          assignee?: string | null
          created_at?: string | null
          date: string
          id?: string
          platform?: string | null
          property?: string | null
          status: string
          title: string
          type: string
          updated_at?: string | null
        }
        Update: {
          assignee?: string | null
          created_at?: string | null
          date?: string
          id?: string
          platform?: string | null
          property?: string | null
          status?: string
          title?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      debt_recovery: {
        Row: {
          amount: number
          assigned_to: string | null
          company_id: string | null
          company_name: string | null
          contact_id: string | null
          contact_name: string | null
          created_at: string | null
          debt_id: string
          description: string | null
          due_date: string
          id: string
          payment_history: Json | null
          relationship_manager: string | null
          relationship_manager_name: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          assigned_to?: string | null
          company_id?: string | null
          company_name?: string | null
          contact_id?: string | null
          contact_name?: string | null
          created_at?: string | null
          debt_id: string
          description?: string | null
          due_date: string
          id?: string
          payment_history?: Json | null
          relationship_manager?: string | null
          relationship_manager_name?: string | null
          status: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          assigned_to?: string | null
          company_id?: string | null
          company_name?: string | null
          contact_id?: string | null
          contact_name?: string | null
          created_at?: string | null
          debt_id?: string
          description?: string | null
          due_date?: string
          id?: string
          payment_history?: Json | null
          relationship_manager?: string | null
          relationship_manager_name?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      events: {
        Row: {
          attendees: number | null
          contact_email: string | null
          contact_person: string | null
          contact_phone: string | null
          created_at: string | null
          description: string | null
          end_date: string
          event_id: string
          id: string
          location: string | null
          name: string
          notes: string | null
          organizer: string | null
          start_date: string
          status: string
          updated_at: string | null
        }
        Insert: {
          attendees?: number | null
          contact_email?: string | null
          contact_person?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description?: string | null
          end_date: string
          event_id: string
          id?: string
          location?: string | null
          name: string
          notes?: string | null
          organizer?: string | null
          start_date: string
          status: string
          updated_at?: string | null
        }
        Update: {
          attendees?: number | null
          contact_email?: string | null
          contact_person?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description?: string | null
          end_date?: string
          event_id?: string
          id?: string
          location?: string | null
          name?: string
          notes?: string | null
          organizer?: string | null
          start_date?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      guests: {
        Row: {
          address: string | null
          created_at: string | null
          email: string | null
          guest_id: string
          id: string
          last_stay: string | null
          loyalty_points: number | null
          name: string
          nationality: string | null
          passport_number: string | null
          phone: string | null
          preferences: string | null
          status: string
          total_spent: number | null
          total_stays: number | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          guest_id: string
          id?: string
          last_stay?: string | null
          loyalty_points?: number | null
          name: string
          nationality?: string | null
          passport_number?: string | null
          phone?: string | null
          preferences?: string | null
          status: string
          total_spent?: number | null
          total_stays?: number | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          guest_id?: string
          id?: string
          last_stay?: string | null
          loyalty_points?: number | null
          name?: string
          nationality?: string | null
          passport_number?: string | null
          phone?: string | null
          preferences?: string | null
          status?: string
          total_spent?: number | null
          total_stays?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      leads: {
        Row: {
          assigned_to: string | null
          company: string | null
          created_at: string | null
          description: string | null
          email: string | null
          id: string
          lead_id: string
          name: string
          phone: string | null
          relationship_manager: string | null
          relationship_manager_name: string | null
          source: string | null
          status: string
          updated_at: string | null
          value: number | null
        }
        Insert: {
          assigned_to?: string | null
          company?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          id?: string
          lead_id: string
          name: string
          phone?: string | null
          relationship_manager?: string | null
          relationship_manager_name?: string | null
          source?: string | null
          status: string
          updated_at?: string | null
          value?: number | null
        }
        Update: {
          assigned_to?: string | null
          company?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          id?: string
          lead_id?: string
          name?: string
          phone?: string | null
          relationship_manager?: string | null
          relationship_manager_name?: string | null
          source?: string | null
          status?: string
          updated_at?: string | null
          value?: number | null
        }
        Relationships: []
      }
      loyalty_members: {
        Row: {
          address: string | null
          birthdate: string | null
          created_at: string | null
          email: string | null
          id: string
          join_date: string
          member_id: string
          name: string
          phone: string | null
          points: number | null
          preferences: string | null
          status: string
          stays: number | null
          tier: string
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          birthdate?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          join_date: string
          member_id: string
          name: string
          phone?: string | null
          points?: number | null
          preferences?: string | null
          status: string
          stays?: number | null
          tier: string
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          birthdate?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          join_date?: string
          member_id?: string
          name?: string
          phone?: string | null
          points?: number | null
          preferences?: string | null
          status?: string
          stays?: number | null
          tier?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      loyalty_point_transactions: {
        Row: {
          amount: number
          created_at: string | null
          date: string | null
          description: string | null
          id: string
          member_id: string | null
          type: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          date?: string | null
          description?: string | null
          id?: string
          member_id?: string | null
          type: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          date?: string | null
          description?: string | null
          id?: string
          member_id?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "loyalty_point_transactions_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "loyalty_members"
            referencedColumns: ["id"]
          },
        ]
      }
      loyalty_reward_redemptions: {
        Row: {
          created_at: string | null
          date: string | null
          id: string
          member_id: string | null
          redemption_id: string
          reward_id: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          date?: string | null
          id?: string
          member_id?: string | null
          redemption_id: string
          reward_id?: string | null
          status: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string | null
          id?: string
          member_id?: string | null
          redemption_id?: string
          reward_id?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "loyalty_reward_redemptions_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "loyalty_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loyalty_reward_redemptions_reward_id_fkey"
            columns: ["reward_id"]
            isOneToOne: false
            referencedRelation: "loyalty_rewards"
            referencedColumns: ["id"]
          },
        ]
      }
      loyalty_rewards: {
        Row: {
          availability: string | null
          category: string
          created_at: string | null
          description: string | null
          id: string
          name: string
          points_cost: number
          reward_id: string
          status: string
          updated_at: string | null
        }
        Insert: {
          availability?: string | null
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          points_cost: number
          reward_id: string
          status: string
          updated_at?: string | null
        }
        Update: {
          availability?: string | null
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          points_cost?: number
          reward_id?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      loyalty_services: {
        Row: {
          amount: number
          created_at: string | null
          date: string
          id: string
          member_id: string | null
          points_earned: number
          property: string
          service_id: string
          service_type: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          date: string
          id?: string
          member_id?: string | null
          points_earned: number
          property: string
          service_id: string
          service_type: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          date?: string
          id?: string
          member_id?: string | null
          points_earned?: number
          property?: string
          service_id?: string
          service_type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "loyalty_services_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "loyalty_members"
            referencedColumns: ["id"]
          },
        ]
      }
      loyalty_stays: {
        Row: {
          amount: number
          check_in: string
          check_out: string
          created_at: string | null
          id: string
          member_id: string | null
          nights: number
          points_earned: number
          property: string
          room_type: string
          stay_id: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          check_in: string
          check_out: string
          created_at?: string | null
          id?: string
          member_id?: string | null
          nights: number
          points_earned: number
          property: string
          room_type: string
          stay_id: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          check_in?: string
          check_out?: string
          created_at?: string | null
          id?: string
          member_id?: string | null
          nights?: number
          points_earned?: number
          property?: string
          room_type?: string
          stay_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "loyalty_stays_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "loyalty_members"
            referencedColumns: ["id"]
          },
        ]
      }
      opportunities: {
        Row: {
          assigned_to: string | null
          company_id: string | null
          company_name: string | null
          contact_id: string | null
          contact_name: string | null
          created_at: string | null
          description: string | null
          expected_close_date: string | null
          id: string
          name: string
          opportunity_id: string
          probability: number | null
          relationship_manager: string | null
          relationship_manager_name: string | null
          stage: string
          updated_at: string | null
          value: number | null
        }
        Insert: {
          assigned_to?: string | null
          company_id?: string | null
          company_name?: string | null
          contact_id?: string | null
          contact_name?: string | null
          created_at?: string | null
          description?: string | null
          expected_close_date?: string | null
          id?: string
          name: string
          opportunity_id: string
          probability?: number | null
          relationship_manager?: string | null
          relationship_manager_name?: string | null
          stage: string
          updated_at?: string | null
          value?: number | null
        }
        Update: {
          assigned_to?: string | null
          company_id?: string | null
          company_name?: string | null
          contact_id?: string | null
          contact_name?: string | null
          created_at?: string | null
          description?: string | null
          expected_close_date?: string | null
          id?: string
          name?: string
          opportunity_id?: string
          probability?: number | null
          relationship_manager?: string | null
          relationship_manager_name?: string | null
          stage?: string
          updated_at?: string | null
          value?: number | null
        }
        Relationships: []
      }
      properties: {
        Row: {
          capacity: number
          created_at: string | null
          description: string | null
          id: string
          image: string | null
          location: string
          name: string
          rooms: number
          updated_at: string | null
        }
        Insert: {
          capacity?: number
          created_at?: string | null
          description?: string | null
          id?: string
          image?: string | null
          location: string
          name: string
          rooms?: number
          updated_at?: string | null
        }
        Update: {
          capacity?: number
          created_at?: string | null
          description?: string | null
          id?: string
          image?: string | null
          location?: string
          name?: string
          rooms?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      relationship_managers: {
        Row: {
          assigned_companies: number | null
          assigned_contacts: number | null
          assigned_leads: number | null
          assigned_opportunities: number | null
          created_at: string | null
          email: string | null
          id: string
          last_activity_date: string | null
          name: string
          phone: string | null
          position: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          assigned_companies?: number | null
          assigned_contacts?: number | null
          assigned_leads?: number | null
          assigned_opportunities?: number | null
          created_at?: string | null
          email?: string | null
          id?: string
          last_activity_date?: string | null
          name: string
          phone?: string | null
          position?: string | null
          status: string
          updated_at?: string | null
        }
        Update: {
          assigned_companies?: number | null
          assigned_contacts?: number | null
          assigned_leads?: number | null
          assigned_opportunities?: number | null
          created_at?: string | null
          email?: string | null
          id?: string
          last_activity_date?: string | null
          name?: string
          phone?: string | null
          position?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      rooms: {
        Row: {
          amenities: Json | null
          created_at: string | null
          description: string | null
          fire_extinguisher: boolean | null
          floor: string | null
          id: string
          last_cleaned: string | null
          last_maintenance: string | null
          maintenance: boolean | null
          max_occupancy: number
          name: string | null
          rate: number
          room_id: string
          room_number: string
          smoke_detector: boolean | null
          status: string
          type: string
          updated_at: string | null
        }
        Insert: {
          amenities?: Json | null
          created_at?: string | null
          description?: string | null
          fire_extinguisher?: boolean | null
          floor?: string | null
          id?: string
          last_cleaned?: string | null
          last_maintenance?: string | null
          maintenance?: boolean | null
          max_occupancy: number
          name?: string | null
          rate: number
          room_id: string
          room_number: string
          smoke_detector?: boolean | null
          status: string
          type: string
          updated_at?: string | null
        }
        Update: {
          amenities?: Json | null
          created_at?: string | null
          description?: string | null
          fire_extinguisher?: boolean | null
          floor?: string | null
          id?: string
          last_cleaned?: string | null
          last_maintenance?: string | null
          maintenance?: boolean | null
          max_occupancy?: number
          name?: string | null
          rate?: number
          room_id?: string
          room_number?: string
          smoke_detector?: boolean | null
          status?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      social_media_posts: {
        Row: {
          author: string | null
          comments: number | null
          content: string
          created_at: string | null
          id: string
          image_url: string | null
          likes: number | null
          platform: string
          property: string | null
          publish_date: string | null
          shares: number | null
          status: string
          updated_at: string | null
        }
        Insert: {
          author?: string | null
          comments?: number | null
          content: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          likes?: number | null
          platform: string
          property?: string | null
          publish_date?: string | null
          shares?: number | null
          status: string
          updated_at?: string | null
        }
        Update: {
          author?: string | null
          comments?: number | null
          content?: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          likes?: number | null
          platform?: string
          property?: string | null
          publish_date?: string | null
          shares?: number | null
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      update_member_points: {
        Args: {
          p_member_id: string
          p_points: number
        }
        Returns: undefined
      }
      update_member_stays: {
        Args: {
          p_member_id: string
          p_points: number
          p_amount: number
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
