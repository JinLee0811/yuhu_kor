import 'server-only';

import { isSupabaseConfigured } from '@/lib/supabase/env';
import { mockAdminReports } from '@/lib/mock/admin-reports';
import type { AdminReport } from '@/types/admin';

const _mockData = [...mockAdminReports];

export async function listAdminReports(status?: string): Promise<AdminReport[]> {
  if (!isSupabaseConfigured()) {
    if (!status || status === 'all') return [..._mockData];
    return _mockData.filter((r) => r.status === status);
  }

  // TODO: Supabase 연동 시 구현
  return [];
}

export async function dismissReport(id: string, reviewerId: string): Promise<AdminReport | null> {
  if (!isSupabaseConfigured()) {
    const idx = _mockData.findIndex((r) => r.id === id);
    if (idx === -1) return null;
    _mockData[idx] = {
      ..._mockData[idx],
      status: 'dismissed',
      reviewerId,
      reviewedAt: new Date().toISOString()
    };
    return _mockData[idx];
  }

  // TODO: Supabase 연동 시 구현
  return null;
}

export async function actionReport(id: string, reviewerId: string): Promise<AdminReport | null> {
  if (!isSupabaseConfigured()) {
    const idx = _mockData.findIndex((r) => r.id === id);
    if (idx === -1) return null;
    _mockData[idx] = {
      ..._mockData[idx],
      status: 'actioned',
      reviewerId,
      reviewedAt: new Date().toISOString()
    };
    return _mockData[idx];
  }

  // TODO: Supabase 연동 시 구현
  // 대상 콘텐츠 is_hidden = true 처리도 함께
  return null;
}
