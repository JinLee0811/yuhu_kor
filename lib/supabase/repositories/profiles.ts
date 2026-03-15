import 'server-only';

import type { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/env';
import { mockUser } from '@/lib/mock/auth';
import { getLatestVerification } from '@/lib/supabase/repositories/verifications';
import { buildPendingNickname, isPendingNickname, normalizeNicknameInput, validateNickname } from '@/lib/profile/nickname';

export interface CurrentAuthState {
  isLoggedIn: boolean;
  userId: string | null;
  email: string | null;
  nickname: string;
  hasNickname: boolean;
  role: 'user' | 'admin';
  verificationStatus: 'none' | 'pending' | 'approved' | 'rejected';
  verifiedSchoolName: string | null;
}

export async function ensureProfile(user: User) {
  if (!isSupabaseConfigured()) {
    return {
      id: mockUser.id,
      nickname: mockUser.nickname,
      role: 'user'
    };
  }

  const supabase = await createClient();
  const { data: existing, error: existingError } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
  if (existingError) throw existingError;
  if (existing) return existing;

  const { error: insertError } = await supabase.from('profiles').insert({
    id: user.id,
    nickname: buildPendingNickname(user.id)
  });

  if (insertError) {
    const { error: retryError } = await supabase.from('profiles').upsert({
      id: user.id,
      nickname: buildPendingNickname(user.id),
      updated_at: new Date().toISOString()
    });
    if (retryError) throw retryError;
  }

  const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  if (error) throw error;
  return data;
}

export async function getCurrentAuthState(): Promise<CurrentAuthState> {
  if (!isSupabaseConfigured()) {
    return {
      isLoggedIn: false,
      userId: null,
      email: null,
      nickname: '유학생A',
      hasNickname: false,
      role: 'user',
      verificationStatus: 'none',
      verifiedSchoolName: null
    };
  }

  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      isLoggedIn: false,
      userId: null,
      email: null,
      nickname: '유학생A',
      hasNickname: false,
      role: 'user',
      verificationStatus: 'none',
      verifiedSchoolName: null
    };
  }

  const profile = await ensureProfile(user);
  const verification = await getLatestVerification(user.id);

  return {
    isLoggedIn: true,
    userId: user.id,
    email: user.email ?? null,
    nickname: isPendingNickname(profile.nickname) ? '' : profile.nickname,
    hasNickname: !isPendingNickname(profile.nickname),
    role: profile.role ?? 'user',
    verificationStatus: verification?.status ?? 'none',
    verifiedSchoolName: verification?.schoolName ?? null
  };
}

export async function isNicknameAvailable(nickname: string, currentUserId?: string | null) {
  const normalized = normalizeNicknameInput(nickname);
  const validationError = validateNickname(normalized);
  if (validationError) {
    return { available: false, message: validationError };
  }

  if (!isSupabaseConfigured()) {
    const taken = normalizeNicknameInput(mockUser.nickname) === normalized && currentUserId !== mockUser.id;
    return { available: !taken, message: taken ? '이미 쓰고 있는 닉네임이에요.' : '사용 가능한 닉네임이에요.' };
  }

  const supabase = await createClient();
  let query = supabase.from('profiles').select('id').eq('nickname', normalized).limit(1);
  if (currentUserId) query = query.neq('id', currentUserId);
  const { data, error } = await query;
  if (error) throw error;
  const available = (data ?? []).length === 0;
  return {
    available,
    message: available ? '사용 가능한 닉네임이에요.' : '이미 쓰고 있는 닉네임이에요.'
  };
}

export async function updateMyNickname(userId: string, nickname: string) {
  const normalized = normalizeNicknameInput(nickname);
  const validationError = validateNickname(normalized);
  if (validationError) {
    throw new Error(validationError);
  }

  const availability = await isNicknameAvailable(normalized, userId);
  if (!availability.available) {
    throw new Error(availability.message);
  }

  if (!isSupabaseConfigured()) {
    mockUser.nickname = normalized;
    return {
      id: mockUser.id,
      nickname: mockUser.nickname,
      role: 'user'
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('profiles')
    .update({
      nickname: normalized,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId)
    .select('*')
    .single();

  if (error) throw error;
  return data;
}

export async function requireAdmin() {
  const state = await getCurrentAuthState();
  if (!state.isLoggedIn || state.role !== 'admin') {
    throw new Error('ADMIN_ONLY');
  }
  return state;
}
