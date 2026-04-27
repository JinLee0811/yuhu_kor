'use client';

import { toast } from 'sonner';
import type { ApiResponse } from '@/lib/api';
import type { Review, ReviewFormData } from '@/types/review';

export class SubmitReviewError extends Error {
  constructor(message: string, public code: string | null = null, public details: Record<string, unknown> = {}) {
    super(message);
    this.name = 'SubmitReviewError';
  }
}

export async function submitReview(data: ReviewFormData, options?: { silent?: boolean }) {
  const response = await fetch('/api/v1/reviews', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  const json: ApiResponse<Review> = await response.json();

  if (!response.ok || !json.data) {
    throw new SubmitReviewError(
      json.error?.message ?? '후기 등록에 실패했어요.',
      json.error?.code ?? null,
      json.error?.details ?? {}
    );
  }

  if (!options?.silent) toast.success('후기가 등록됐어요!');
  return { success: true, review: json.data };
}
