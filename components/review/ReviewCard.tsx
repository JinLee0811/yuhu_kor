'use client';

import { ChevronRight, Flag, MessageCircle, Star, ThumbsUp } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { Review } from '@/types/review';
import { cn } from '@/lib/utils/cn';
import { ReviewTypeBadge } from '@/components/review/ReviewTypeBadge';
import { entities } from '@/lib/mock-db';
import { useAuthStore } from '@/lib/store/auth';

interface Comment {
  id: string;
  reviewId: string;
  parentId: string | null;
  authorNickname: string;
  content: string;
  likeCount: number;
  createdAt: string;
  replies?: Comment[];
}

// 간단한 목업 댓글 데이터
const mockCommentsStore: Comment[] = [
  {
    id: 'c1',
    reviewId: 'r1',
    parentId: null,
    authorNickname: '시드니준비중',
    content: '상담 디테일하게 적어주셔서 도움 많이 됐어요!',
    likeCount: 3,
    createdAt: '2024-06-20T09:00:00Z'
  },
  {
    id: 'c2',
    reviewId: 'r1',
    parentId: 'c1',
    authorNickname: '호주유학고민중',
    content: '혹시 상담은 온라인으로만 진행하셨나요?',
    likeCount: 1,
    createdAt: '2024-06-21T11:30:00Z'
  },
  {
    id: 'c3',
    reviewId: 'r2',
    parentId: null,
    authorNickname: '멜버른예정',
    content: '사후관리 부분이 살짝 걱정되긴 하네요 ㅠㅠ',
    likeCount: 0,
    createdAt: '2024-06-15T12:00:00Z'
  }
];

async function getComments(reviewId: string): Promise<Comment[]> {
  const roots = mockCommentsStore.filter((comment) => comment.reviewId === reviewId && comment.parentId === null);
  return roots.map((root) => ({
    ...root,
    replies: mockCommentsStore.filter((reply) => reply.parentId === root.id)
  }));
}

async function addComment(input: { reviewId: string; parentId: string | null; content: string; authorNickname: string }): Promise<Comment> {
  const newComment: Comment = {
    id: `c${Date.now()}`,
    reviewId: input.reviewId,
    parentId: input.parentId,
    authorNickname: input.authorNickname,
    content: input.content,
    likeCount: 0,
    createdAt: new Date().toISOString()
  };
  mockCommentsStore.push(newComment);
  return newComment;
}

async function likeComment(commentId: string): Promise<void> {
  const target = mockCommentsStore.find((comment) => comment.id === commentId);
  if (target) {
    target.likeCount += 1;
  }
}

function stringToColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 65%, 60%)`;
}

function timeAgo(iso: string): string {
  const created = new Date(iso).getTime();
  const now = Date.now();
  const diffDays = Math.floor((now - created) / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) return '오늘';
  if (diffDays === 1) return '1일 전';
  return `${diffDays}일 전`;
}

interface Props {
  review: Review;
  compact?: boolean;
  className?: string;
  onClickCard?: () => void;
  commentsInteractive?: boolean;
}

export function ReviewCard({ review, compact = false, className, onClickCard, commentsInteractive = true }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [helpful, setHelpful] = useState(false);
  const [helpCount, setHelpCount] = useState(review.helpful_count);

  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [replyContent, setReplyContent] = useState('');

  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const nickname = useAuthStore((state) => state.nickname);

  const shouldShowExpand = !compact && (review.pros.length > 150 || review.cons.length > 150);
  const displayYear = review.meta.used_year ?? review.meta.consulted_year ?? review.meta.enrolled_year ?? 2025;
  const displayPurpose = review.meta.purpose ?? '유학 후기';
  const agencyName = entities.find((entity) => entity.id === review.entity_id)?.name ?? '유학원 정보';
  const isCertified = Boolean(review.is_verified_review || review.is_social_verified);

  useEffect(() => {
    getComments(review.id).then(setComments);
  }, [review.id]);

  const totalCommentCount = useMemo(
    () => comments.reduce((sum, comment) => sum + 1 + (comment.replies?.length ?? 0), 0),
    [comments]
  );

  const visibleComments = useMemo(
    () => (showAllComments ? comments : comments.slice(0, 2)),
    [comments, showAllComments]
  );

  const handleHelpfulClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setHelpful((prev) => !prev);
    setHelpCount((prev) => (helpful ? Math.max(0, prev - 1) : prev + 1));
  };

  const handleToggleComments = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setCommentsOpen((prev) => !prev);
  };

  const handleAddRootComment = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (!isLoggedIn || !newComment.trim()) return;
    await addComment({
      reviewId: review.id,
      parentId: null,
      content: newComment.trim(),
      authorNickname: nickname || '익명'
    });
    setNewComment('');
    const next = await getComments(review.id);
    setComments(next);
  };

  const handleAddReply = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (!isLoggedIn || !replyContent.trim() || !replyTo) return;
    await addComment({
      reviewId: review.id,
      parentId: replyTo,
      content: replyContent.trim(),
      authorNickname: nickname || '익명'
    });
    setReplyContent('');
    setReplyTo(null);
    const next = await getComments(review.id);
    setComments(next);
  };

  const handleLikeComment = async (event: React.MouseEvent<HTMLButtonElement>, commentId: string) => {
    event.stopPropagation();
    await likeComment(commentId);
    const next = await getComments(review.id);
    setComments(next);
  };

  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border border-border bg-white p-4 transition-[transform,box-shadow,border-color,background-color] duration-200 will-change-transform',
        'hover:border-[#FFDCCF] hover:shadow-[0_14px_30px_rgba(17,24,39,0.08)]',
        compact && 'min-h-[268px] p-3 sm:min-h-[320px] sm:p-4',
        className
      )}
      onClick={onClickCard}
      role={onClickCard ? 'button' : undefined}
      tabIndex={onClickCard ? 0 : undefined}
    >
      <div className={cn('mb-3 space-y-1.5', compact && 'mb-2.5 space-y-1')}>
        <div className={cn('flex items-center justify-between gap-3', compact && 'gap-2')}>
          <div className="flex min-w-0 flex-wrap items-center gap-1.5">
            <ReviewTypeBadge type={review.review_type} />
            {isCertified ? (
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                인증 완료
              </span>
            ) : null}
          </div>

          <div className={cn('flex shrink-0 items-center justify-end gap-1 rounded-md bg-accent/10 px-2 py-1', compact && 'px-1.5 py-0.5')}>
            <div className="flex items-center justify-end gap-1">
              <Star className="h-3 w-3 fill-accent text-accent" />
              <span className={cn('text-[13px] font-semibold text-foreground', compact && 'text-[12px]')}>{review.score_total.toFixed(1)}</span>
            </div>
          </div>
        </div>

        <div className={cn('flex flex-wrap items-center gap-1.5 text-[12px] text-muted-foreground', compact && 'gap-1 text-[11px] sm:text-[12px]')}>
          <span className={cn('font-medium text-foreground', compact && 'line-clamp-1')}>{review.nickname}</span>
          <span>·</span>
          <span>{displayYear}년</span>
          <span>·</span>
          <span>{displayPurpose}</span>
        </div>

        <div>
          <span className={cn('text-[12px] text-muted-foreground', compact && 'text-[11px] sm:text-[12px]')}>{agencyName}</span>
        </div>

        <div className={cn('flex justify-end', compact && 'pt-0.5')}>
          <span className={cn('inline-flex items-center gap-0.5 text-[11px] font-semibold text-accent', compact && 'text-[10px] sm:text-[11px]')}>
            자세히 보기
            <ChevronRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>

      <div className={cn('mb-4', compact && 'mb-3 min-h-[92px] sm:min-h-[118px]')}>
        <div className={cn('grid gap-3', compact && 'gap-2.5', !compact && 'md:grid-cols-2')}>
          <div className={cn('rounded-lg bg-green-50/60 p-2.5', compact && 'p-2')}>
            <span className={cn('mb-1.5 inline-block rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700', compact && 'mb-1 text-[9px] sm:text-[10px]')}>
              좋았던 점
            </span>
            <p
              className={cn(
                'text-[12px] leading-[1.55] text-foreground',
                compact ? 'line-clamp-2 text-[11px] leading-[1.45] sm:text-[12px] sm:leading-[1.55]' : !isExpanded ? 'line-clamp-3' : ''
              )}
            >
              {review.pros}
            </p>
          </div>

          <div className={cn('rounded-lg bg-red-50/50 p-2.5', compact && 'p-2')}>
            <span className={cn('mb-1.5 inline-block rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-700', compact && 'mb-1 text-[9px] sm:text-[10px]')}>
              아쉬운 점
            </span>
            <p
              className={cn(
                'text-[12px] leading-[1.55] text-foreground',
                compact ? 'line-clamp-2 text-[11px] leading-[1.45] sm:text-[12px] sm:leading-[1.55]' : !isExpanded ? 'line-clamp-3' : ''
              )}
            >
              {review.cons}
            </p>
          </div>
        </div>

        {shouldShowExpand ? (
          <button
            onClick={(event) => {
              event.stopPropagation();
              setIsExpanded((prev) => !prev);
            }}
            className="mt-2 text-[12px] font-medium text-accent hover:underline"
          >
            {isExpanded ? '접기' : '더보기'}
          </button>
        ) : null}
      </div>

      <div className={cn('border-t border-border pt-4', compact && 'pt-3')}>
        <div className="flex items-center justify-between gap-3">
          <div className={cn('flex items-center gap-2', compact && 'gap-1')}>
            <button
              onClick={handleHelpfulClick}
              className={cn(
                'flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12px] transition-colors',
                compact && 'gap-1 px-2 py-1 text-[11px] sm:gap-1.5 sm:px-2.5 sm:py-1.5 sm:text-[12px]',
                helpful ? 'bg-accent/10 text-accent' : 'text-muted-foreground hover:bg-muted/80'
              )}
            >
              <ThumbsUp className={cn('h-4 w-4 shrink-0', helpful && 'fill-accent')} strokeWidth={2} />
              <span className="font-medium">도움 {helpCount}</span>
            </button>

            {commentsInteractive ? (
              <button
                onClick={handleToggleComments}
                className={cn(
                  'flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12px] text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground',
                  compact && 'gap-1 px-2 py-1 text-[11px] sm:gap-1.5 sm:px-2.5 sm:py-1.5 sm:text-[12px]'
                )}
              >
                <MessageCircle className="h-4 w-4 shrink-0" strokeWidth={2} />
                <span className="font-medium">댓글 {totalCommentCount}</span>
              </button>
            ) : (
              <div className={cn('flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12px] text-muted-foreground', compact && 'gap-1 px-2 py-1 text-[11px] sm:gap-1.5 sm:px-2.5 sm:py-1.5 sm:text-[12px]')}>
                <MessageCircle className="h-4 w-4 shrink-0" strokeWidth={2} />
                <span className="font-medium">댓글 {totalCommentCount}</span>
              </div>
            )}
          </div>

          <div className="shrink-0">
            <button
              onClick={(event) => event.stopPropagation()}
              className={cn(
                'flex items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground',
                compact && 'px-1.5 py-1 text-[10px] sm:px-2 sm:py-1.5 sm:text-[11px]'
              )}
            >
              <Flag className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
              <span>신고</span>
            </button>
          </div>
        </div>

        {commentsInteractive && commentsOpen ? (
          <div className="mt-2 space-y-3 rounded-lg bg-muted/40 p-3 md:p-4 transition-all duration-200">
            <div className="space-y-3">
              {visibleComments.map((comment) => (
                <div key={comment.id} className="border-b border-border/40 pb-3 last:border-b-0 last:pb-0">
                  <div className="mb-1 flex items-center gap-2">
                    <div
                      className="flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold text-white"
                      style={{ backgroundColor: stringToColor(comment.authorNickname) }}
                    >
                      {comment.authorNickname.charAt(0)}
                    </div>
                    <div className="flex items-center gap-1 text-caption text-muted-foreground">
                      <span className="font-semibold text-foreground">{comment.authorNickname}</span>
                      <span>·</span>
                      <span>{timeAgo(comment.createdAt)}</span>
                    </div>
                  </div>
                  <p className="mb-1 text-body2 text-foreground">{comment.content}</p>
                  <div className="flex items-center gap-3 text-caption text-muted-foreground">
                    <button
                      type="button"
                      onClick={(event) => handleLikeComment(event, comment.id)}
                      className="flex items-center gap-1 rounded-md px-2 py-1 hover:bg-muted/80"
                    >
                      <ThumbsUp className="h-3 w-3" strokeWidth={2} />
                      <span>{comment.likeCount}</span>
                    </button>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        setReplyTo((prev) => (prev === comment.id ? null : comment.id));
                        setReplyContent('');
                      }}
                      className="rounded-md px-2 py-1 hover:bg-muted/80"
                    >
                      답글 달기
                    </button>
                  </div>

                  {comment.replies && comment.replies.length > 0 ? (
                    <div className="mt-2 space-y-2 border-l-2 border-border/40 pl-3">
                      {comment.replies.map((reply) => (
                        <div key={reply.id}>
                          <div className="mb-1 flex items-center gap-2">
                            <div
                              className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold text-white"
                              style={{ backgroundColor: stringToColor(reply.authorNickname) }}
                            >
                              {reply.authorNickname.charAt(0)}
                            </div>
                            <div className="flex items-center gap-1 text-caption text-muted-foreground">
                              <span className="font-semibold text-foreground">{reply.authorNickname}</span>
                              <span>·</span>
                              <span>{timeAgo(reply.createdAt)}</span>
                            </div>
                          </div>
                          <p className="mb-1 text-body2 text-foreground">{reply.content}</p>
                          <div className="flex items-center gap-3 text-caption text-muted-foreground">
                            <button
                              type="button"
                              onClick={(event) => handleLikeComment(event, reply.id)}
                              className="flex items-center gap-1 rounded-md px-2 py-1 hover:bg-muted/80"
                            >
                              <ThumbsUp className="h-3 w-3" strokeWidth={2} />
                              <span>{reply.likeCount}</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : null}

                  {replyTo === comment.id && isLoggedIn ? (
                    <div className="mt-2 space-y-2">
                      <p className="text-caption text-muted-foreground">@{comment.authorNickname} 에게 답글</p>
                      <div className="flex gap-2">
                        <input
                          value={replyContent}
                          onChange={(event) => setReplyContent(event.target.value)}
                          className="h-9 flex-1 rounded-lg border border-border bg-card px-3 text-body2 outline-none focus:border-ring"
                          placeholder="답글을 남겨보세요..."
                        />
                        <button
                          type="button"
                          onClick={handleAddReply}
                          className="h-9 rounded-lg bg-accent px-3 text-caption font-semibold text-accent-foreground"
                        >
                          등록
                        </button>
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            setReplyTo(null);
                            setReplyContent('');
                          }}
                          className="h-9 rounded-lg border border-border px-3 text-caption text-muted-foreground"
                        >
                          취소
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>
              ))}

              {comments.length > 2 && !showAllComments ? (
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    setShowAllComments(true);
                  }}
                  className="text-body2 font-medium text-accent hover:underline"
                >
                  댓글 더 보기
                </button>
              ) : null}
            </div>

            <div className="mt-2 border-t border-border/50 pt-3">
              {isLoggedIn ? (
                <div className="flex flex-col gap-2 md:flex-row md:items-center">
                  <input
                    value={newComment}
                    onChange={(event) => setNewComment(event.target.value)}
                    className="h-10 flex-1 rounded-lg border border-border bg-card px-3 text-body2 outline-none focus:border-ring"
                    placeholder="댓글을 남겨보세요..."
                  />
                  <button
                    type="button"
                    onClick={handleAddRootComment}
                    className="mt-2 h-10 rounded-lg bg-accent px-4 text-caption font-semibold text-accent-foreground md:mt-0"
                  >
                    등록
                  </button>
                </div>
              ) : (
                <p className="text-caption text-muted-foreground">로그인 후 댓글을 남길 수 있어요</p>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
