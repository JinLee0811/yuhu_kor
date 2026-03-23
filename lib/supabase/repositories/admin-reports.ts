import 'server-only';

import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/env';
import { mockAdminReports } from '@/lib/mock/admin-reports';
import type { AdminReport } from '@/types/admin';

const _mockData = [...mockAdminReports];

// DB row → AdminReport 변환
function mapReport(row: Record<string, unknown>): AdminReport {
  const reporter = row.profiles as { nickname?: string } | null;
  const review = row.reviews as { pros?: string; cons?: string; summary?: string } | null;

  // 리뷰 내용 미리보기 (최대 60자)
  const preview = review?.summary ?? review?.pros ?? review?.cons ?? '내용 없음';
  const targetPreview = typeof preview === 'string' ? preview.slice(0, 60) : '내용 없음';

  return {
    id: row.id as string,
    reporterId: row.reporter_id as string,
    reporterNickname: reporter?.nickname ?? '알 수 없음',
    targetType: 'review',
    targetId: row.review_id as string,
    targetPreview,
    reason: row.reason as string,
    status: (row.status as AdminReport['status']) ?? 'pending',
    createdAt: row.created_at as string,
    reviewedAt: (row.reviewed_at as string | null) ?? null,
    reviewerId: (row.reviewer_id as string | null) ?? null
  };
}

export async function listAdminReports(status?: string): Promise<AdminReport[]> {
  if (!isSupabaseConfigured()) {
    if (!status || status === 'all') return [..._mockData];
    return _mockData.filter((r) => r.status === status);
  }

  const supabase = await createClient();

  let query = supabase
    .from('reports')
    .select('*, profiles!reporter_id(nickname), reviews(pros, cons, summary)')
    .order('created_at', { ascending: false });

  if (status && status !== 'all') {
    query = query.eq('status', status);
  }

  const { data, error } = await query;
  if (error) throw error;

  return (data ?? []).map(mapReport);
}

export async function dismissReport(id: string, reviewerId: string): Promise<AdminReport | null> {
  if (!isSupabaseConfigured()) {
    const idx = _mockData.findIndex((r) => r.id === id);
    if (idx === -1) return null;
    _mockData[idx] = { ..._mockData[idx], status: 'dismissed', reviewerId, reviewedAt: new Date().toISOString() };
    return _mockData[idx];
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('reports')
    .update({ status: 'dismissed', reviewer_id: reviewerId, reviewed_at: new Date().toISOString() })
    .eq('id', id)
    .select('*, profiles!reporter_id(nickname), reviews(pros, cons, summary)')
    .maybeSingle();

  if (error) throw error;
  return data ? mapReport(data) : null;
}

export async function actionReport(id: string, reviewerId: string): Promise<AdminReport | null> {
  if (!isSupabaseConfigured()) {
    const idx = _mockData.findIndex((r) => r.id === id);
    if (idx === -1) return null;
    _mockData[idx] = { ..._mockData[idx], status: 'actioned', reviewerId, reviewedAt: new Date().toISOString() };
    return _mockData[idx];
  }

  const supabase = await createClient();
  const now = new Date().toISOString();

  // 신고 처리 + 해당 리뷰 숨김 처리를 트랜잭션처럼 동시 실행
  const { data: report, error: reportError } = await supabase
    .from('reports')
    .update({ status: 'actioned', reviewer_id: reviewerId, reviewed_at: now })
    .eq('id', id)
    .select('*, profiles!reporter_id(nickname), reviews(pros, cons, summary)')
    .maybeSingle();

  if (reportError) throw reportError;

  // 대상 리뷰 숨김 처리
  if (report?.review_id) {
    await supabase
      .from('reviews')
      .update({ is_hidden: true, status: 'hidden' })
      .eq('id', report.review_id as string);
  }

  return report ? mapReport(report) : null;
}
