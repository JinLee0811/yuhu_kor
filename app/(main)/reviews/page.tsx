import { listRecentReviews } from '@/lib/supabase/repositories/reviews';
import { listEntities } from '@/lib/supabase/repositories/entities';
import { ReviewsDashboard } from '@/components/review/ReviewsDashboard';

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
