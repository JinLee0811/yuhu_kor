'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Eye, Heart, MessageSquare, Search, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import type { BoardPost } from '@/types/board';
import type { ApiResponse } from '@/lib/api';
import { SchoolVerificationBadge } from '@/components/board/SchoolVerificationBadge';

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('ko-KR', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(iso));
}

function AdminBoardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [posts, setPosts] = useState<BoardPost[]>([]);
  const [filtered, setFiltered] = useState<BoardPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [search, setSearch] = useState(searchParams.get('q') ?? '');
  const [confirmId, setConfirmId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/board');
      const json: ApiResponse<BoardPost[]> = await res.json();
      if (!res.ok || !json.data) throw new Error(json.error?.message ?? '');
      setPosts(json.data);
      setFiltered(json.data);
    } catch {
      toast.error('게시글 목록을 불러오지 못했어요.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  // 검색 필터
  useEffect(() => {
    const q = search.trim().toLowerCase();
    if (!q) {
      setFiltered(posts);
      return;
    }
    setFiltered(
      posts.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.content.toLowerCase().includes(q) ||
          p.authorNickname.toLowerCase().includes(q) ||
          (p.schoolVerification.schoolName?.toLowerCase().includes(q) ?? false)
      )
    );
  }, [search, posts]);

  async function handleDelete(id: string) {
    if (confirmId !== id) {
      // 첫 클릭: 확인 상태로 전환
      setConfirmId(id);
      return;
    }

    // 두 번째 클릭: 실제 삭제
    setConfirmId(null);
    setDeleting(id);
    try {
      const res = await fetch(`/api/v1/admin/board/${id}`, { method: 'DELETE' });
      const json: ApiResponse<{ id: string }> = await res.json();
      if (!res.ok || !json.data) throw new Error(json.error?.message ?? '');
      toast.success('게시글을 삭제했어요.');
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '삭제에 실패했어요.');
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="space-y-4">
      {/* 헤더 */}
      <div>
        <h1 className="text-lg font-bold text-foreground">게시판 관리</h1>
        <p className="mt-1 text-body2 text-muted-foreground">
          스팸·부적절한 게시글을 검색하고 삭제할 수 있어요. 총 <strong>{posts.length}</strong>개
        </p>
      </div>

      {/* 검색 */}
      <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5 shadow-sm">
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            const params = new URLSearchParams(searchParams.toString());
            if (e.target.value) params.set('q', e.target.value);
            else params.delete('q');
            router.replace(`/admin/board?${params.toString()}`, { scroll: false });
          }}
          placeholder="제목, 내용, 닉네임, 학교명 검색"
          className="flex-1 bg-transparent text-body2 outline-none placeholder:text-muted-foreground"
        />
        {search && (
          <button type="button" onClick={() => setSearch('')} className="text-caption text-muted-foreground hover:text-foreground">
            초기화
          </button>
        )}
      </div>

      {/* 목록 */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card py-16 text-center">
          <MessageSquare className="mb-3 h-10 w-10 text-muted-foreground/40" />
          <p className="font-semibold text-muted-foreground">{search ? '검색 결과가 없어요.' : '게시글이 없어요.'}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((post) => {
            const isConfirming = confirmId === post.id;
            const isDeleting = deleting === post.id;

            return (
              <div key={post.id} className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                {/* 게시글 정보 */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    {/* 작성자 + 배지 */}
                    <div className="mb-1.5 flex flex-wrap items-center gap-1.5 text-caption text-muted-foreground">
                      <span className="font-medium text-foreground">{post.isAnonymous ? '익명' : post.authorNickname}</span>
                      {post.schoolVerification.isVerified && post.schoolVerification.schoolName ? (
                        <SchoolVerificationBadge
                          schoolName={post.schoolVerification.schoolName}
                          department={post.schoolVerification.department}
                          schoolStatus={post.schoolVerification.schoolStatus}
                        />
                      ) : null}
                      <span>·</span>
                      <span>{formatDate(post.createdAt)}</span>
                      <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                        ID: {post.id.slice(0, 8)}
                      </span>
                    </div>

                    {/* 제목 */}
                    <p className="font-semibold text-foreground">{post.title}</p>

                    {/* 내용 미리보기 */}
                    <p className="mt-1 line-clamp-2 text-body2 text-muted-foreground">{post.content}</p>

                    {/* 통계 */}
                    <div className="mt-2.5 flex gap-3 text-caption text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Eye className="h-3.5 w-3.5" />
                        {post.viewCount}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MessageSquare className="h-3.5 w-3.5" />
                        {post.commentCount}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Heart className="h-3.5 w-3.5" />
                        {post.likeCount}
                      </span>
                    </div>
                  </div>

                  {/* 삭제 버튼 */}
                  <button
                    type="button"
                    disabled={isDeleting}
                    onClick={() => handleDelete(post.id)}
                    onBlur={() => {
                      // 포커스 벗어나면 확인 상태 초기화
                      setTimeout(() => setConfirmId((prev) => (prev === post.id ? null : prev)), 200);
                    }}
                    className={`flex shrink-0 items-center gap-1.5 rounded-xl border px-3 py-2 text-caption font-semibold transition-colors disabled:opacity-50 ${
                      isConfirming
                        ? 'border-negative bg-negative text-white hover:bg-negative/90'
                        : 'border-border text-muted-foreground hover:border-negative hover:text-negative'
                    }`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    {isDeleting ? '삭제중...' : isConfirming ? '확인 (재클릭)' : '삭제'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 검색 결과 카운트 */}
      {search && !loading && (
        <p className="text-center text-caption text-muted-foreground">
          &ldquo;{search}&rdquo; 검색 결과 {filtered.length}개
        </p>
      )}
    </div>
  );
}

export default function AdminBoardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <AdminBoardContent />
    </Suspense>
  );
}
