export interface Entity {
  id: string;
  slug: string;
  category_id: string;
  region_id?: string;
  display_order?: number;
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  website?: string;
  email?: string;
  logo_url?: string;
  headquarters_country?: string;
  headquarters_address?: string;
  coverage_countries: string[];
  coverage_cities: string[];
  specialties: string[];
  tags: string[];
  is_verified: boolean;
  qeac_verified?: boolean;
  is_claimed?: boolean;
  sns_links?: {
    instagram?: string;
    kakao?: string;
  };
  avg_score: number;
  review_count: number;
  updated_at: string;
}
