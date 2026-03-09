'use client';

import { toast } from 'sonner';
import { mockReviews } from '@/lib/mock/reviews';
import { getMockAuth } from '@/lib/mock/auth';
import type { Review, ReviewFormData } from '@/types/review';
import { calculateWeightedScore } from '@/lib/utils/score';
import { REVIEW_SCHEMAS } from '@/lib/constants/reviewSchema';

export async function submitReview(data: ReviewFormData) {
  const { user } = getMockAuth();
  const now = new Date().toISOString();

  const newReview: Review = {
    id: `r${Date.now()}`,
    entity_id: data.entity_id,
    review_type: data.review_type,
    user_id: user.id,
    nickname: user.nickname,
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

  mockReviews.unshift(newReview);
  console.log('[mock submitReview]', newReview);
  toast.success('후기가 등록됐어요!');

  return { success: true, review: newReview };
}
