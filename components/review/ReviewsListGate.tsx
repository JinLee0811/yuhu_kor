'use client';

import Link from 'next/link';
import type { Route } from 'next';
import type { Review } from '@/types/review';
import { ReviewCard } from '@/components/review/ReviewCard';
import { useAuthStore } from '@/lib/store/auth';
import { AuthRequiredPanel } from '@/components/common/AuthRequiredPanel';

interface Props {
  reviews: Review[];
}

export function ReviewsListGate({ reviews }: Props) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const canViewContent = isLoggedIn || process.env.NODE_ENV !== 'production';

  if (!canViewContent) {
    return (
      <AuthRequiredPanel
        title="최근 등록된 후기는 회원만 볼 수 있어요"
        description="후기 본문과 상세 리스트는 로그인 후에만 열려요. 가입하면 바로 전체 후기를 확인할 수 있어요."
        signupHref={'/signup?next=%2Freviews' as Route}
      />
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <Link key={review.id} href={`/reviews/${review.id}`} className="block">
          <ReviewCard review={review} commentsInteractive={false} className="cursor-pointer" />
        </Link>
      ))}
    </div>
  );
}
