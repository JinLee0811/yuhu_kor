'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Chrome } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/lib/hooks/useAuth';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUpWithEmail, signInWithGoogle, signInWithKakao } = useAuth();
  const router = useRouter();

  const submit = async () => {
    try {
      setLoading(true);
      await signUpWithEmail(email, password);
      router.push('/login');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '가입에 실패했어요.');
    } finally {
      setLoading(false);
    }
  };

  const startSocialSignup = async (provider: 'google' | 'kakao') => {
    try {
      setLoading(true);
      if (provider === 'google') {
        await signInWithGoogle('/nickname');
      } else {
        await signInWithKakao('/nickname');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '소셜 가입에 실패했어요.');
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-md px-4 py-12">
      <div className="rounded-2xl border border-border bg-card p-6 md:p-7">
        <h1 className="mb-2 font-bold">가입하기</h1>
        <p className="mb-6 text-body2 text-muted-foreground">가입은 먼저 하고, 닉네임은 후기 남기기 전에 직접 정하면 돼요.</p>

        <div className="space-y-4">
          <button
            type="button"
            onClick={() => startSocialSignup('google')}
            disabled={loading}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-border bg-card font-semibold text-foreground disabled:opacity-60"
          >
            <Chrome className="h-4 w-4" />
            Google로 가입하기
          </button>
          <button
            type="button"
            onClick={() => startSocialSignup('kakao')}
            disabled={loading}
            className="h-12 w-full rounded-lg bg-[#FEE500] font-semibold text-black disabled:opacity-60"
          >
            Kakao로 가입하기
          </button>

          <div className="relative py-1">
            <div className="h-px bg-border" />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-caption text-muted-foreground">
              또는 이메일로 가입
            </span>
          </div>

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
              placeholder="8자 이상 입력해줘요"
              className="h-11 w-full rounded-lg border border-border bg-background px-3 text-body2 outline-none focus:border-ring"
            />
          </div>

          <button
            onClick={submit}
            disabled={loading || !email.trim() || !password.trim()}
            className="h-12 w-full rounded-lg bg-accent font-semibold text-accent-foreground disabled:opacity-60"
          >
            가입하고 시작하기
          </button>
        </div>

        <p className="mt-5 text-center text-body2 text-muted-foreground">
          이미 계정이 있나요?{' '}
          <Link href="/login" className="font-semibold text-accent">
            로그인
          </Link>
        </p>
      </div>
    </main>
  );
}
