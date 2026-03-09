import type { Entity } from '@/types/entity';
import type { Review } from '@/types/review';
import type { School } from '@/types/school';
import type { BoardPost } from '@/types/board';
import type { UserVerification } from '@/types/verification';
import { categories } from '@/lib/constants/categories';
import { mockAgencies } from '@/lib/mock/agencies';
import { mockReviews } from '@/lib/mock/reviews';
import { mockSchools } from '@/lib/mock/schools';
import { mockBoardPosts } from '@/lib/mock/board';
import { mockUserVerifications } from '@/lib/mock/verifications';

export const entities: Entity[] = mockAgencies.map((agency) => ({
  id: agency.id,
  slug: agency.slug,
  category_id: 'cat-agency',
  name: agency.name,
  description: agency.description,
  address: agency.headquarters_address,
  phone: agency.phone,
  website: agency.website,
  email: agency.email,
  logo_url: agency.logo_url,
  headquarters_country: agency.headquarters_country,
  headquarters_address: agency.headquarters_address,
  coverage_countries: agency.coverage_countries,
  coverage_cities: agency.coverage_cities,
  specialties: agency.specialties,
  tags: agency.tags,
  is_verified: agency.is_verified,
  qeac_verified: agency.qeac_verified,
  is_claimed: agency.is_claimed,
  sns_links: agency.sns_links,
  avg_score: agency.avg_score,
  review_count: agency.review_count,
  updated_at: '2026-02-13T00:00:00.000Z'
}));

export const reviews: Review[] = mockReviews;
export const schools: School[] = mockSchools;
export const boardPosts: BoardPost[] = mockBoardPosts;
export const userVerifications: UserVerification[] = mockUserVerifications;

export const myUserId = 'mock-user-1';

export const agencySchema = categories.find((category) => category.slug === 'agency')?.review_schema ?? [];
