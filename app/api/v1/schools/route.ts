import { NextResponse } from 'next/server';
import { ok, fail } from '@/lib/api';
import { listSchools } from '@/lib/supabase/repositories/schools';
import { isSupabaseConfigured } from '@/lib/supabase/env';
import { createClient } from '@/lib/supabase/server';
import { getSchoolStats as getMockSchoolStats } from '@/lib/mock/schoolAggregations';
import type { Review } from '@/types/review';

// 학교별 통계를 한 번의 리뷰 조회로 일괄 계산 (N+N → 1번)
async function getBatchSchoolStats(schoolIds: string[]) {
  if (!isSupabaseConfigured()) {
    const stats: Record<string, { reviewCount: number; avgScore: number; topAgencyCount: number }> = {};
    for (const id of schoolIds) {
      stats[id] = await getMockSchoolStats(id);
    }
    return stats;
  }

  const supabase = await createClient();

  // 리뷰 전체 1번만 조회 (school_id 필터는 meta jsonb라 DB 필터 불가 → in-memory)
  const { data: reviews } = await supabase
    .from('reviews')
    .select('entity_id, score_total, meta, is_hidden')
    .eq('is_hidden', false);

  // 유학원 목록 1번만 조회 (topAgency 계산용)
  const { data: entities } = await supabase
    .from('entities')
    .select('id, name, slug');

  const typedReviews = (reviews ?? []) as unknown as Review[];
  const entityMap = new Map((entities ?? []).map((e) => [e.id, e]));

  // schoolId별 in-memory 집계
  const stats: Record<string, { reviewCount: number; avgScore: number; topAgencyCount: number }> = {};

  for (const schoolId of schoolIds) {
    const matched = typedReviews.filter(
      (r) => (r.meta?.school_id ?? '') === schoolId
    );
    const reviewCount = matched.length;
    const avgScore =
      reviewCount > 0
        ? Number((matched.reduce((sum, r) => sum + r.score_total, 0) / reviewCount).toFixed(1))
        : 0;

    // 상위 유학원 카운트 (학교 관련 리뷰에 등장한 유학원 수)
    const agencyCounts = new Map<string, number>();
    for (const r of matched) {
      agencyCounts.set(r.entity_id, (agencyCounts.get(r.entity_id) ?? 0) + 1);
    }
    const topAgencyCount = [...agencyCounts.entries()]
      .filter(([id]) => entityMap.has(id))
      .length;

    stats[schoolId] = { reviewCount, avgScore, topAgencyCount };
  }

  return stats;
}

export async function GET() {
  try {
    const items = await listSchools();

    // 통계를 학교별로 N번 조회하지 않고 한 번에 계산
    const statsById = await getBatchSchoolStats(items.map((s) => s.id));

    return NextResponse.json(ok({ items, statsById, total: items.length }), {
      headers: {
        // Vercel CDN + 브라우저 캐시: 1분 신선도, 5분 stale-while-revalidate
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
      }
    });
  } catch {
    return NextResponse.json(fail('SCHOOLS_LOAD_FAILED', '학교 목록을 불러오지 못했어요.'), { status: 500 });
  }
}
