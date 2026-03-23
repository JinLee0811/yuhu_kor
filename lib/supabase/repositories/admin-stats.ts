import 'server-only';

import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/env';
import { mockAdminStats } from '@/lib/mock/admin-stats';
import type { AdminStats } from '@/types/admin';

export async function getAdminStats(): Promise<AdminStats> {
  if (!isSupabaseConfigured()) {
    return { ...mockAdminStats };
  }

  const supabase = await createClient();
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  // 병렬로 집계 쿼리 실행
  const [
    { count: pendingVerifications },
    { count: totalReviews },
    { count: totalEntities },
    { count: totalUsers },
    { count: pendingReports },
    { count: reviewsThisWeek },
    { count: newUsersThisWeek }
  ] = await Promise.all([
    supabase.from('user_verifications').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('reviews').select('*', { count: 'exact', head: true }).eq('is_hidden', false),
    supabase.from('entities').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('reports').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('reviews').select('*', { count: 'exact', head: true }).gte('created_at', oneWeekAgo),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).gte('created_at', oneWeekAgo)
  ]);

  return {
    pendingVerifications: pendingVerifications ?? 0,
    totalReviews: totalReviews ?? 0,
    totalEntities: totalEntities ?? 0,
    totalUsers: totalUsers ?? 0,
    pendingReports: pendingReports ?? 0,
    reviewsThisWeek: reviewsThisWeek ?? 0,
    newUsersThisWeek: newUsersThisWeek ?? 0
  };
}
