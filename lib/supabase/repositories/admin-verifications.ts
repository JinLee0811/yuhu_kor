import 'server-only';

import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/env';
import { mockAdminVerifications } from '@/lib/mock/admin-verifications';
import type { AdminVerification } from '@/types/admin';

const _mockData = [...mockAdminVerifications];

// DB row → AdminVerification 변환
function mapVerification(row: Record<string, unknown>): AdminVerification {
  const profile = row.profiles as { nickname?: string; email?: string } | null;
  return {
    id: row.id as string,
    userId: row.user_id as string,
    userNickname: profile?.nickname ?? '알 수 없음',
    userEmail: profile?.email ?? (row.email_address as string | null) ?? '',
    status: row.status as AdminVerification['status'],
    documentType: row.document_type as AdminVerification['documentType'],
    schoolName: row.school_name as string,
    realName: (row.real_name as string | null) ?? null,
    department: (row.department as string | null) ?? null,
    schoolStatus: (row.school_status as AdminVerification['schoolStatus']) ?? null,
    documentUrl: (row.document_url as string | null) ?? null,
    submittedAt: row.submitted_at as string,
    approvedAt: (row.approved_at as string | null) ?? null,
    rejectionReason: (row.rejection_reason as string | null) ?? null,
    reviewerId: (row.reviewer_id as string | null) ?? null,
    reviewedAt: (row.reviewed_at as string | null) ?? null
  };
}

export async function listAdminVerifications(status?: string): Promise<AdminVerification[]> {
  if (!isSupabaseConfigured()) {
    if (!status || status === 'all') return [..._mockData];
    return _mockData.filter((v) => v.status === status);
  }

  const supabase = await createClient();

  // profiles 테이블은 id 기준으로 join, auth.users 이메일은 직접 접근 불가하므로 email_address 컬럼 활용
  let query = supabase
    .from('user_verifications')
    .select('*, profiles(nickname)')
    .order('submitted_at', { ascending: false });

  if (status && status !== 'all') {
    query = query.eq('status', status);
  }

  const { data, error } = await query;
  if (error) throw error;

  return (data ?? []).map(mapVerification);
}

export async function getAdminVerification(id: string): Promise<AdminVerification | null> {
  if (!isSupabaseConfigured()) {
    return _mockData.find((v) => v.id === id) ?? null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('user_verifications')
    .select('*, profiles(nickname)')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data ? mapVerification(data) : null;
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

  const supabase = await createClient();
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from('user_verifications')
    .update({
      status: 'approved',
      approved_at: now,
      reviewer_id: reviewerId,
      reviewed_at: now,
      rejection_reason: null
    })
    .eq('id', id)
    .select('*, profiles(nickname)')
    .maybeSingle();

  if (error) throw error;

  // profiles.verified_at 업데이트 (인증 완료 표시)
  if (data) {
    await supabase
      .from('profiles')
      .update({ verified_at: now })
      .eq('id', data.user_id);
  }

  return data ? mapVerification(data) : null;
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

  const supabase = await createClient();
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from('user_verifications')
    .update({
      status: 'rejected',
      approved_at: null,
      reviewer_id: reviewerId,
      reviewed_at: now,
      rejection_reason: rejectionReason
    })
    .eq('id', id)
    .select('*, profiles(nickname)')
    .maybeSingle();

  if (error) throw error;
  return data ? mapVerification(data) : null;
}
