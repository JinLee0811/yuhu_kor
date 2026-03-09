import { entities, reviews, schools } from '@/lib/mock-db';
import type { Review } from '@/types/review';

const SCHOOL_ALIASES: Record<string, string[]> = {
  's-unsw': ['unsw'],
  's-uts': ['uts', 'university of technology sydney'],
  's-tafe-nsw': ['tafe nsw'],
  's-rmit': ['rmit'],
  's-usyd': ['university of sydney', 'sydney university', 'usyd'],
  's-mq': ['macquarie university', 'macquarie']
};

function getSchoolSource(review: Review): string {
  return [review.meta.school_consulted, review.meta.school_course, review.meta.school, review.meta.course]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

export function findSchoolIdByText(source?: string | null): string | null {
  if (!source) return null;
  const normalized = source.toLowerCase();
  const matched = Object.entries(SCHOOL_ALIASES).find(([, aliases]) => aliases.some((alias) => normalized.includes(alias)));
  return matched?.[0] ?? null;
}

export function normalizeSchoolId(review: Review): string | null {
  if (review.meta.school_id) return review.meta.school_id;

  return findSchoolIdByText(getSchoolSource(review));
}

export function getSchoolById(schoolId?: string | null) {
  if (!schoolId) return null;
  return schools.find((school) => school.id === schoolId) ?? null;
}

export function getTopSchoolsByAgency(entityId: string) {
  const counts = new Map<string, number>();

  reviews
    .filter((review) => review.entity_id === entityId)
    .forEach((review) => {
      const schoolId = normalizeSchoolId(review);
      if (!schoolId) return;
      counts.set(schoolId, (counts.get(schoolId) ?? 0) + 1);
    });

  return [...counts.entries()]
    .map(([schoolId, count]) => {
      const school = getSchoolById(schoolId);
      if (!school) return null;
      return {
        schoolId,
        schoolName: school.name,
        count
      };
    })
    .filter(Boolean)
    .sort((a, b) => b!.count - a!.count)
    .slice(0, 5) as Array<{ schoolId: string; schoolName: string; count: number }>;
}

export function getTopAgenciesBySchool(schoolId: string) {
  const counts = new Map<string, number>();

  reviews.forEach((review) => {
    if (normalizeSchoolId(review) !== schoolId) return;
    counts.set(review.entity_id, (counts.get(review.entity_id) ?? 0) + 1);
  });

  return [...counts.entries()]
    .map(([entityId, count]) => {
      const entity = entities.find((item) => item.id === entityId);
      if (!entity) return null;
      return {
        agencyId: entityId,
        agencyName: entity.name,
        agencySlug: entity.slug,
        count
      };
    })
    .filter(Boolean)
    .sort((a, b) => b!.count - a!.count)
    .slice(0, 5) as Array<{ agencyId: string; agencyName: string; agencySlug: string; count: number }>;
}

export function getSchoolStats(schoolId: string) {
  const matched = reviews.filter((review) => normalizeSchoolId(review) === schoolId);
  const reviewCount = matched.length;
  const avgScore =
    reviewCount > 0 ? Number((matched.reduce((sum, review) => sum + review.score_total, 0) / reviewCount).toFixed(1)) : 0;

  return {
    reviewCount,
    avgScore,
    topAgencyCount: getTopAgenciesBySchool(schoolId).length
  };
}
