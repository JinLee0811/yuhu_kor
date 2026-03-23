import 'server-only';

import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/env';

export interface FavoriteEntity {
  favoriteId: string;
  entityId: string;
  slug: string;
  name: string;
  avgScore: number;
  reviewCount: number;
  isVerified: boolean;
  createdAt: string;
}

/** 내 즐겨찾기 목록 조회 */
export async function listMyFavorites(userId: string): Promise<FavoriteEntity[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('favorites')
    .select('id, entity_id, created_at, entities(id, slug, name, avg_score, review_count, is_verified)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data ?? []).map((row) => {
    const raw = row.entities;
    const entity = (Array.isArray(raw) ? raw[0] : raw) as {
      id: string; slug: string; name: string;
      avg_score: number; review_count: number; is_verified: boolean;
    } | null;
    return {
      favoriteId: row.id,
      entityId: row.entity_id,
      slug: entity?.slug ?? '',
      name: entity?.name ?? '',
      avgScore: entity?.avg_score ?? 0,
      reviewCount: entity?.review_count ?? 0,
      isVerified: entity?.is_verified ?? false,
      createdAt: row.created_at
    };
  });
}

/** 특정 유학원 즐겨찾기 여부 확인 */
export async function isFavorited(userId: string, entityId: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  const supabase = await createClient();
  const { data } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', userId)
    .eq('entity_id', entityId)
    .maybeSingle();

  return !!data;
}

/** 즐겨찾기 추가 */
export async function addFavorite(userId: string, entityId: string) {
  if (!isSupabaseConfigured()) return;

  const supabase = await createClient();
  const { error } = await supabase
    .from('favorites')
    .insert({ user_id: userId, entity_id: entityId });

  // 이미 추가된 경우(unique 충돌) 무시
  if (error && error.code !== '23505') throw error;
}

/** 즐겨찾기 제거 */
export async function removeFavorite(userId: string, entityId: string) {
  if (!isSupabaseConfigured()) return;

  const supabase = await createClient();
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('entity_id', entityId);

  if (error) throw error;
}
