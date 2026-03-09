'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { ApiResponse } from '@/lib/api';
import type { Review } from '@/types/review';

interface ReviewsPayload {
  items: Review[];
  total: number;
}

export function useReviews(entityId?: string, sort: 'latest' | 'helpful' = 'latest') {
  return useQuery({
    queryKey: ['reviews', entityId, sort],
    queryFn: async () => {
      if (!entityId) return { items: [], total: 0 };
      const res = await fetch(`/api/v1/entities/${entityId}/reviews?sort=${sort}`);
      const json: ApiResponse<ReviewsPayload> = await res.json();
      if (!res.ok || !json.data) throw new Error(json.error?.message ?? '후기를 불러오지 못했어요.');
      return json.data;
    },
    enabled: Boolean(entityId)
  });
}

export function useMyReviews() {
  return useQuery({
    queryKey: ['my-reviews'],
    queryFn: async () => {
      const res = await fetch('/api/v1/me/reviews');
      const json: ApiResponse<ReviewsPayload> = await res.json();
      if (!res.ok || !json.data) throw new Error(json.error?.message ?? '내 후기를 불러오지 못했어요.');
      return json.data;
    }
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/v1/reviews?id=${id}`, { method: 'DELETE' });
      const json: ApiResponse<{ id: string }> = await res.json();
      if (!res.ok || !json.data) throw new Error(json.error?.message ?? '후기 삭제 실패');
      return json.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-reviews'] });
    }
  });
}
