import 'server-only';

import { isSupabaseConfigured } from '@/lib/supabase/env';
import { mockAdminStats } from '@/lib/mock/admin-stats';
import type { AdminStats } from '@/types/admin';

export async function getAdminStats(): Promise<AdminStats> {
  if (!isSupabaseConfigured()) {
    return { ...mockAdminStats };
  }

  // TODO: Supabase 연동 시 집계 쿼리로 구현
  // const supabase = await createClient()
  // parallel count queries...
  return { ...mockAdminStats };
}
