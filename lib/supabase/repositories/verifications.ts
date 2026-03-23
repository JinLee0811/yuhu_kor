import 'server-only';

import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/env';
import { mockUserVerifications } from '@/lib/mock/verifications';
import type { DocumentType, SchoolStatus, UserVerification } from '@/types/verification';

function mapVerification(row: {
  id: string;
  user_id: string;
  status: 'pending' | 'approved' | 'rejected';
  document_type: string;
  school_name: string;
  real_name?: string | null;
  department?: string | null;
  school_status?: string | null;
  submitted_at: string;
  approved_at: string | null;
}) {
  const result: UserVerification = {
    id: row.id,
    userId: row.user_id,
    status: row.status,
    documentType: row.document_type as DocumentType,
    schoolName: row.school_name,
    realName: row.real_name ?? null,
    department: row.department ?? null,
    schoolStatus: (row.school_status ?? null) as SchoolStatus | null,
    submittedAt: row.submitted_at,
    approvedAt: row.approved_at
  };
  return result;
}

export async function getLatestVerification(userId: string) {
  if (!isSupabaseConfigured()) {
    const items = mockUserVerifications
      .filter((item) => item.userId === userId)
      .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
    return items[0] ?? null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('user_verifications')
    .select('*')
    .eq('user_id', userId)
    .order('submitted_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data ? mapVerification(data) : null;
}

export async function submitVerification(
  userId: string,
  input: {
    schoolName: string;
    documentType: UserVerification['documentType'];
    realName?: string;
    department?: string;
    schoolStatus?: UserVerification['schoolStatus'];
    documentUrl?: string;
  }
) {
  if (!isSupabaseConfigured()) {
    const created: UserVerification = {
      id: `ver-${Date.now()}`,
      userId,
      status: 'pending',
      documentType: input.documentType,
      schoolName: input.schoolName,
      submittedAt: new Date().toISOString(),
      approvedAt: null,
      documentUrl: input.documentUrl
    };
    mockUserVerifications.unshift(created);
    return created;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('user_verifications')
    .insert({
      user_id: userId,
      status: 'pending',
      document_type: input.documentType,
      school_name: input.schoolName,
      real_name: input.realName ?? null,
      department: input.department ?? null,
      school_status: input.schoolStatus ?? null,
      document_url: input.documentUrl ?? null
    })
    .select('*')
    .single();

  if (error) throw error;
  return mapVerification(data);
}
