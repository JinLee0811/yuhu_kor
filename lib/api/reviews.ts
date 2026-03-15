'use client';

import { toast } from 'sonner';
import type { ApiResponse } from '@/lib/api';
import type { Review, ReviewFormData } from '@/types/review';

export async function submitReview(data: ReviewFormData) {
  const response = await fetch('/api/v1/reviews', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  const json: ApiResponse<Review> = await response.json();

  if (!response.ok || !json.data) {
    throw new Error(json.error?.message ?? '후기 등록에 실패했어요.');
  }

  toast.success('후기가 등록됐어요!');
  return { success: true, review: json.data };
}
