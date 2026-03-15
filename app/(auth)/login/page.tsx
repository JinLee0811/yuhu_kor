'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShieldCheck, Chrome } from 'lucide-react';
import { toast } from 'sonner';
import type { Route } from 'next';
import { useAuth } from '@/lib/hooks/useAuth';

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signInWithGoogle, signInWithKakao, signInWithEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const nextPath = searchParams.get('next');
  const destination = nextPath && nextPath.startsWith('/') ? nextPath : '/';

  const completeEmailLogin = async () => {
    try {
      setLoading(true);
      await signInWithEmail(email, password);
      router.push(destination as Route);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '로그인에 실패했어요.');
    } finally {
      setLoading(false);
    }
  };

  const startOAuth = async (provider: 'google' | 'kakao') => {
    try {
      setLoading(true);
      if (provider === 'google') {
        await signInWithGoogle(destination);
      } else {
        await signInWithKakao(destination);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '소셜 로그인에 실패했어요.');
      setLoading(false);
    }
  };

  const guestContinue = () => {
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
            onClick={() => startOAuth('google')}
            disabled={loading}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-border bg-card font-semibold text-foreground disabled:opacity-60"
          >
            <Chrome className="h-4 w-4" />
            Google로 로그인
          </button>
          <button
            type="button"
            onClick={() => startOAuth('kakao')}
            disabled={loading}
            className="h-12 w-full rounded-lg bg-[#FEE500] font-semibold text-black disabled:opacity-60"
          >
            Kakao로 로그인
          </button>
        </div>

        <div className="my-6 h-px bg-border" />

        <div className="space-y-3">
          <div>
            <label className="mb-2 block text-body2 font-semibold text-foreground">이메일</label>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              placeholder="you@example.com"
              className="h-11 w-full rounded-lg border border-border bg-background px-3 text-body2 outline-none focus:border-ring"
            />
          </div>
          <div>
            <label className="mb-2 block text-body2 font-semibold text-foreground">비밀번호</label>
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              placeholder="비밀번호를 입력해줘요"
              className="h-11 w-full rounded-lg border border-border bg-background px-3 text-body2 outline-none focus:border-ring"
            />
          </div>
          <button
            type="button"
            onClick={completeEmailLogin}
            disabled={loading || !email.trim() || !password.trim()}
            className="h-12 w-full rounded-lg bg-accent font-semibold text-accent-foreground disabled:opacity-60"
          >
            이메일로 로그인
          </button>
          <button
            type="button"
            onClick={guestContinue}
            className="w-full text-caption font-medium text-muted-foreground underline underline-offset-2"
          >
            지금은 둘러보기만 할게요
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
