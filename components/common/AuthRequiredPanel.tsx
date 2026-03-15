'use client';

import Link from 'next/link';
import type { Route } from 'next';

interface Props {
  title: string;
  description: string;
  signupHref: Route;
}

export function AuthRequiredPanel({ title, description, signupHref }: Props) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
      <div className="mx-auto mb-3 inline-flex rounded-full bg-accent/10 px-3 py-1 text-caption font-semibold text-accent">
        회원 전용
      </div>
      <h2 className="mb-2 font-bold text-foreground">{title}</h2>
      <p className="mx-auto max-w-md text-body2 text-muted-foreground">{description}</p>
      <div className="mt-5 flex justify-center gap-2">
        <Link href="/login" className="rounded-lg border border-border px-4 py-2 text-body2 font-semibold text-foreground">
          로그인
        </Link>
        <Link href={signupHref} className="rounded-lg bg-accent px-4 py-2 text-body2 font-semibold text-accent-foreground">
          가입하고 보기
        </Link>
      </div>
    </div>
  );
}
