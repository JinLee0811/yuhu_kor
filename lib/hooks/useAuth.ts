'use client';

import { useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';

export function useAuth() {
  const supabase = useMemo(() => createClient(), []);

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google' });
  };

  const signInWithKakao = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'kakao' });
  };

  return {
    signInWithGoogle,
    signInWithKakao
  };
}
