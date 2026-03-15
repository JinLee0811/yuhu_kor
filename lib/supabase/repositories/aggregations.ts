import 'server-only';

import type { Review } from '@/types/review';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/env';
import { getTopAgenciesBySchool as getMockTopAgenciesBySchool, getTopSchoolsByAgency as getMockTopSchoolsByAgency, getSchoolStats as getMockSchoolStats, normalizeSchoolId as normalizeMockSchoolId } from '@/lib/mock/schoolAggregations';
import { listSchools } from '@/lib/supabase/repositories/schools';
import { listEntities } from '@/lib/supabase/repositories/entities';

function getSchoolIdFromReview(review: Review) {
  return review.meta.school_id ?? normalizeMockSchoolId(review);
}

async function getAllReviews() {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const { data, error } = await supabase.from('reviews').select('*').eq('is_hidden', false);
  if (error) throw error;
  return (data ?? []) as unknown as Review[];
}

export async function getTopSchoolsByAgency(entityId: string) {
  if (!isSupabaseConfigured()) return getMockTopSchoolsByAgency(entityId);

  const [reviews, schools] = await Promise.all([getAllReviews(), listSchools()]);
  const counts = new Map<string, number>();

  (reviews ?? [])
    .filter((review) => review.entity_id === entityId)
    .forEach((review) => {
      const schoolId = getSchoolIdFromReview(review);
      if (!schoolId) return;
      counts.set(schoolId, (counts.get(schoolId) ?? 0) + 1);
    });

  return [...counts.entries()]
    .map(([schoolId, count]) => {
      const school = schools.find((item) => item.id === schoolId);
      if (!school) return null;
      return { schoolId, schoolName: school.name, count };
    })
    .filter(Boolean)
    .sort((a, b) => b!.count - a!.count)
    .slice(0, 5) as Array<{ schoolId: string; schoolName: string; count: number }>;
}

export async function getTopAgenciesBySchool(schoolId: string) {
  if (!isSupabaseConfigured()) return getMockTopAgenciesBySchool(schoolId);

  const [reviews, entitiesResult] = await Promise.all([getAllReviews(), listEntities({ page: 1, limit: 500 })]);
  const counts = new Map<string, number>();

  (reviews ?? []).forEach((review) => {
    if (getSchoolIdFromReview(review) !== schoolId) return;
    counts.set(review.entity_id, (counts.get(review.entity_id) ?? 0) + 1);
  });

  return [...counts.entries()]
    .map(([agencyId, count]) => {
      const entity = entitiesResult.items.find((item) => item.id === agencyId);
      if (!entity) return null;
      return {
        agencyId,
        agencyName: entity.name,
        agencySlug: entity.slug,
        count
      };
    })
    .filter(Boolean)
    .sort((a, b) => b!.count - a!.count)
    .slice(0, 5) as Array<{ agencyId: string; agencyName: string; agencySlug: string; count: number }>;
}

export async function getSchoolStats(schoolId: string) {
  if (!isSupabaseConfigured()) return getMockSchoolStats(schoolId);

  const reviews = await getAllReviews();
  const matched = (reviews ?? []).filter((review) => getSchoolIdFromReview(review) === schoolId);
  const reviewCount = matched.length;
  const avgScore = reviewCount > 0 ? Number((matched.reduce((sum, review) => sum + review.score_total, 0) / reviewCount).toFixed(1)) : 0;
  const topAgencies = await getTopAgenciesBySchool(schoolId);

  return {
    reviewCount,
    avgScore,
    topAgencyCount: topAgencies.length
  };
}
