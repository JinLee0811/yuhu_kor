'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, Clock3, Lock } from 'lucide-react';
import Link from 'next/link';
import type { BoardPost } from '@/types/board';
import type { ApiResponse } from '@/lib/api';
import { BoardPostCard } from '@/components/board/BoardPostCard';
import { BoardPostComposer } from '@/components/board/BoardPostComposer';
import { useAuthStore } from '@/lib/store/auth';

async function fetchBoardPosts(schoolId?: string | null): Promise<BoardPost[]> {
  const params = schoolId ? `?school_id=${schoolId}` : '';
  const res = await fetch(`/api/v1/board${params}`);
  const json: ApiResponse<BoardPost[]> = await res.json();
  if (!res.ok || !json.data) throw new Error(json.error?.message ?? '게시글을 불러오지 못했어요.');
  return json.data;
}

function BoardPageContent() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const selectedSchoolId = searchParams.get('school');

  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const nickname = useAuthStore((state) => state.nickname);
  const role = useAuthStore((state) => state.role);
  const verificationStatus = useAuthStore((state) => state.verificationStatus);
  const verifiedSchoolName = useAuthStore((state) => state.verifiedSchoolName);
  const verifiedDepartment = useAuthStore((state) => state.verifiedDepartment);
  const verifiedSchoolStatus = useAuthStore((state) => state.verifiedSchoolStatus);

  const isAdmin = role === 'admin';
  // 어드민은 인증 없이 모든 기능 사용 가능
  const canRead = verificationStatus === 'approved' || isAdmin;

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['board-posts', selectedSchoolId],
    queryFn: () => fetchBoardPosts(selectedSchoolId)
  });

  // 게시글 작성 핸들러
  async function handleSubmit(input: Pick<BoardPost, 'title' | 'content' | 'isAnonymous' | 'schoolVerification' | 'authorNickname' | 'schoolId'>) {
    const res = await fetch('/api/v1/board', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: input.title,
        content: input.content,
        isAnonymous: input.isAnonymous,
        schoolId: input.schoolId
      })
    });

    const json: ApiResponse<BoardPost> = await res.json();
    if (!res.ok || json.error) {
      throw new Error(json.error?.message ?? '게시글 작성에 실패했습니다.');
    }

    // 목록 캐시 무효화 후 상세 페이지 이동
    await queryClient.invalidateQueries({ queryKey: ['board-posts'] });
    router.push(`/board/${json.data!.id}`);
  }

  return (
    <div className="min-h-screen bg-background pb-safe">
      <div className="mx-auto max-w-layout px-4 py-6 md:px-6 md:py-8">
        <section className="mb-5 rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="mb-2 inline-flex rounded-full bg-accent/10 px-3 py-1 text-caption font-semibold text-accent">
            자유게시판
          </div>
          <h1 className="text-xl font-bold text-foreground">
            학교생활 게시판
          </h1>
          <p className="mt-2 text-body2 text-muted-foreground">
            수업 분위기, 적응 팁, 생활 후기까지 편하게 남겨봐요. 지금은 자유게시판 하나로 먼저 운영해요.
          </p>
        </section>

        {!isLoggedIn ? (
          <section className="mb-5 rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-accent/10">
                <Lock className="h-4 w-4 text-accent" />
              </div>
              <div>
                <p className="font-semibold text-foreground">인증된 유학생만 전체 내용을 볼 수 있어요</p>
                <p className="mt-1 text-body2 text-muted-foreground">먼저 로그인하고, COE나 재학증명서로 인증하면 바로 열람 가능해요.</p>
                <div className="mt-3 flex gap-2">
                  <Link href="/login" className="rounded-lg border border-border px-4 py-2 text-caption font-semibold text-foreground">
                    로그인
                  </Link>
                  <Link href="/verification" className="rounded-lg bg-accent px-4 py-2 text-caption font-semibold text-accent-foreground">
                    인증하러 가기
                  </Link>
                </div>
              </div>
            </div>
          </section>
        ) : isAdmin ? null : verificationStatus === 'pending' ? (
          <section className="mb-5 rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-amber-100">
                <Clock3 className="h-4 w-4 text-amber-700" />
              </div>
              <div>
                <p className="font-semibold text-foreground">인증 심사 중이에요</p>
                <p className="mt-1 text-body2 text-muted-foreground">
                  {verifiedSchoolName ? `${verifiedSchoolName} 기준 서류를 검토 중이에요.` : '제출한 서류를 확인 중이에요.'} 승인되면 게시글 전체 열람과 글쓰기가 열려요.
                </p>
              </div>
            </div>
          </section>
        ) : canRead && verifiedSchoolName ? (
          <section className="mb-5 rounded-2xl border border-green-200 bg-green-50 p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-white">
                <CheckCircle2 className="h-4 w-4 text-green-700" />
              </div>
              <div>
                <p className="font-semibold text-green-900">{verifiedSchoolName} 인증이 완료됐어요</p>
                <p className="mt-1 text-body2 text-green-800/80">이제 게시글 전체 열람과 글쓰기가 가능해요.</p>
              </div>
            </div>
          </section>
        ) : null}

        {canRead && verifiedSchoolName ? (
          <div className="mb-5">
            <BoardPostComposer
              authorNickname={nickname}
              verifiedSchoolName={verifiedSchoolName}
              verifiedDepartment={verifiedDepartment}
              verifiedSchoolStatus={verifiedSchoolStatus}
              selectedSchoolId={selectedSchoolId}
              onSubmit={handleSubmit}
            />
          </div>
        ) : null}

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 animate-pulse rounded-2xl bg-muted" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center">
            <p className="text-body2 text-muted-foreground">아직 게시글이 없어요. 첫 글을 남겨봐요!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => (
              <BoardPostCard key={post.id} post={post} canRead={canRead} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function BoardPage() {
  return (
    <Suspense>
      <BoardPageContent />
    </Suspense>
  );
}
