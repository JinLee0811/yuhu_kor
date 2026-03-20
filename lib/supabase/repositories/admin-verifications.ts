import 'server-only';

import { isSupabaseConfigured } from '@/lib/supabase/env';
import { mockAdminVerifications } from '@/lib/mock/admin-verifications';
import type { AdminVerification } from '@/types/admin';

// mock 배열을 런타임 상태로 유지 (Supabase 미연동 시 변경 가능하도록)
const _mockData = [...mockAdminVerifications];

export async function listAdminVerifications(status?: string): Promise<AdminVerification[]> {
  if (!isSupabaseConfigured()) {
    if (!status || status === 'all') return [..._mockData];
    return _mockData.filter((v) => v.status === status);
  }

  // TODO: Supabase 연동 시 구현
  // const supabase = await createClient();
  // const query = supabase.from('user_verifications').select('*, profiles(nickname, email)')...
  return [];
}

export async function getAdminVerification(id: string): Promise<AdminVerification | null> {
  if (!isSupabaseConfigured()) {
    return _mockData.find((v) => v.id === id) ?? null;
  }

  // TODO: Supabase 연동 시 구현
  return null;
}

export async function approveVerification(id: string, reviewerId: string): Promise<AdminVerification | null> {
  if (!isSupabaseConfigured()) {
    const idx = _mockData.findIndex((v) => v.id === id);
    if (idx === -1) return null;
    _mockData[idx] = {
      ..._mockData[idx],
      status: 'approved',
      approvedAt: new Date().toISOString(),
      reviewerId,
      reviewedAt: new Date().toISOString(),
      rejectionReason: null
    };
    return _mockData[idx];
  }

  // TODO: Supabase 연동 시 구현
  return null;
}

export async function rejectVerification(id: string, reviewerId: string, rejectionReason: string): Promise<AdminVerification | null> {
  if (!isSupabaseConfigured()) {
    const idx = _mockData.findIndex((v) => v.id === id);
    if (idx === -1) return null;
    _mockData[idx] = {
      ..._mockData[idx],
      status: 'rejected',
      approvedAt: null,
      reviewerId,
      reviewedAt: new Date().toISOString(),
      rejectionReason
    };
    return _mockData[idx];
  }

  // TODO: Supabase 연동 시 구현
  return null;
}
