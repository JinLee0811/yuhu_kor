'use client';

import { User, PenSquare, Heart, Settings } from 'lucide-react';
import { useDeleteReview, useMyReviews } from '@/lib/hooks/useReviews';
import { useAuthStore } from '@/lib/store/auth';

export default function MyPage() {
  const myReviewsQuery = useMyReviews();
  const deleteMutation = useDeleteReview();
  const nickname = useAuthStore((state) => state.nickname);

  return (
    <div className="min-h-screen bg-background pb-safe">
      <div className="mx-auto max-w-3xl px-4 py-6 md:px-6 md:py-8">
        <h1 className="mb-6 font-bold">내 페이지</h1>

        <div className="mb-6 rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
              <User className="h-8 w-8 text-accent" />
            </div>
            <div>
              <h2 className="mb-1 font-bold text-foreground">{nickname}</h2>
              <p className="text-body2 text-muted-foreground">reviewer@yuhu.kr</p>
            </div>
          </div>
        </div>

        <div className="mb-6 overflow-hidden rounded-xl border border-border bg-card">
          <button className="flex w-full items-center gap-3 border-b border-border px-6 py-4 transition-colors hover:bg-muted">
            <PenSquare className="h-5 w-5 text-muted-foreground" />
            <span className="flex-1 text-left font-medium text-foreground">내가 쓴 후기</span>
            <span className="text-body2 text-accent">{myReviewsQuery.data?.items.length || 0}</span>
          </button>
          <button className="flex w-full items-center gap-3 border-b border-border px-6 py-4 transition-colors hover:bg-muted">
            <Heart className="h-5 w-5 text-muted-foreground" />
            <span className="flex-1 text-left font-medium text-foreground">관심 유학원</span>
            <span className="text-body2 text-accent">0</span>
          </button>
          <button className="flex w-full items-center gap-3 px-6 py-4 transition-colors hover:bg-muted">
            <Settings className="h-5 w-5 text-muted-foreground" />
            <span className="flex-1 text-left font-medium text-foreground">설정</span>
          </button>
        </div>

        <div className="space-y-3">
          {(myReviewsQuery.data?.items ?? []).map((review) => (
            <article key={review.id} className="rounded-xl border border-border bg-card p-4">
              <p className="mb-2 font-semibold text-foreground">{review.summary}</p>
              <p className="mb-3 line-clamp-2 text-body2 text-muted-foreground">{review.pros}</p>
              <button
                type="button"
                onClick={() => deleteMutation.mutate(review.id)}
                className="rounded-lg border border-negative px-3 py-1.5 text-caption text-negative"
              >
                삭제
              </button>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
