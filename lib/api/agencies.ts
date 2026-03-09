import { mockAgencies } from '@/lib/mock/agencies';
import { mockReviews } from '@/lib/mock/reviews';

interface AgencyFilters {
  q?: string;
  city?: string;
  specialty?: string;
  min_score?: number;
  sort?: 'review_count' | 'score_desc' | 'latest';
  page?: number;
  limit?: number;
}

export async function getAgencies(filters?: AgencyFilters) {
  const q = (filters?.q ?? '').trim().toLowerCase();
  const city = filters?.city;
  const specialty = filters?.specialty;
  const minScore = filters?.min_score ?? 0;
  const sort = filters?.sort ?? 'review_count';
  const page = filters?.page ?? 1;
  const limit = filters?.limit ?? 10;

  const filtered = mockAgencies
    .filter((agency) => (q ? agency.name.toLowerCase().includes(q) : true))
    .filter((agency) => (city ? agency.coverage_cities.includes(city) : true))
    .filter((agency) => (specialty ? agency.specialties.includes(specialty) : true))
    .filter((agency) => agency.avg_score >= minScore);

  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'score_desc') return b.avg_score - a.avg_score;
    if (sort === 'latest') {
      const aLatest = mockReviews.find((review) => review.entity_id === a.id)?.created_at ?? '';
      const bLatest = mockReviews.find((review) => review.entity_id === b.id)?.created_at ?? '';
      return new Date(bLatest).getTime() - new Date(aLatest).getTime();
    }
    return b.review_count - a.review_count;
  });

  const start = (page - 1) * limit;
  const items = sorted.slice(start, start + limit);

  return {
    items,
    total: sorted.length,
    nextPage: start + limit < sorted.length ? page + 1 : null
  };
}

export async function getAgencyBySlug(slug: string) {
  return mockAgencies.find((agency) => agency.slug === slug) ?? null;
}

export async function getAgencyReviews(id: string, type?: string, sort: 'latest' | 'helpful' = 'latest') {
  const filtered = mockReviews
    .filter((review) => review.entity_id === id)
    .filter((review) => (type ? review.review_type === type : true));

  const items = [...filtered].sort((a, b) => {
    if (sort === 'helpful') return b.helpful_count - a.helpful_count;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return { items, total: items.length };
}
