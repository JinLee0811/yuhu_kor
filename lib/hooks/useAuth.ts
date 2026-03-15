'use client';

import { useMemo } from 'react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { getSiteUrl, isSupabaseConfigured } from '@/lib/supabase/env';

export function useAuth() {
  const enabled = isSupabaseConfigured();
  const supabase = useMemo(() => (enabled ? createClient() : null), [enabled]);
  const redirectBase = getSiteUrl();

  const requireClient = () => {
    if (!supabase) {
      throw new Error('Supabase 환경변수가 아직 설정되지 않았어요.');
    }
    return supabase;
  };

  const signInWithGoogle = async (nextPath = '/') => {
    const client = requireClient();
    const { error } = await client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${redirectBase}/auth/callback?next=${encodeURIComponent(nextPath)}`
      }
    });
    if (error) throw error;
  };

  const signInWithKakao = async (nextPath = '/') => {
    const client = requireClient();
    const { error } = await client.auth.signInWithOAuth({
      provider: 'kakao',
      options: {
        redirectTo: `${redirectBase}/auth/callback?next=${encodeURIComponent(nextPath)}`
      }
    });
    if (error) throw error;
  };

  const signInWithEmail = async (email: string, password: string) => {
    const client = requireClient();
    const { error } = await client.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signUpWithEmail = async (email: string, password: string) => {
    const client = requireClient();
    const { error } = await client.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${redirectBase}/auth/callback`
      }
    });
    if (error) throw error;
    toast.success('가입이 완료됐어요. 메일 인증이 켜져 있다면 메일함도 확인해줘요.');
  };

  const signOut = async () => {
    const client = requireClient();
    const { error } = await client.auth.signOut();
    if (error) throw error;
  };

  return {
    signInWithGoogle,
    signInWithKakao,
    signInWithEmail,
    signUpWithEmail,
    signOut
  };
}
