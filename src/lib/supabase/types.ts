// Hand-authored types mirroring supabase/migrations. Regenerate with
// `supabase gen types typescript` once the project is linked, if preferred.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      departments: {
        Row: { id: string; name: string; slug: string; created_at: string };
        Insert: { id?: string; name: string; slug: string; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["departments"]["Insert"]>;
        Relationships: [];
      };
      badges: {
        Row: { id: string; name: string; criteria: string; icon: string | null; sort: number };
        Insert: { id: string; name: string; criteria: string; icon?: string | null; sort?: number };
        Update: Partial<Database["public"]["Tables"]["badges"]["Insert"]>;
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          department_id: string | null;
          avatar_url: string | null;
          xp: number;
          pathway_id: string | null;
          leaderboard_opt_in: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          department_id?: string | null;
          avatar_url?: string | null;
          xp?: number;
          pathway_id?: string | null;
          leaderboard_opt_in?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
      lesson_progress: {
        Row: {
          id: string;
          user_id: string;
          lesson_id: string;
          status: "in_progress" | "completed";
          quiz_score: number | null;
          quiz_total: number | null;
          completed_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          lesson_id: string;
          status?: "in_progress" | "completed";
          quiz_score?: number | null;
          quiz_total?: number | null;
          completed_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["lesson_progress"]["Insert"]>;
        Relationships: [];
      };
      xp_events: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          points: number;
          ref: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          points: number;
          ref?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["xp_events"]["Insert"]>;
        Relationships: [];
      };
      streaks: {
        Row: {
          user_id: string;
          current: number;
          longest: number;
          last_active_date: string | null;
          freezes_remaining: number;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          current?: number;
          longest?: number;
          last_active_date?: string | null;
          freezes_remaining?: number;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["streaks"]["Insert"]>;
        Relationships: [];
      };
      user_badges: {
        Row: { user_id: string; badge_id: string; earned_at: string };
        Insert: { user_id: string; badge_id: string; earned_at?: string };
        Update: Partial<Database["public"]["Tables"]["user_badges"]["Insert"]>;
        Relationships: [];
      };
      certificates: {
        Row: { id: string; user_id: string; pathway_id: string; issued_at: string };
        Insert: { id?: string; user_id: string; pathway_id: string; issued_at?: string };
        Update: Partial<Database["public"]["Tables"]["certificates"]["Insert"]>;
        Relationships: [];
      };
      portfolio_entries: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          format: string;
          summary: string | null;
          published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          format: string;
          summary?: string | null;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["portfolio_entries"]["Insert"]>;
        Relationships: [];
      };
      portfolio_artifacts: {
        Row: {
          id: string;
          entry_id: string;
          phase: number | null;
          artifact_key: string | null;
          title: string | null;
          content: string | null;
          sort: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          entry_id: string;
          phase?: number | null;
          artifact_key?: string | null;
          title?: string | null;
          content?: string | null;
          sort?: number;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["portfolio_artifacts"]["Insert"]>;
        Relationships: [];
      };
      analytics_events: {
        Row: {
          id: string;
          anon_id: string | null;
          user_id: string | null;
          event_type: string;
          path: string | null;
          lesson_id: string | null;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          anon_id?: string | null;
          user_id?: string | null;
          event_type: string;
          path?: string | null;
          lesson_id?: string | null;
          metadata?: Json;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["analytics_events"]["Insert"]>;
        Relationships: [];
      };
      seed_members: {
        Row: {
          id: string;
          display_name: string;
          department_id: string | null;
          avatar_url: string | null;
          xp: number;
          weekly_xp: number;
        };
        Insert: {
          id?: string;
          display_name: string;
          department_id?: string | null;
          avatar_url?: string | null;
          xp?: number;
          weekly_xp?: number;
        };
        Update: Partial<Database["public"]["Tables"]["seed_members"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: {
      leaderboard_individual: {
        Row: {
          id: string | null;
          display_name: string | null;
          department_id: string | null;
          avatar_url: string | null;
          total_xp: number | null;
          weekly_xp: number | null;
          is_seed: boolean | null;
        };
        Relationships: [];
      };
      leaderboard_team: {
        Row: {
          department_id: string | null;
          department_name: string | null;
          slug: string | null;
          total_xp: number | null;
          weekly_xp: number | null;
          members: number | null;
        };
        Relationships: [];
      };
    };
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
