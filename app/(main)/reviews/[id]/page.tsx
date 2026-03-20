'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { Route } from 'next';
import { ArrowLeft, Flag, Star, ThumbsUp } from 'lucide-react';
import { getComments, getReview, likeComment, likeReview, addComment } from '@/lib/mock/reviewDetail';
import type { Comment, ReviewCardData } from '@/types/reviewCard';
import { cn } from '@/lib/utils/cn';
import { useAuthStore } from '@/lib/store/auth';
import { CommentThread } from '@/components/common/CommentThread';
import { AuthRequiredPanel } from '@/components/common/AuthRequiredPanel';

function timeAgo(iso: string): string {
  const created = new Date(iso).getTime();
  const now = Date.now();
  const diffDays = Math.floor((now - created) / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) return '오늘';
  if (diffDays === 1) return '1일 전';
  return `${diffDays}일 전`;
}

export default function ReviewDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [review, setReview] = useState<ReviewCardData | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const canViewContent = isLoggedIn || process.env.NODE_ENV !== 'production';
  const nickname = useAuthStore((state) => state.nickname);
  const stickyTopClass = canViewContent ? 'top-14 md:top-16' : 'top-[90px] md:top-[96px]';

  useEffect(() => {
    if (!params?.id) return;
    getReview(String(params.id)).then((data) => {
      if (data) {
        setReview(data);
        setLikeCount(data.likeCount);
      }
    });
    getComments(String(params.id)).then(setComments);
  }, [params?.id]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const totalCommentCount = useMemo(
    () => comments.reduce((sum, comment) => sum + 1 + (comment.replies?.length ?? 0), 0),
    [comments]
  );

  if (!canViewContent) {
    return (
      <div className="min-h-screen bg-background pb-safe">
        <div className="mx-auto max-w-3xl px-4 py-10 md:px-6">
          <AuthRequiredPanel
            title="후기 상세는 로그인한 유저만 볼 수 있어요"
            description="광고 없는 실제 후기 콘텐츠는 회원만 열람할 수 있게 운영하고 있어요. 가입 후 바로 확인할 수 있어요."
            signupHref={`/signup?next=${encodeURIComponent(`/reviews/${params?.id ?? ''}`)}` as Route}
          />
        </div>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="min-h-screen bg-background pb-safe">
        <div className="mx-auto max-w-3xl px-4 py-6 md:px-6 md:py-8">
          <p className="text-body2 text-muted-foreground">후기를 불러오는 중이에요...</p>
        </div>
      </div>
    );
  }

  const handleLikeReview = async () => {
    if (liked) {
      setLiked(false);
      setLikeCount((prev) => Math.max(0, prev - 1));
      return;
    }
    setLiked(true);
    setLikeCount((prev) => prev + 1);
    await likeReview(review.id);
  };

  const handleAddRootComment = async (content: string) => {
    if (!canViewContent || !content.trim()) return;
    await addComment({
      reviewId: review.id,
      parentId: null,
      content: content.trim(),
      authorNickname: nickname || '익명'
    });
    const next = await getComments(review.id);
    setComments(next);
  };

  const handleAddReply = async (parentId: string, content: string, mentionNickname?: string | null) => {
    if (!canViewContent || !content.trim()) return;
    await addComment({
      reviewId: review.id,
      parentId,
      content: content.trim(),
      authorNickname: nickname || '익명',
      mentionNickname: mentionNickname ?? null
    });
    const next = await getComments(review.id);
    setComments(next);
  };

  const handleLikeCommentClick = async (commentId: string) => {
    await likeComment(commentId);
    const next = await getComments(review.id);
    setComments(next);
  };

  return (
    <div className="min-h-screen bg-background pb-safe">
      <div className={`sticky z-30 border-b border-border bg-background/95 backdrop-blur md:hidden ${stickyTopClass}`}>
        <div className="mx-auto max-w-3xl px-4 py-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-1 text-body2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>목록으로</span>
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-6 md:px-6 md:py-8">
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-4 hidden items-center gap-1 text-body2 text-muted-foreground hover:text-foreground md:inline-flex"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>목록으로</span>
        </button>

        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm md:p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0 flex-1 space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex rounded-full bg-[#FFF0EB] px-2.5 py-1 text-[11px] font-semibold leading-none text-[#FF6B35]">
                  {review.reviewType === 'enrollment'
                    ? '#등록하고 학교까지 갔어요'
                    : review.reviewType === 'aftercare'
                    ? '#학교 다니면서 관리받은 후기예요'
                    : '#상담만 받았어요'}
                </span>
                {review.isDirectlyConfirmed || review.isVerified ? (
                  <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold leading-none text-emerald-700">
                    #인증 완료
                  </span>
                ) : null}
              </div>

              <div className="flex flex-wrap items-center gap-1.5 text-caption text-muted-foreground">
                <span className="font-semibold text-foreground">{review.authorNickname}</span>
                <span>·</span>
                <span>{review.year}년</span>
                {review.purpose ? (
                  <>
                    <span>·</span>
                    <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[11px] text-accent">{review.purpose}</span>
                  </>
                ) : null}
                <span>·</span>
                <span>작성일 {timeAgo(review.createdAt)}</span>
              </div>

              <div>
                {review.agencySlug ? (
                  <Link
                    href={`/au/agency/${review.agencySlug}`}
                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-accent"
                  >
                    {review.agencyName}
                  </Link>
                ) : (
                  <p className="text-sm font-medium text-muted-foreground">{review.agencyName}</p>
                )}
              </div>
            </div>

            <aside className="w-full md:w-[132px] md:flex-shrink-0">
              <section className="rounded-xl border border-border bg-muted/20 p-3">
                <p className="text-[10px] font-medium text-muted-foreground">평점</p>
                <div className="mt-1 flex items-center gap-1.5">
                  <Star className="h-4 w-4 fill-accent text-accent" />
                  <span className="text-xl font-black text-foreground">{review.rating.toFixed(1)}</span>
                </div>
              </section>
            </aside>
          </div>

          <div className="my-5 h-px bg-border/80" />

          <div className="space-y-6">
            {(review.prosText || review.consText) ? (
              <div className="space-y-5">
                {review.prosText ? (
                  <section className="rounded-xl border border-border bg-card p-4">
                    <h2 className="mb-2 text-sm font-semibold text-foreground">✅ 장점</h2>
                    <p className="whitespace-pre-line text-body2 leading-relaxed text-foreground">{review.prosText}</p>
                  </section>
                ) : null}

                {review.consText ? (
                  <section className="rounded-xl border border-border bg-card p-4">
                    <h2 className="mb-2 text-sm font-semibold text-foreground">😅 단점</h2>
                    <p className="whitespace-pre-line text-body2 leading-relaxed text-foreground">{review.consText}</p>
                  </section>
                ) : null}
              </div>
            ) : null}

            {(review.prosTags.length > 0 || review.consTags.length > 0 || review.extraCost.exists || Boolean(review.summary)) ? (
              <section className="rounded-xl border border-border bg-muted/20 p-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="mb-2 text-xs font-medium text-muted-foreground">좋았던 점</p>
                    {review.prosTags.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {review.prosTags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-[12px] font-semibold text-green-700"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-caption text-muted-foreground">선택 항목 없음</p>
                    )}
                  </div>

                  <div>
                    <p className="mb-2 text-xs font-medium text-muted-foreground">아쉬웠던 점</p>
                    {review.consTags.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {review.consTags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-[12px] font-semibold text-red-600"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-caption text-muted-foreground">선택 항목 없음</p>
                    )}
                  </div>
                </div>
                <div className="mt-4 border-t border-border/70 pt-3">
                  <p className="mb-2 text-xs font-medium text-muted-foreground">추가 비용</p>
                  {review.extraCost.exists && review.extraCost.types.length > 0 ? (
                    <>
                      <div className="flex flex-wrap gap-1.5">
                        {review.extraCost.types.map((type) => (
                          <span
                            key={type}
                            className="rounded-full border border-border bg-white px-2.5 py-1 text-[12px] text-foreground"
                          >
                            {type}
                          </span>
                        ))}
                      </div>
                      <p className="mt-2 text-caption text-muted-foreground">
                        {review.extraCost.isPublic && review.extraCost.amount && review.extraCost.currency
                          ? `${review.extraCost.amount} ${review.extraCost.currency} 공개`
                          : '금액 비공개'}
                      </p>
                    </>
                  ) : (
                    <p className="text-caption text-muted-foreground">추가 비용 없음</p>
                  )}
                </div>
                {review.summary ? (
                  <div className="mt-4 border-t border-border/70 pt-3">
                    <p className="mb-2 text-xs font-medium text-muted-foreground">한줄평</p>
                    <p className="text-body2 font-semibold leading-relaxed text-foreground">“{review.summary}”</p>
                  </div>
                ) : null}
              </section>
            ) : null}
          </div>

          <div className="my-5 h-px bg-border/80" />

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleLikeReview}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-body2 transition-colors',
                liked ? 'bg-accent/10 text-accent' : 'text-muted-foreground hover:bg-muted/80'
              )}
            >
              <ThumbsUp className={cn('h-4 w-4', liked && 'fill-accent')} strokeWidth={2} />
              <span>도움이 됐어요 {likeCount}</span>
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-lg px-2 py-2 text-caption text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
            >
              <Flag className="h-3.5 w-3.5" strokeWidth={2} />
              <span>신고</span>
            </button>
          </div>
        </section>

        <CommentThread
          comments={comments}
          isLoggedIn={isLoggedIn}
          subtitle="후기 읽고 느낀 점을 편하게 남겨봐요."
          onAddRootComment={handleAddRootComment}
          onAddReply={handleAddReply}
          onLikeComment={handleLikeCommentClick}
        />
      </div>
    </div>
  );
}

