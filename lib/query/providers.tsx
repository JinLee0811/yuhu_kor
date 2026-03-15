'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { AuthSyncProvider } from '@/components/common/AuthSyncProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000,
            gcTime: 300_000
          }
        }
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthSyncProvider />
      {children}
    </QueryClientProvider>
  );
}
