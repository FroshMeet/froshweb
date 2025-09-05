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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      conversations: {
        Row: {
          created_at: string
          id: string
          last_message_at: string | null
          match_id: string | null
          status: string
          user1_id: string
          user2_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_message_at?: string | null
          match_id?: string | null
          status?: string
          user1_id: string
          user2_id: string
        }
        Update: {
          created_at?: string
          id?: string
          last_message_at?: string | null
          match_id?: string | null
          status?: string
          user1_id?: string
          user2_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
        ]
      }
      friend_requests: {
        Row: {
          created_at: string | null
          from_user: string
          id: string
          status: string
          to_user: string
        }
        Insert: {
          created_at?: string | null
          from_user: string
          id?: string
          status?: string
          to_user: string
        }
        Update: {
          created_at?: string | null
          from_user?: string
          id?: string
          status?: string
          to_user?: string
        }
        Relationships: []
      }
      friendships: {
        Row: {
          created_at: string | null
          id: string
          user_a: string
          user_b: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          user_a: string
          user_b: string
        }
        Update: {
          created_at?: string | null
          id?: string
          user_a?: string
          user_b?: string
        }
        Relationships: []
      }
      instagram_profiles: {
        Row: {
          bio: string | null
          class_year: string
          created_at: string
          id: string
          instagram_handle: string
          instagram_payment_date: string | null
          name: string
          paid_for_instagram: boolean
          photos: string[] | null
          posted_to_instagram: boolean
          school: string
          social_links: Json | null
          stripe_session_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          bio?: string | null
          class_year: string
          created_at?: string
          id?: string
          instagram_handle: string
          instagram_payment_date?: string | null
          name: string
          paid_for_instagram?: boolean
          photos?: string[] | null
          posted_to_instagram?: boolean
          school: string
          social_links?: Json | null
          stripe_session_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          bio?: string | null
          class_year?: string
          created_at?: string
          id?: string
          instagram_handle?: string
          instagram_payment_date?: string | null
          name?: string
          paid_for_instagram?: boolean
          photos?: string[] | null
          posted_to_instagram?: boolean
          school?: string
          social_links?: Json | null
          stripe_session_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      matches: {
        Row: {
          created_at: string
          id: string
          user1_id: string
          user2_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          user1_id: string
          user2_id: string
        }
        Update: {
          created_at?: string
          id?: string
          user1_id?: string
          user2_id?: string
        }
        Relationships: []
      }
      message_requests: {
        Row: {
          created_at: string
          from_user_id: string
          id: string
          message: string
          status: string
          to_user_id: string
        }
        Insert: {
          created_at?: string
          from_user_id: string
          id?: string
          message: string
          status?: string
          to_user_id: string
        }
        Update: {
          created_at?: string
          from_user_id?: string
          id?: string
          message?: string
          status?: string
          to_user_id?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          body: string
          created_at: string | null
          id: string
          recipient: string
          sender: string
          thread_id: string
        }
        Insert: {
          body: string
          created_at?: string | null
          id?: string
          recipient: string
          sender: string
          thread_id: string
        }
        Update: {
          body?: string
          created_at?: string | null
          id?: string
          recipient?: string
          sender?: string
          thread_id?: string
        }
        Relationships: []
      }
      private_messages: {
        Row: {
          conversation_id: string
          created_at: string
          id: string
          message: string
          message_type: string | null
          read_at: string | null
          sender_id: string
        }
        Insert: {
          conversation_id: string
          created_at?: string
          id?: string
          message: string
          message_type?: string | null
          read_at?: string | null
          sender_id: string
        }
        Update: {
          conversation_id?: string
          created_at?: string
          id?: string
          message?: string
          message_type?: string | null
          read_at?: string | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "private_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_images: {
        Row: {
          created_at: string | null
          id: string
          image_url: string
          position: number | null
          profile_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          image_url: string
          position?: number | null
          profile_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          image_url?: string
          position?: number | null
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_images_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          bio: string | null
          class_year: number
          cover_url: string | null
          created_at: string | null
          full_name: string
          id: string
          is_visible: boolean | null
          pfp_url: string | null
          school_slug: string
          updated_at: string | null
          user_id: string
          username: string
        }
        Insert: {
          bio?: string | null
          class_year: number
          cover_url?: string | null
          created_at?: string | null
          full_name: string
          id?: string
          is_visible?: boolean | null
          pfp_url?: string | null
          school_slug: string
          updated_at?: string | null
          user_id: string
          username: string
        }
        Update: {
          bio?: string | null
          class_year?: number
          cover_url?: string | null
          created_at?: string | null
          full_name?: string
          id?: string
          is_visible?: boolean | null
          pfp_url?: string | null
          school_slug?: string
          updated_at?: string | null
          user_id?: string
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_school_slug_fkey"
            columns: ["school_slug"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["slug"]
          },
        ]
      }
      rate_limit_log: {
        Row: {
          action_type: string
          attempted_at: string | null
          id: string
          identifier: string
        }
        Insert: {
          action_type: string
          attempted_at?: string | null
          id?: string
          identifier: string
        }
        Update: {
          action_type?: string
          attempted_at?: string | null
          id?: string
          identifier?: string
        }
        Relationships: []
      }
      school_chat_members: {
        Row: {
          id: string
          joined_at: string
          last_seen: string | null
          school_chat_id: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string
          last_seen?: string | null
          school_chat_id: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string
          last_seen?: string | null
          school_chat_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "school_chat_members_school_chat_id_fkey"
            columns: ["school_chat_id"]
            isOneToOne: false
            referencedRelation: "school_chats"
            referencedColumns: ["id"]
          },
        ]
      }
      school_chat_messages: {
        Row: {
          created_at: string
          id: string
          message: string
          school_chat_id: string
          updated_at: string
          user_id: string
          user_name: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          school_chat_id: string
          updated_at?: string
          user_id: string
          user_name: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          school_chat_id?: string
          updated_at?: string
          user_id?: string
          user_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "school_chat_messages_school_chat_id_fkey"
            columns: ["school_chat_id"]
            isOneToOne: false
            referencedRelation: "school_chats"
            referencedColumns: ["id"]
          },
        ]
      }
      school_chats: {
        Row: {
          created_at: string
          id: string
          message_count: number
          school: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          message_count?: number
          school: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          message_count?: number
          school?: string
          updated_at?: string
        }
        Relationships: []
      }
      school_conversation_members: {
        Row: {
          conversation_id: string
          is_muted: boolean | null
          joined_at: string
          last_read_at: string | null
          role: string | null
          user_id: string
        }
        Insert: {
          conversation_id: string
          is_muted?: boolean | null
          joined_at?: string
          last_read_at?: string | null
          role?: string | null
          user_id: string
        }
        Update: {
          conversation_id?: string
          is_muted?: boolean | null
          joined_at?: string
          last_read_at?: string | null
          role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "school_conversation_members_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "school_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      school_conversations: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          last_message_at: string | null
          metadata: Json | null
          pair_key: string | null
          school_slug: string
          title: string | null
          type: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          last_message_at?: string | null
          metadata?: Json | null
          pair_key?: string | null
          school_slug: string
          title?: string | null
          type: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          last_message_at?: string | null
          metadata?: Json | null
          pair_key?: string | null
          school_slug?: string
          title?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "school_conversations_school_slug_fkey"
            columns: ["school_slug"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["slug"]
          },
        ]
      }
      school_messages: {
        Row: {
          content_text: string
          content_type: string | null
          conversation_id: string
          created_at: string
          deleted_at: string | null
          id: string
          reply_to_id: string | null
          sender_id: string
        }
        Insert: {
          content_text: string
          content_type?: string | null
          conversation_id: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          reply_to_id?: string | null
          sender_id: string
        }
        Update: {
          content_text?: string
          content_type?: string | null
          conversation_id?: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          reply_to_id?: string | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "school_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "school_conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "school_messages_reply_to_id_fkey"
            columns: ["reply_to_id"]
            isOneToOne: false
            referencedRelation: "school_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      schools: {
        Row: {
          created_at: string
          ig_handle: string | null
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          ig_handle?: string | null
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          ig_handle?: string | null
          name?: string
          slug?: string
        }
        Relationships: []
      }
      submissions: {
        Row: {
          bio: string
          created_at: string
          has_been_posted: boolean
          has_paid: boolean
          id: string
          image_urls: string[]
          major: string
          name: string
          school: string
          stripe_session_id: string | null
          timestamp: string
          updated_at: string
        }
        Insert: {
          bio: string
          created_at?: string
          has_been_posted?: boolean
          has_paid?: boolean
          id?: string
          image_urls?: string[]
          major: string
          name: string
          school: string
          stripe_session_id?: string | null
          timestamp?: string
          updated_at?: string
        }
        Update: {
          bio?: string
          created_at?: string
          has_been_posted?: boolean
          has_paid?: boolean
          id?: string
          image_urls?: string[]
          major?: string
          name?: string
          school?: string
          stripe_session_id?: string | null
          timestamp?: string
          updated_at?: string
        }
        Relationships: []
      }
      swipes: {
        Row: {
          created_at: string
          direction: string
          id: string
          target_user_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          direction: string
          id?: string
          target_user_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          direction?: string
          id?: string
          target_user_id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          auth_provider: string | null
          avatar_url: string | null
          bio: string | null
          class_year: string | null
          college_email: string | null
          created_at: string
          id: string
          interests: string[] | null
          looking_for_roommate: boolean | null
          major: string | null
          name: string | null
          phone_number: string | null
          school: string | null
          updated_at: string
          user_id: string
          verification_status: string | null
          verified: boolean
        }
        Insert: {
          auth_provider?: string | null
          avatar_url?: string | null
          bio?: string | null
          class_year?: string | null
          college_email?: string | null
          created_at?: string
          id?: string
          interests?: string[] | null
          looking_for_roommate?: boolean | null
          major?: string | null
          name?: string | null
          phone_number?: string | null
          school?: string | null
          updated_at?: string
          user_id: string
          verification_status?: string | null
          verified?: boolean
        }
        Update: {
          auth_provider?: string | null
          avatar_url?: string | null
          bio?: string | null
          class_year?: string | null
          college_email?: string | null
          created_at?: string
          id?: string
          interests?: string[] | null
          looking_for_roommate?: boolean | null
          major?: string | null
          name?: string | null
          phone_number?: string | null
          school?: string | null
          updated_at?: string
          user_id?: string
          verification_status?: string | null
          verified?: boolean
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_view_profile: {
        Args: { profile_user_id: string; viewer_id: string }
        Returns: boolean
      }
      can_view_profile_basic: {
        Args: { profile_user_id: string; viewer_id: string }
        Returns: boolean
      }
      check_rate_limit: {
        Args: {
          action_type: string
          max_attempts?: number
          time_window_minutes?: number
          user_identifier: string
        }
        Returns: boolean
      }
      get_or_create_school_chat: {
        Args: { school_name: string }
        Returns: string
      }
      get_or_create_school_group_chat: {
        Args: { school_slug_param: string }
        Returns: string
      }
      get_potential_matches: {
        Args: { limit_count?: number; user_id_param: string }
        Returns: {
          avatar_url: string
          bio: string
          class_year: string
          interests: string[]
          looking_for_roommate: boolean
          major: string
          name: string
          school: string
          user_id: string
        }[]
      }
      get_school_group_chat_summary: {
        Args: { school_slug_param: string; user_id_param: string }
        Returns: {
          conversation_id: string
          is_member: boolean
          member_count: number
          title: string
        }[]
      }
      handle_swipe: {
        Args: { swipe_direction: string; swiper_id: string; target_id: string }
        Returns: Json
      }
      join_school_group_chat: {
        Args: { conversation_id_param: string; user_id_param: string }
        Returns: boolean
      }
      leave_school_group_chat: {
        Args: { conversation_id_param: string; user_id_param: string }
        Returns: boolean
      }
      list_school_conversations: {
        Args: {
          cursor_timestamp?: string
          limit_count?: number
          school_slug_param: string
          user_id_param: string
        }
        Returns: {
          conversation_id: string
          last_message_at: string
          last_message_text: string
          title: string
          type: string
          unread_count: number
        }[]
      }
      list_school_discover_profiles: {
        Args: {
          cursor_timestamp?: string
          filters?: string[]
          limit_count?: number
          school_slug_param: string
          search_query?: string
        }
        Returns: {
          avatar_url: string
          bio: string
          class_year: string
          created_at: string
          display_name: string
          tags: string[]
          user_id: string
          username: string
        }[]
      }
      list_school_messages: {
        Args: {
          conversation_id_param: string
          cursor_timestamp?: string
          limit_count?: number
        }
        Returns: {
          content_text: string
          created_at: string
          message_id: string
          reply_to_id: string
          sender_id: string
          sender_name: string
        }[]
      }
      mark_school_read: {
        Args: {
          conversation_id_param: string
          message_id_param?: string
          user_id_param: string
        }
        Returns: boolean
      }
      send_school_message: {
        Args: {
          content_text_param: string
          conversation_id_param: string
          sender_id_param: string
        }
        Returns: string
      }
      start_school_dm_or_get: {
        Args: {
          school_slug_param: string
          user_a_param: string
          user_b_param: string
        }
        Returns: string
      }
      verify_college_email: {
        Args: { college_email_param: string; user_id_param: string }
        Returns: boolean
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
