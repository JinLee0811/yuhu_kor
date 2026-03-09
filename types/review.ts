export type ReviewType = 'consultation' | 'full' | 'aftercare';

export interface ReviewMeta {
  used_year?: number;
  consulted_year?: number;
  enrolled_year?: number;
  purpose?: string;
  destination_city?: string;
  registered?: boolean;
  school_id?: string | null;
  school_consulted?: string;
  school_course?: string;
  school?: string;
  course?: string;
  current_status?: 'enrolled' | 'graduated';
  pros_tags?: string[];
  cons_tags?: string[];
  pros_text?: string | null;
  cons_text?: string | null;
  extra_cost?: {
    exists: boolean;
    types: string[];
    amount: number | null;
    currency: 'AUD' | 'KRW' | null;
    is_public: boolean;
  };
}

export interface Review {
  id: string;
  entity_id: string;
  review_type: ReviewType;
  user_id: string;
  nickname: string;
  scores: Record<string, number>;
  score_total: number;
  pros: string;
  cons: string;
  summary: string;
  helpful_count: number;
  is_anonymous: boolean;
  is_hidden: boolean;
  is_verified_review?: boolean;
  is_social_verified?: boolean;
  status?: 'published' | 'hidden';
  meta: ReviewMeta;
  created_at: string;
  updated_at: string;
}

export interface ReviewFormData {
  entity_id: string;
  review_type: ReviewType;
  scores: Record<string, number>;
  pros: string;
  cons: string;
  summary: string;
  meta: ReviewMeta;
  is_verified_review: boolean;
}
