import 'server-only';

import type { Review, ReviewFormData, ReviewMeta } from '@/types/review';
import type { ReviewCardData } from '@/types/reviewCard';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/env';
import { mockReviews } from '@/lib/mock/reviews';
import { calculateWeightedScore } from '@/lib/utils/score';
import { REVIEW_SCHEMAS } from '@/lib/constants/reviewSchema';
import { generateAnonymousNickname } from '@/lib/utils/nickname';
import { getEntityByIdOrSlug } from '@/lib/supabase/repositories/entities';

export interface ReviewOwnerUpdateInput {
  summary: string;
  pros: string;
  cons: string;
}

function mapReviewRow(row: {
  id: string;
  entity_id: string;
  review_type: Review['review_type'];
  user_id: string;
  nickname: string;
  scores: unknown;
  score_total: number;
  pros: string;
  cons: string;
  summary: string | null;
  helpful_count: number;
  is_anonymous: boolean;
  is_hidden: boolean;
  is_verified_review: boolean;
  is_social_verified: boolean;
  status: 'published' | 'hidden';
  meta: unknown;
  created_at: string;
  updated_at: string;
}): Review {
  return {
    id: row.id,
    entity_id: row.entity_id,
    review_type: row.review_type,
    user_id: row.user_id,
    nickname: row.nickname,
    scores: (row.scores as Record<string, number>) ?? {},
    score_total: Number(row.score_total),
    pros: row.pros,
    cons: row.cons,
    summary: row.summary ?? '',
    helpful_count: row.helpful_count,
    is_anonymous: row.is_anonymous,
    is_hidden: row.is_hidden,
    is_verified_review: row.is_verified_review,
    is_social_verified: row.is_social_verified,
    status: row.status,
    meta: (row.meta as ReviewMeta) ?? {},
    created_at: row.created_at,
    updated_at: row.updated_at
  };
}

function mapReviewType(type: Review['review_type']): ReviewCardData['reviewType'] {
  if (type === 'full') return 'enrollment';
  return type;
}

export async function listEntityReviews(entityId: string, type?: string, sort: 'latest' | 'helpful' = 'latest') {
  if (!isSupabaseConfigured()) {
    const filtered = mockReviews
      .filter((review) => review.entity_id === entityId)
      .filter((review) => (type ? review.review_type === type : true));
    const items = [...filtered].sort((a, b) => {
      if (sort === 'helpful') return b.helpful_count - a.helpful_count;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
    return { items, total: items.length };
  }

  const supabase = await createClient();
  let query = supabase.from('reviews').select('*', { count: 'exact' }).eq('entity_id', entityId).eq('is_hidden', false);
  if (type) query = query.eq('review_type', type);
  query = sort === 'helpful' ? query.order('helpful_count', { ascending: false }) : query.order('created_at', { ascending: false });
  const { data, count, error } = await query;
  if (error) throw error;
  return {
    items: (data ?? []).map(mapReviewRow),
    total: count ?? 0
  };
}

export async function listRecentReviews(limit = 10) {
  if (!isSupabaseConfigured()) {
    return [...mockReviews]
      .filter((review) => !review.is_hidden)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit);
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('is_hidden', false)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []).map(mapReviewRow);
}

export async function listMyReviews(userId: string) {
  if (!isSupabaseConfigured()) {
    const items = mockReviews.filter((review) => review.user_id === userId && !review.is_hidden);
    return { items, total: items.length };
  }

  const supabase = await createClient();
  const { data, count, error } = await supabase
    .from('reviews')
    .select('*', { count: 'exact' })
    .eq('user_id', userId)
    .eq('is_hidden', false)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return {
    items: (data ?? []).map(mapReviewRow),
    total: count ?? 0
  };
}

export async function createReviewForUser(userId: string, nickname: string, data: ReviewFormData) {
  const now = new Date().toISOString();
  const row: Review = {
    id: `r${Date.now()}`,
    entity_id: data.entity_id,
    review_type: data.review_type,
    user_id: userId,
    nickname,
    scores: data.scores,
    score_total: calculateWeightedScore(data.scores, REVIEW_SCHEMAS[data.review_type]),
    pros: data.pros,
    cons: data.cons,
    summary: data.summary,
    meta: data.meta,
    helpful_count: 0,
    is_anonymous: true,
    is_hidden: false,
    is_verified_review: data.is_verified_review,
    is_social_verified: true,
    status: 'published',
    created_at: now,
    updated_at: now
  };

  if (!isSupabaseConfigured()) {
    mockReviews.unshift(row);
    return row;
  }

  const supabase = await createClient();
  const { data: inserted, error } = await supabase
    .from('reviews')
    .insert({
      entity_id: row.entity_id,
      review_type: row.review_type,
      user_id: row.user_id,
      nickname: row.nickname,
      scores: row.scores,
      score_total: row.score_total,
      pros: row.pros,
      cons: row.cons,
      summary: row.summary,
      meta: row.meta,
      helpful_count: row.helpful_count,
      is_anonymous: row.is_anonymous,
      is_hidden: row.is_hidden,
      is_verified_review: Boolean(row.is_verified_review),
      is_social_verified: Boolean(row.is_social_verified),
      status: row.status ?? 'published'
    })
    .select('*')
    .single();

  if (error) throw error;
  return mapReviewRow(inserted);
}

export async function deleteReviewForUser(reviewId: string, userId: string) {
  if (!isSupabaseConfigured()) {
    const index = mockReviews.findIndex((review) => review.id === reviewId && review.user_id === userId);
    if (index === -1) return null;
    const [removed] = mockReviews.splice(index, 1);
    return removed;
  }

  const supabase = await createClient();
  const { data, error } = await supabase.from('reviews').delete().eq('id', reviewId).eq('user_id', userId).select('*').maybeSingle();
  if (error) throw error;
  return data ? mapReviewRow(data) : null;
}

export async function updateReviewForUser(reviewId: string, userId: string, input: ReviewOwnerUpdateInput) {
  if (!isSupabaseConfigured()) {
    const target = mockReviews.find((review) => review.id === reviewId && review.user_id === userId);
    if (!target) return null;
    target.summary = input.summary;
    target.pros = input.pros;
    target.cons = input.cons;
    target.updated_at = new Date().toISOString();
    return target;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('reviews')
    .update({
      summary: input.summary,
      pros: input.pros,
      cons: input.cons,
      updated_at: new Date().toISOString()
    })
    .eq('id', reviewId)
    .eq('user_id', userId)
    .select('*')
    .maybeSingle();
  if (error) throw error;
  return data ? mapReviewRow(data) : null;
}

export async function getReviewById(reviewId: string) {
  if (!isSupabaseConfigured()) {
    return mockReviews.find((review) => review.id === reviewId) ?? null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase.from('reviews').select('*').eq('id', reviewId).maybeSingle();
  if (error) throw error;
  return data ? mapReviewRow(data) : null;
}

export async function getReviewCardDetail(reviewId: string): Promise<ReviewCardData | null> {
  const review = await getReviewById(reviewId);
  if (!review) return null;

  const entity = await getEntityByIdOrSlug(review.entity_id);
  const extra = review.meta.extra_cost ?? {
    exists: false,
    types: [],
    amount: null,
    currency: null,
    is_public: false
  };

  return {
    id: review.id,
    reviewType: mapReviewType(review.review_type),
    isVerified: Boolean(review.is_social_verified),
    isDirectlyConfirmed: Boolean(review.is_verified_review),
    authorNickname: review.nickname,
    year: review.meta.used_year ?? review.meta.consulted_year ?? review.meta.enrolled_year ?? new Date(review.created_at).getFullYear(),
    purpose: review.meta.purpose ?? '',
    agencyName: entity?.name ?? '유학원 정보',
    agencySlug: entity?.slug ?? null,
    rating: review.score_total,
    prosTags: review.meta.pros_tags ?? [],
    consTags: review.meta.cons_tags ?? [],
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
    commentCount: 0,
    createdAt: review.created_at
  };
}

export async function incrementReviewHelpful(reviewId: string) {
  if (!isSupabaseConfigured()) {
    const target = mockReviews.find((review) => review.id === reviewId);
    if (target) target.helpful_count += 1;
    return;
  }

  const review = await getReviewById(reviewId);
  if (!review) return;
  const supabase = await createClient();
  const { error } = await supabase.from('reviews').update({ helpful_count: review.helpful_count + 1 }).eq('id', reviewId);
  if (error) throw error;
}

export async function reportReview(reviewId: string, reporterId: string, reason = '기타') {
  if (!isSupabaseConfigured()) {
    return { id: `report-${Date.now()}`, reviewId, reporterId, reason };
  }

  const supabase = await createClient();
  const { error } = await supabase.from('reports').insert({
    review_id: reviewId,
    reporter_id: reporterId,
    reason
  });
  if (error) throw error;
  return { reviewId };
}

export function createNicknameForUser() {
  return generateAnonymousNickname();
}

// ────────────────────────────────────────────────────────────────
// 리뷰 댓글
// ────────────────────────────────────────────────────────────────

export interface ReviewComment {
  id: string;
  reviewId: string;
  parentId: string | null;
  authorNickname: string;
  mentionNickname: string | null;
  content: string;
  likeCount: number;
  createdAt: string;
  replies: ReviewComment[];
}

function mapReviewComment(
  row: {
    id: string;
    review_id: string;
    parent_id: string | null;
    mention_nickname: string | null;
    content: string;
    like_count: number;
    created_at: string;
  },
  nickname: string
): ReviewComment {
  return {
    id: row.id,
    reviewId: row.review_id,
    parentId: row.parent_id,
    authorNickname: nickname,
    mentionNickname: row.mention_nickname,
    content: row.content,
    likeCount: row.like_count,
    createdAt: row.created_at,
    replies: []
  };
}

// 댓글 목록 조회 (트리 구조)
export async function listReviewComments(reviewId: string): Promise<ReviewComment[]> {
  if (!isSupabaseConfigured()) {
    // mock 모드: reviewDetail mock 사용
    const mock = await import('@/lib/mock/reviewDetail');
    const mockComments = await mock.getComments(reviewId);
    return mockComments as unknown as ReviewComment[];
  }

  const supabase = await createClient();
  const { data: rows, error } = await supabase
    .from('review_comments')
    .select('*')
    .eq('review_id', reviewId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  if (!rows || rows.length === 0) return [];

  // 작성자 닉네임 batch 조회
  const authorIds = [...new Set(rows.map((r) => r.author_id))];
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, nickname')
    .in('id', authorIds);
  const profileMap = new Map((profiles ?? []).map((p) => [p.id, p.nickname]));

  const mapped = rows.map((row) =>
    mapReviewComment(row, profileMap.get(row.author_id) ?? '탈퇴한 유저')
  );

  // 트리 조립
  const rootMap = new Map(mapped.map((c) => [c.id, c]));
  const roots: ReviewComment[] = [];
  for (const comment of mapped) {
    if (!comment.parentId) {
      roots.push(comment);
    } else {
      const parent = rootMap.get(comment.parentId);
      if (parent) parent.replies.push(comment);
    }
  }
  return roots;
}

// 댓글 작성 (로그인 필요, 인증 권장 — API에서 체크)
export async function createReviewComment(input: {
  reviewId: string;
  authorId: string;
  authorNickname: string;
  parentId?: string | null;
  mentionNickname?: string | null;
  content: string;
}): Promise<ReviewComment> {
  if (!isSupabaseConfigured()) {
    const mock = await import('@/lib/mock/reviewDetail');
    await mock.addComment({
      reviewId: input.reviewId,
      parentId: input.parentId ?? null,
      content: input.content,
      authorNickname: input.authorNickname,
      mentionNickname: input.mentionNickname ?? null
    });
    const comments = await mock.getComments(input.reviewId);
    const last = comments[comments.length - 1];
    return last as unknown as ReviewComment;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('review_comments')
    .insert({
      review_id: input.reviewId,
      author_id: input.authorId,
      parent_id: input.parentId ?? null,
      mention_nickname: input.mentionNickname ?? null,
      content: input.content.trim()
    })
    .select('*')
    .single();

  if (error) throw error;
  return mapReviewComment(data, input.authorNickname);
}

// 댓글 좋아요 (+1)
export async function likeReviewCommentDb(commentId: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    const mock = await import('@/lib/mock/reviewDetail');
    await mock.likeComment(commentId);
    return;
  }

  const supabase = await createClient();
  const { data: comment } = await supabase
    .from('review_comments')
    .select('like_count')
    .eq('id', commentId)
    .maybeSingle();
  if (comment) {
    await supabase
      .from('review_comments')
      .update({ like_count: comment.like_count + 1 })
      .eq('id', commentId);
  }
}
