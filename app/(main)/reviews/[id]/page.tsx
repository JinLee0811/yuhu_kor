'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Flag, Star, ThumbsUp } from 'lucide-react';
import { getComments, getReview, likeComment, likeReview, addComment } from '@/lib/mock/reviewDetail';
import type { Comment, ReviewCardData } from '@/types/reviewCard';
import { cn } from '@/lib/utils/cn';
import { useAuthStore } from '@/lib/store/auth';
import { CommentThread } from '@/components/common/CommentThread';

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
  const nickname = useAuthStore((state) => state.nickname);
  const stickyTopClass = isLoggedIn ? 'top-14 md:top-16' : 'top-[90px] md:top-[96px]';

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

  const totalCommentCount = useMemo(
    () => comments.reduce((sum, comment) => sum + 1 + (comment.replies?.length ?? 0), 0),
    [comments]
  );

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
    if (!isLoggedIn || !content.trim()) return;
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
    if (!isLoggedIn || !content.trim()) return;
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
          <div className="grid gap-6 md:grid-cols-[minmax(0,1.15fr)_280px] md:gap-8">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                  {review.reviewType === 'enrollment'
                    ? '등록하고 학교까지 갔어요'
                    : review.reviewType === 'aftercare'
                    ? '학교 다니면서 관리받은 후기예요'
                    : '상담만 받았어요'}
                </span>
                {review.isDirectlyConfirmed ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                    직접 확인됨
                  </span>
                ) : null}
                {review.isVerified ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700">
                    인증된 후기
                  </span>
                ) : null}
              </div>

              <div className="flex flex-wrap items-center gap-2 text-caption text-muted-foreground">
                <span className="font-semibold text-foreground">{review.authorNickname}</span>
                <span>·</span>
                <span>{review.year}년</span>
                {review.purpose ? (
                  <>
                    <span>·</span>
                    <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[11px] text-accent">{review.purpose}</span>
                  </>
                ) : null}
              </div>

              <div className="pt-1">
                <p className="text-sm text-muted-foreground">유학원</p>
                <p className="text-xl font-bold text-foreground">{review.agencyName}</p>
              </div>

              <div className="flex items-center gap-1.5 pt-1">
                <Star className="h-4 w-4 fill-accent text-accent" />
                <span className="font-bold text-foreground">{review.rating.toFixed(1)}</span>
                <span className="text-caption text-muted-foreground">· 작성일 {timeAgo(review.createdAt)}</span>
              </div>
            </div>

            <aside className="rounded-xl border border-orange-200/70 bg-gradient-to-br from-orange-50 to-amber-50 p-4">
              <p className="mb-2 text-xs font-semibold tracking-[0.02em] text-orange-700">한줄평</p>
              <p className="text-[15px] font-semibold leading-relaxed text-orange-950">“{review.summary}”</p>
              {review.extraCost.exists && review.extraCost.types.length > 0 ? (
                <div className="mt-4 border-t border-orange-200/60 pt-3">
                  <p className="mb-2 text-xs font-semibold text-orange-700">추가 비용</p>
                  <div className="flex flex-wrap gap-1.5">
                    {review.extraCost.types.map((type) => (
                      <span key={type} className="rounded-full bg-white/70 px-2.5 py-1 text-[11px] text-gray-600">
                        {type}
                      </span>
                    ))}
                  </div>
                  <p className="mt-2 text-caption text-gray-600">
                    {review.extraCost.isPublic && review.extraCost.amount && review.extraCost.currency
                      ? `${review.extraCost.amount} ${review.extraCost.currency} 공개`
                      : '금액 비공개'}
                  </p>
                </div>
              ) : null}
            </aside>
          </div>

          <div className="my-5 h-px bg-border/80" />

          <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_220px] md:gap-8">
            <div>
              {review.prosTags.length > 0 || review.prosText ? (
                <div className="space-y-3">
                  <h2 className="text-sm font-semibold text-foreground">✅ 좋았던 점</h2>
                  {review.prosTags.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {review.prosTags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-green-200 bg-green-50 px-3 py-1 text-sm font-semibold text-green-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}
                  {review.prosText ? (
                    <p className="whitespace-pre-line text-body2 leading-relaxed text-foreground">{review.prosText}</p>
                  ) : null}
                </div>
              ) : null}

              {review.consTags.length > 0 || review.consText ? (
                <div className={cn('space-y-3', review.prosTags.length > 0 || review.prosText ? 'mt-6' : '')}>
                  <h2 className="text-sm font-semibold text-foreground">😅 아쉬웠던 점</h2>
                  {review.consTags.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {review.consTags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-sm font-semibold text-red-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}
                  {review.consText ? (
                    <p className="whitespace-pre-line text-body2 leading-relaxed text-foreground">{review.consText}</p>
                  ) : null}
                </div>
              ) : null}
            </div>

            <div className="space-y-3 rounded-xl bg-muted/30 p-4">
              <p className="text-xs font-semibold tracking-[0.02em] text-muted-foreground">한눈에 보기</p>
              <div className="space-y-2 text-body2 text-muted-foreground">
                <p>
                  <span className="font-semibold text-foreground">{review.prosTags.length}</span>개 좋았던 포인트
                </p>
                <p>
                  <span className="font-semibold text-foreground">{review.consTags.length}</span>개 아쉬운 포인트
                </p>
                <p>
                  <span className="font-semibold text-foreground">{totalCommentCount}</span>개 댓글
                </p>
              </div>
            </div>
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

