'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Route } from 'next';
import { toast } from 'sonner';
import type { ApiResponse } from '@/lib/api';
import { useAuthStore } from '@/lib/store/auth';

function NicknameSetupPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isReady = useAuthStore((state) => state.isReady);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const nickname = useAuthStore((state) => state.nickname);
  const hasNickname = useAuthStore((state) => state.hasNickname);
  const role = useAuthStore((state) => state.role);
  const verificationStatus = useAuthStore((state) => state.verificationStatus);
  const verifiedSchoolName = useAuthStore((state) => state.verifiedSchoolName);
  const email = useAuthStore((state) => state.email);
  const userId = useAuthStore((state) => state.userId);
  const setAuth = useAuthStore((state) => state.setAuth);

  const [input, setInput] = useState(nickname);
  const [checkedNickname, setCheckedNickname] = useState('');
  const [checking, setChecking] = useState(false);
  const [saving, setSaving] = useState(false);

  const nextPath = searchParams.get('next');
  const destination = nextPath && nextPath.startsWith('/') ? nextPath : '/mypage';

  useEffect(() => {
    if (isReady && !isLoggedIn) {
      router.replace(`/login?next=${encodeURIComponent(`/nickname?next=${destination}`)}` as Route);
    }
  }, [destination, isLoggedIn, isReady, router]);

  useEffect(() => {
    if (isReady && isLoggedIn && hasNickname) {
      router.replace(destination as Route);
    }
  }, [destination, hasNickname, isLoggedIn, isReady, router]);

  const checkAvailability = async () => {
    try {
      setChecking(true);
      const response = await fetch(`/api/v1/profile/nickname?nickname=${encodeURIComponent(input)}`, { cache: 'no-store' });
      const json: ApiResponse<{ available: boolean; message: string }> = await response.json();
      if (!response.ok || !json.data) {
        throw new Error(json.error?.message ?? '닉네임 확인에 실패했어요.');
      }

      if (!json.data.available) {
        setCheckedNickname('');
        toast.error(json.data.message);
        return;
      }

      setCheckedNickname(input.trim());
      toast.success(json.data.message);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '닉네임 확인에 실패했어요.');
    } finally {
      setChecking(false);
    }
  };

  const saveNickname = async () => {
    if (checkedNickname !== input.trim()) {
      toast.error('닉네임 중복확인을 먼저 해줘요.');
      return;
    }

    try {
      setSaving(true);
      const response = await fetch('/api/v1/profile/nickname', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nickname: input.trim() })
      });
      const json: ApiResponse<{ nickname: string }> = await response.json();
      if (!response.ok || !json.data) {
        throw new Error(json.error?.message ?? '닉네임 저장에 실패했어요.');
      }

      setAuth({
        isLoggedIn: true,
        userId,
        email,
        nickname: input.trim(),
        hasNickname: true,
        role,
        verificationStatus,
        verifiedSchoolName
      });
      toast.success('닉네임 설정이 완료됐어요.');
      router.push(destination as Route);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '닉네임 저장에 실패했어요.');
    } finally {
      setSaving(false);
    }
  };

  if (!isReady) {
    return <div className="min-h-screen bg-background" />;
  }

  return (
    <main className="mx-auto max-w-md px-4 py-12">
      <div className="rounded-2xl border border-border bg-card p-6 md:p-7">
        <h1 className="mb-2 font-bold">닉네임 설정</h1>
        <p className="mb-6 text-body2 text-muted-foreground">후기를 남기기 전에 공개될 닉네임을 직접 정해줘요. 실명 말고 편한 닉네임이면 충분해요.</p>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-body2 font-semibold text-foreground">닉네임</label>
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(event) => {
                  setInput(event.target.value);
                  setCheckedNickname('');
                }}
                placeholder="예: 시드니사는코알라"
                className="h-11 flex-1 rounded-lg border border-border bg-background px-3 text-body2 outline-none focus:border-ring"
              />
              <button
                type="button"
                onClick={checkAvailability}
                disabled={checking || !input.trim()}
                className="rounded-lg border border-border px-4 text-body2 font-semibold text-foreground disabled:opacity-60"
              >
                중복확인
              </button>
            </div>
            <p className="mt-2 text-caption text-muted-foreground">한글, 영문, 숫자, 밑줄(_)만 가능하고 2~12자로 맞춰줘요.</p>
          </div>

          <button
            type="button"
            onClick={saveNickname}
            disabled={saving || checkedNickname !== input.trim()}
            className="h-12 w-full rounded-lg bg-accent font-semibold text-accent-foreground disabled:opacity-60"
          >
            닉네임 저장하고 계속하기
          </button>
        </div>
      </div>
    </main>
  );
}

export default function NicknameSetupPage() {
  return (
    <Suspense fallback={<main className="mx-auto max-w-md px-4 py-12" />}>
      <NicknameSetupPageContent />
    </Suspense>
  );
}
