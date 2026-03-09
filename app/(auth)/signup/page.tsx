'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuthStore } from '@/lib/store/auth';

export default function SignupPage() {
  const [nickname, setNickname] = useState('');
  const login = useAuthStore((state) => state.login);
  const router = useRouter();

  const submit = () => {
    login(nickname || '호주유학생_1024');
    router.push('/');
  };

  return (
    <main className="mx-auto max-w-md px-4 py-12">
      <div className="rounded-2xl border border-border bg-card p-6 md:p-7">
        <h1 className="mb-2 font-bold">가입하기</h1>
        <p className="mb-6 text-body2 text-muted-foreground">후기 작성 전 닉네임만 설정하면 바로 시작할 수 있어요.</p>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-body2 font-semibold text-foreground">닉네임</label>
            <input
              value={nickname}
              onChange={(event) => setNickname(event.target.value)}
              placeholder="예: 호주유학생_1234"
              className="h-11 w-full rounded-lg border border-border bg-background px-3 text-body2 outline-none focus:border-ring"
            />
          </div>

          <button onClick={submit} className="h-12 w-full rounded-lg bg-accent font-semibold text-accent-foreground">
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
