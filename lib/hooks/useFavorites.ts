'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { ApiResponse } from '@/lib/api';
import type { FavoriteEntity } from '@/lib/supabase/repositories/favorites';

interface FavoritesPayload { items: FavoriteEntity[]; total: number; }

/** 내 즐겨찾기 목록 */
export function useMyFavorites() {
  return useQuery({
    queryKey: ['my-favorites'],
    queryFn: async () => {
      const res = await fetch('/api/v1/me/favorites');
      const json: ApiResponse<FavoritesPayload> = await res.json();
      if (!res.ok || !json.data) throw new Error(json.error?.message ?? '즐겨찾기를 불러오지 못했어요.');
      return json.data;
    }
  });
}

/** 특정 유학원 즐겨찾기 토글 */
export function useFavoriteToggle(entityId: string, initialFavorited: boolean) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (action: 'add' | 'remove') => {
      const res = await fetch('/api/v1/me/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entityId, action })
      });
      const json: ApiResponse<{ favorited: boolean }> = await res.json();
      if (!res.ok || !json.data) throw new Error(json.error?.message ?? '즐겨찾기 처리에 실패했어요.');
      return json.data.favorited;
    },
    onSuccess: () => {
      // 즐겨찾기 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['my-favorites'] });
    }
  });

  return {
    isFavorited: mutation.data ?? initialFavorited,
    isLoading: mutation.isPending,
    toggle: () => {
      const current = mutation.data ?? initialFavorited;
      mutation.mutate(current ? 'remove' : 'add');
    }
  };
}
