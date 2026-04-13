import type { Metadata } from 'next';
import { listRecentReviews } from '@/lib/supabase/repositories/reviews';
import { listEntities } from '@/lib/supabase/repositories/entities';
import { ReviewsDashboard } from '@/components/review/ReviewsDashboard';

export const metadata: Metadata = {
  title: '유학원 후기',
  description:
    '실제 유학생이 남긴 호주 유학원 솔직 후기 모아보기. 상담·등록·사후관리 단계별 리뷰를 광고 없이 확인하세요.',
  openGraph: {
    title: '유학원 후기 | 유후',
    description:
      '실제 유학생이 남긴 호주 유학원 솔직 후기 모아보기. 상담·등록·사후관리 단계별 리뷰를 광고 없이 확인하세요.'
  }
};

export default async function ReviewsListPage() {
  const [sortedReviews, entitiesResult] = await Promise.all([
    listRecentReviews(3),
    listEntities({ page: 1, limit: 200, sort: 'score_desc' })
  ]);
  const topAgencies = [...entitiesResult.items].sort((a, b) => b.avg_score - a.avg_score).slice(0, 5);

  return (
    <ReviewsDashboard
      reviews={sortedReviews}
      topAgencies={topAgencies}
      reviewStats={{
        totalReviews: 2847,
        totalAgencies: entitiesResult.total,
        totalMembers: 8234
      }}
    />
  );
}
