'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShieldCheck, Chrome } from 'lucide-react';
import { useAuthStore } from '@/lib/store/auth';
import type { Route } from 'next';

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useAuthStore((state) => state.login);

  const completeLogin = () => {
    login('유학생A');
    const nextPath = searchParams.get('next');
    const destination = nextPath && nextPath.startsWith('/') ? nextPath : '/';
    router.push(destination as Route);
  };

  return (
    <main className="mx-auto max-w-md px-4 py-12">
      <div className="rounded-2xl border border-border bg-card p-6 md:p-7">
        <h1 className="mb-2 font-bold">로그인</h1>
        <p className="mb-6 text-body2 text-muted-foreground">광고 없는 후기 신뢰를 위해 로그인 후 작성 가능해요.</p>

        <div className="mb-4 rounded-lg border border-info/20 bg-info/5 p-3">
          <p className="flex items-center gap-1.5 text-caption text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-info" />
            유후는 후기 신뢰도 강화를 위해 계정 기반 작성 정책을 사용해요.
          </p>
        </div>

        <div className="space-y-3">
          <button
            type="button"
            onClick={completeLogin}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-border bg-card font-semibold text-foreground"
          >
            <Chrome className="h-4 w-4" />
            Google로 로그인
          </button>
          <button type="button" onClick={completeLogin} className="h-12 w-full rounded-lg bg-[#FEE500] font-semibold text-black">
            Kakao로 로그인
          </button>
        </div>

        <p className="mt-5 text-center text-body2 text-muted-foreground">
          아직 계정이 없나요?{' '}
          <Link href="/signup" className="font-semibold text-accent">
            가입하기
          </Link>
        </p>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="mx-auto max-w-md px-4 py-12" />}>
      <LoginPageContent />
    </Suspense>
  );
}
