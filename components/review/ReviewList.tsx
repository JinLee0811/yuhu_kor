import Link from 'next/link';
import type { Review } from '@/types/review';
import { ReviewCard } from '@/components/review/ReviewCard';

export function ReviewList({ items }: { items: Review[] }) {
  if (items.length === 0) {
    return <p className="py-8 text-center text-body2 text-muted-foreground">아직 후기가 없어요. 첫 번째가 되어볼래요? 👀</p>;
  }

  return (
    <div className="space-y-3">
      {items.map((review) => (
        <Link key={review.id} href={`/reviews/${review.id}`} className="block">
          <ReviewCard review={review} commentsInteractive={false} />
        </Link>
      ))}
    </div>
  );
}
