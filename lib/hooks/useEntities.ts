'use client';

import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import type { Entity } from '@/types/entity';
import type { ApiResponse } from '@/lib/api';

interface EntitiesPayload {
  items: Entity[];
  total: number;
  nextPage: number | null;
}

export interface EntitiesQuery {
  category?: string;
  region?: string;
  specialty?: string;
  city?: string;
  min_score?: string;
  sort?: string;
  page?: number;
  limit?: number;
  q?: string;
}

async function fetchEntities(query: EntitiesQuery): Promise<EntitiesPayload> {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') params.set(key, String(value));
  });

  const res = await fetch(`/api/v1/entities?${params.toString()}`);
  const json: ApiResponse<EntitiesPayload> = await res.json();
  if (!res.ok || !json.data) throw new Error(json.error?.message ?? '유학원 목록을 불러오지 못했어요.');
  return json.data;
}

export function useEntities(query: Omit<EntitiesQuery, 'page'>, limit = 10) {
  return useInfiniteQuery({
    queryKey: ['entities', query, limit],
    queryFn: ({ pageParam }) => fetchEntities({ ...query, page: pageParam as number, limit }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage
  });
}

export function useEntityBySlug(slug?: string) {
  return useQuery({
    queryKey: ['entity', slug],
    queryFn: async () => {
      if (!slug) return null;
      const res = await fetch('/api/v1/entities?limit=100');
      const json: ApiResponse<EntitiesPayload> = await res.json();
      const found = json.data?.items.find((entity) => entity.slug === slug) ?? null;
      return found;
    },
    enabled: Boolean(slug)
  });
}
