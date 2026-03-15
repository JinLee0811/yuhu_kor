'use client';

import { User, PenSquare, Heart, Settings, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import type { Route } from 'next';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDeleteReview, useMyReviews, useUpdateReview } from '@/lib/hooks/useReviews';
import { toast } from 'sonner';
import { useAuthStore } from '@/lib/store/auth';

export default function MyPage() {
  const router = useRouter();
  const myReviewsQuery = useMyReviews();
  const deleteMutation = useDeleteReview();
  const updateMutation = useUpdateReview();
  const isReady = useAuthStore((state) => state.isReady);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const nickname = useAuthStore((state) => state.nickname);
  const hasNickname = useAuthStore((state) => state.hasNickname);
  const email = useAuthStore((state) => state.email);
  const role = useAuthStore((state) => state.role);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftSummary, setDraftSummary] = useState('');
  const [draftPros, setDraftPros] = useState('');
  const [draftCons, setDraftCons] = useState('');

  useEffect(() => {
    if (isReady && !isLoggedIn) {
      router.replace('/login?next=/mypage');
    }
  }, [isLoggedIn, isReady, router]);

  if (!isReady) {
    return <div className="min-h-screen bg-background" />;
  }

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
              <h2 className="mb-1 font-bold text-foreground">{hasNickname ? nickname : '닉네임 미설정'}</h2>
              <p className="text-body2 text-muted-foreground">{email ?? '이메일 정보 없음'}</p>
            </div>
          </div>
        </div>

        {!hasNickname ? (
          <Link href={{ pathname: '/nickname' as Route, query: { next: '/reviews/write' } }} className="mb-6 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
            <PenSquare className="h-5 w-5 text-amber-700" />
            <div>
              <p className="font-semibold text-amber-900">후기 남기기 전에 닉네임부터 정해줘요</p>
              <p className="text-body2 text-amber-800/80">중복확인 후 한 번만 정하면 이후엔 바로 후기 작성할 수 있어요.</p>
            </div>
          </Link>
        ) : null}

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

        {role === 'admin' ? (
          <Link href="/admin/agencies" className="mb-6 flex items-center gap-3 rounded-xl border border-accent/30 bg-accent/5 px-5 py-4">
            <ShieldCheck className="h-5 w-5 text-accent" />
            <div>
              <p className="font-semibold text-foreground">유학원 어드민 페이지</p>
              <p className="text-body2 text-muted-foreground">유학원 추가, 수정, 삭제와 노출 순서를 관리할 수 있어요.</p>
            </div>
          </Link>
        ) : null}

        <div className="space-y-3">
          {(myReviewsQuery.data?.items ?? []).map((review) => (
            <article key={review.id} className="rounded-xl border border-border bg-card p-4">
              {editingId === review.id ? (
                <div className="space-y-3">
                  <input
                    value={draftSummary}
                    onChange={(event) => setDraftSummary(event.target.value)}
                    className="h-11 w-full rounded-lg border border-border bg-background px-3"
                  />
                  <textarea
                    value={draftPros}
                    onChange={(event) => setDraftPros(event.target.value)}
                    rows={3}
                    className="w-full rounded-lg border border-border bg-background px-3 py-3"
                  />
                  <textarea
                    value={draftCons}
                    onChange={(event) => setDraftCons(event.target.value)}
                    rows={3}
                    className="w-full rounded-lg border border-border bg-background px-3 py-3"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          await updateMutation.mutateAsync({
                            id: review.id,
                            summary: draftSummary,
                            pros: draftPros,
                            cons: draftCons
                          });
                          toast.success('후기를 수정했어요.');
                          setEditingId(null);
                        } catch (error) {
                          toast.error(error instanceof Error ? error.message : '후기 수정에 실패했어요.');
                        }
                      }}
                      className="rounded-lg bg-accent px-3 py-1.5 text-caption font-semibold text-accent-foreground"
                    >
                      저장
                    </button>
                    <button type="button" onClick={() => setEditingId(null)} className="rounded-lg border border-border px-3 py-1.5 text-caption">
                      취소
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="mb-2 font-semibold text-foreground">{review.summary}</p>
                  <p className="mb-2 line-clamp-2 text-body2 text-muted-foreground">{review.pros}</p>
                  <p className="mb-3 line-clamp-2 text-body2 text-muted-foreground">{review.cons}</p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(review.id);
                        setDraftSummary(review.summary);
                        setDraftPros(review.pros);
                        setDraftCons(review.cons);
                      }}
                      className="rounded-lg border border-border px-3 py-1.5 text-caption text-foreground"
                    >
                      수정
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteMutation.mutate(review.id)}
                      className="rounded-lg border border-negative px-3 py-1.5 text-caption text-negative"
                    >
                      삭제
                    </button>
                  </div>
                </>
              )}
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
