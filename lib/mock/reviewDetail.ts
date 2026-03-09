import { entities, reviews } from '@/lib/mock-db';
import type { Review } from '@/types/review';
import type { Comment, ReviewCardData } from '@/types/reviewCard';

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
    mentionNickname: '시드니준비중',
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

function mapReviewType(type: Review['review_type']): ReviewCardData['reviewType'] {
  if (type === 'full') return 'enrollment';
  return type;
}

export async function getReview(reviewId: string): Promise<ReviewCardData | null> {
  const review = reviews.find((item) => item.id === reviewId);
  if (!review) return null;

  const entity = entities.find((item) => item.id === review.entity_id);

  const prosTags = review.meta.pros_tags ?? [];
  const consTags = review.meta.cons_tags ?? [];

  const extra = review.meta.extra_cost ?? {
    exists: false,
    types: [],
    amount: null,
    currency: null,
    is_public: false
  };

  const card: ReviewCardData = {
    id: review.id,
    reviewType: mapReviewType(review.review_type),
    isVerified: Boolean(review.is_social_verified),
    isDirectlyConfirmed: Boolean(review.is_verified_review),
    authorNickname: review.nickname,
    year: review.meta.used_year ?? review.meta.consulted_year ?? review.meta.enrolled_year ?? new Date(review.created_at).getFullYear(),
    purpose: review.meta.purpose ?? '',
    agencyName: entity?.name ?? '유학원 정보',
    rating: review.score_total,
    prosTags,
    consTags,
    prosText: review.meta.pros_text ?? null,
    consText: review.meta.cons_text ?? null,
    extraCost: {
      exists: extra.exists,
      types: extra.types,
      amount: extra.amount,
      currency: extra.currency,
      isPublic: extra.is_public
    },
    summary: review.summary,
    likeCount: review.helpful_count,
    commentCount: mockCommentsStore.filter((c) => c.reviewId === review.id).length,
    createdAt: review.created_at
  };

  return card;
}

export async function likeReview(reviewId: string): Promise<void> {
  const review = reviews.find((item) => item.id === reviewId);
  if (review) {
    review.helpful_count += 1;
  }
}

export async function getComments(reviewId: string): Promise<Comment[]> {
  const roots = mockCommentsStore.filter((comment) => comment.reviewId === reviewId && comment.parentId === null);
  return roots.map((root) => ({
    ...root,
    replies: mockCommentsStore.filter((reply) => reply.parentId === root.id)
  }));
}

export async function addComment(input: {
  reviewId: string;
  parentId: string | null;
  content: string;
  authorNickname: string;
  mentionNickname?: string | null;
}): Promise<Comment> {
  const newComment: Comment = {
    id: `c${Date.now()}`,
    reviewId: input.reviewId,
    parentId: input.parentId,
    authorNickname: input.authorNickname,
    mentionNickname: input.mentionNickname ?? null,
    content: input.content,
    likeCount: 0,
    createdAt: new Date().toISOString()
  };
  mockCommentsStore.push(newComment);
  return newComment;
}

export async function likeComment(commentId: string): Promise<void> {
  const target = mockCommentsStore.find((comment) => comment.id === commentId);
  if (target) {
    target.likeCount += 1;
  }
}

