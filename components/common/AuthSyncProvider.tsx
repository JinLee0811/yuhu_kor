'use client';

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/env';
import { useAuthStore } from '@/lib/store/auth';

export function AuthSyncProvider() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const markReady = useAuthStore((state) => state.markReady);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      markReady();
      return;
    }

    const supabase = createClient();

    const refreshAuth = async () => {
      try {
        const response = await fetch('/api/v1/me/auth', { cache: 'no-store' });
        const json = await response.json();
        if (!response.ok || !json.data) {
          clearAuth();
          return;
        }
        setAuth(json.data);
      } catch {
        clearAuth();
      }
    };

    void refreshAuth();

    const { data } = supabase.auth.onAuthStateChange(() => {
      void refreshAuth();
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, [clearAuth, markReady, setAuth]);

  return null;
}
