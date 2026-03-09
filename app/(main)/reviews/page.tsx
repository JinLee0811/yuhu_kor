import Link from 'next/link';
import { reviews } from '@/lib/mock-db';
import { ReviewCard } from '@/components/review/ReviewCard';

export default function ReviewsListPage() {
  const sortedReviews = [...reviews].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return (
    <div className="min-h-screen bg-background pb-safe">
      <div className="mx-auto max-w-layout px-4 py-6 md:px-6 md:py-8">
        <div className="mb-5">
          <h1 className="text-xl font-bold text-foreground">최근 등록된 후기</h1>
          <p className="mt-2 text-body2 text-muted-foreground">최신 순으로 쭉 모아봤어요. 궁금한 후기 눌러서 자세히 볼 수 있어요.</p>
        </div>

        <div className="space-y-4">
          {sortedReviews.map((review) => (
            <Link key={review.id} href={`/reviews/${review.id}`} className="block">
              <ReviewCard review={review} commentsInteractive={false} className="cursor-pointer" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
