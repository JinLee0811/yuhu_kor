export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      entities: {
        Row: {
          id: string;
          slug: string;
          category_id: string;
          region_id: string | null;
          display_order: number | null;
          name: string;
          description: string | null;
          address: string | null;
          phone: string | null;
          website: string | null;
          email: string | null;
          logo_url: string | null;
          sns_links: Json;
          business_hours: Json;
          headquarters_country: string | null;
          headquarters_address: string | null;
          coverage_countries: string[];
          coverage_cities: string[];
          specialties: string[];
          tags: string[];
          is_verified: boolean;
          qeac_verified: boolean;
          is_claimed: boolean;
          avg_score: number;
          review_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['entities']['Row']> & {
          slug: string;
          category_id: string;
          name: string;
        };
        Update: Partial<Database['public']['Tables']['entities']['Row']>;
      };
      reviews: {
        Row: {
          id: string;
          entity_id: string;
          user_id: string;
          review_type: 'consultation' | 'full' | 'aftercare';
          nickname: string;
          scores: Json;
          score_total: number;
          pros: string;
          cons: string;
          summary: string | null;
          meta: Json;
          helpful_count: number;
          is_anonymous: boolean;
          is_hidden: boolean;
          is_verified_review: boolean;
          is_social_verified: boolean;
          report_count: number;
          status: 'published' | 'hidden';
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['reviews']['Row']> & {
          entity_id: string;
          user_id: string;
          review_type: 'consultation' | 'full' | 'aftercare';
          nickname: string;
          scores: Json;
          score_total: number;
          pros: string;
          cons: string;
        };
        Update: Partial<Database['public']['Tables']['reviews']['Row']>;
      };
      profiles: {
        Row: {
          id: string;
          nickname: string;
          avatar_url: string | null;
          current_region_id: string | null;
          role: 'user' | 'admin';
          verified_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['profiles']['Row']> & {
          id: string;
          nickname: string;
        };
        Update: Partial<Database['public']['Tables']['profiles']['Row']>;
      };
      schools: {
        Row: {
          id: string;
          slug: string;
          name: string;
          type: 'university' | 'tafe' | 'language' | 'college';
          city: string;
          description: string;
          fields: string[];
          address: string;
          website: string;
          tuition_range: string;
          intake_periods: string[];
          cricos_code: string | null;
          programs: string[];
          feature_tags: string[];
          logo_text: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['schools']['Row']> & {
          slug: string;
          name: string;
          type: 'university' | 'tafe' | 'language' | 'college';
          city: string;
          description: string;
          address: string;
          website: string;
          tuition_range: string;
        };
        Update: Partial<Database['public']['Tables']['schools']['Row']>;
      };
      board_posts: {
        Row: {
          id: string;
          author_id: string;
          school_id: string | null;
          title: string;
          content: string;
          is_anonymous: boolean;
          like_count: number;
          comment_count: number;
          view_count: number;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['board_posts']['Row']> & {
          author_id: string;
          title: string;
          content: string;
        };
        Update: Partial<Database['public']['Tables']['board_posts']['Row']>;
      };
      user_verifications: {
        Row: {
          id: string;
          user_id: string;
          status: 'pending' | 'approved' | 'rejected';
          document_type: 'coe' | 'tuition_receipt' | 'enrollment' | 'agency';
          document_url: string | null;
          school_name: string;
          submitted_at: string;
          approved_at: string | null;
        };
        Insert: Partial<Database['public']['Tables']['user_verifications']['Row']> & {
          user_id: string;
          status: 'pending' | 'approved' | 'rejected';
          document_type: 'coe' | 'tuition_receipt' | 'enrollment' | 'agency';
          school_name: string;
        };
        Update: Partial<Database['public']['Tables']['user_verifications']['Row']>;
      };
    };
  };
}
