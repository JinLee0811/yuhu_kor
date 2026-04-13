'use client';

import {
  User, PenSquare, Heart, Settings, ShieldCheck, Check, X,
  LogOut, ChevronDown, ChevronUp, AlertTriangle, ShieldAlert,
  CheckCircle2, Clock, XCircle, ChevronRight, Star
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useDeleteReview, useMyReviews, useUpdateReview } from '@/lib/hooks/useReviews';
import { useMyFavorites } from '@/lib/hooks/useFavorites';
import { toast } from 'sonner';
import { useAuthStore } from '@/lib/store/auth';
import { useAuth } from '@/lib/hooks/useAuth';
import { validateNickname } from '@/lib/profile/nickname';

export default function MyPage() {
  const router = useRouter();
  const { signOut } = useAuth();
  const myReviewsQuery = useMyReviews();
  const myFavoritesQuery = useMyFavorites();
  const deleteMutation = useDeleteReview();
  const updateMutation = useUpdateReview();

  const isReady = useAuthStore((state) => state.isReady);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const nickname = useAuthStore((state) => state.nickname);
  const email = useAuthStore((state) => state.email);
  const role = useAuthStore((state) => state.role);
  const verificationStatus = useAuthStore((state) => state.verificationStatus);
  const verifiedSchoolName = useAuthStore((state) => state.verifiedSchoolName);

  // 내가 쓴 후기 섹션 스크롤용 ref
  const reviewsRef = useRef<HTMLDivElement>(null);

  // 리뷰 수정 상태
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftSummary, setDraftSummary] = useState('');
  const [draftPros, setDraftPros] = useState('');
  const [draftCons, setDraftCons] = useState('');

  // 닉네임 변경 상태
  const [editingNickname, setEditingNickname] = useState(false);
  const [newNickname, setNewNickname] = useState('');
  const [nicknameError, setNicknameError] = useState<string | null>(null);
  const [nicknameLoading, setNicknameLoading] = useState(false);

  // 설정 섹션 토글
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    if (isReady && !isLoggedIn) {
      router.replace('/login?next=/mypage');
    }
  }, [isLoggedIn, isReady, router]);

  // ── 닉네임 변경 ──────────────────────────────
  const handleNicknameEdit = () => {
    setNewNickname(nickname);
    setNicknameError(null);
    setEditingNickname(true);
  };

  const handleNicknameChange = (value: string) => {
    setNewNickname(value);
    setNicknameError(validateNickname(value));
  };

  const handleNicknameSave = async () => {
    const error = validateNickname(newNickname);
    if (error) { setNicknameError(error); return; }
    try {
      setNicknameLoading(true);
      const res = await fetch('/api/v1/profile/nickname', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname: newNickname })
      });
      const json = (await res.json()) as { data?: { nickname: string }; error?: { message: string } };
      if (!res.ok || json.error) { setNicknameError(json.error?.message ?? '닉네임 저장에 실패했어요.'); return; }
      useAuthStore.setState({ nickname: json.data!.nickname, hasNickname: true });
      toast.success('닉네임이 변경됐어요.');
      setEditingNickname(false);
    } catch {
      setNicknameError('네트워크 오류가 발생했어요.');
    } finally {
      setNicknameLoading(false);
    }
  };

  // ── 로그아웃 ──────────────────────────────────
  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/');
      toast.success('로그아웃됐어요.');
    } catch {
      toast.error('로그아웃에 실패했어요.');
    }
  };

  if (!isReady) {
    return <div className="min-h-screen bg-background" />;
  }

  const myReviewCount = myReviewsQuery.data?.items.length ?? 0;
  const myFavoriteCount = myFavoritesQuery.data?.items.length ?? 0;

  // 인증 섹션 렌더링 헬퍼
  const renderVerificationSection = () => {
    if (verificationStatus === 'approved') {
      return (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-5 py-4">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />
          <div>
            <p className="font-semibold text-green-900">재학 인증 완료</p>
            <p className="text-body2 text-green-800/80">{verifiedSchoolName ?? '학교'} 재학생으로 인증됐어요. 리뷰 작성과 학교생활 게시판을 자유롭게 이용할 수 있어요.</p>
          </div>
        </div>
      );
    }
    if (verificationStatus === 'pending') {
      return (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
          <Clock className="h-5 w-5 shrink-0 text-amber-600" />
          <div>
            <p className="font-semibold text-amber-900">인증 서류 심사 중이에요</p>
            <p className="text-body2 text-amber-800/80">어드민이 서류를 확인 중이에요. 보통 1~2일 내 처리돼요.</p>
          </div>
        </div>
      );
    }
    if (verificationStatus === 'rejected') {
      return (
        <Link href="/verification" className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-5 py-4">
          <XCircle className="h-5 w-5 shrink-0 text-red-500" />
          <div className="flex-1">
            <p className="font-semibold text-red-900">인증이 반려됐어요</p>
            <p className="text-body2 text-red-800/80">서류를 다시 확인하고 재신청해 주세요.</p>
          </div>
          <ChevronRight className="h-4 w-4 text-red-400" />
        </Link>
      );
    }
    // none
    return (
      <Link href="/verification" className="mb-6 flex items-center gap-3 rounded-xl border border-border bg-card px-5 py-4 transition-colors hover:bg-muted">
        <ShieldAlert className="h-5 w-5 shrink-0 text-accent" />
        <div className="flex-1">
          <p className="font-semibold text-foreground">재학 인증 받기</p>
          <p className="text-body2 text-muted-foreground">COE·등록금 영수증·재학증명서로 인증하면 리뷰 작성과 학교생활 게시판을 이용할 수 있어요.</p>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-background pb-safe">
      <div className="mx-auto max-w-3xl px-4 py-6 md:px-6 md:py-8">
        <h1 className="mb-6 font-bold">내 페이지</h1>

        {/* ── 프로필 카드 ── */}
        <div className="mb-6 rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-accent/10">
              <User className="h-8 w-8 text-accent" />
            </div>
            <div className="min-w-0 flex-1">
              {editingNickname ? (
                <div className="space-y-2">
                  {/* 익명성 주의사항 */}
                  <div className="flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2.5">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                    <div>
                      <p className="text-caption font-semibold text-amber-800">익명성을 위해 아래 닉네임은 피해주세요</p>
                      <ul className="mt-1 space-y-0.5 text-caption text-amber-700">
                        <li>• 본명 또는 이름과 유사한 닉네임</li>
                        <li>• 주변 지인이 알법한 별명</li>
                        <li>• 유학원 이름이 포함된 닉네임</li>
                      </ul>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      value={newNickname}
                      onChange={(e) => handleNicknameChange(e.target.value)}
                      maxLength={12}
                      placeholder="새 닉네임 입력"
                      className="h-9 flex-1 rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                      autoFocus
                    />
                    <button type="button" onClick={handleNicknameSave} disabled={nicknameLoading || !!nicknameError}
                      className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground disabled:opacity-40" aria-label="저장">
                      <Check className="h-4 w-4" />
                    </button>
                    <button type="button" onClick={() => setEditingNickname(false)}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground" aria-label="취소">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  {nicknameError
                    ? <p className="text-caption text-negative">{nicknameError}</p>
                    : <p className="text-caption text-muted-foreground">한글·영문·숫자·밑줄(_) 2~12자</p>
                  }
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h2 className="font-bold text-foreground">{nickname || '닉네임 미설정'}</h2>
                  <button type="button" onClick={handleNicknameEdit} className="text-caption text-accent underline underline-offset-2">
                    변경
                  </button>
                </div>
              )}
              <p className="mt-0.5 text-body2 text-muted-foreground">{email ?? '이메일 정보 없음'}</p>
            </div>
          </div>
        </div>

        {/* ── 인증 상태 섹션 ── */}
        {renderVerificationSection()}

        {/* ── 메뉴 리스트 ── */}
        <div className="mb-6 overflow-hidden rounded-xl border border-border bg-card">
          {/* 내가 쓴 후기 */}
          <button onClick={() => reviewsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            className="flex w-full items-center gap-3 border-b border-border px-6 py-4 transition-colors hover:bg-muted">
            <PenSquare className="h-5 w-5 text-muted-foreground" />
            <span className="flex-1 text-left font-medium text-foreground">내가 쓴 후기</span>
            <span className="text-body2 text-accent">{myReviewCount}</span>
          </button>

          {/* 관심 유학원 */}
          <button onClick={() => document.getElementById('favorites-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            className="flex w-full items-center gap-3 border-b border-border px-6 py-4 transition-colors hover:bg-muted">
            <Heart className="h-5 w-5 text-muted-foreground" />
            <span className="flex-1 text-left font-medium text-foreground">관심 유학원</span>
            <span className="text-body2 text-accent">{myFavoriteCount}</span>
          </button>

          {/* 설정 토글 */}
          <button onClick={() => setSettingsOpen((v) => !v)}
            className="flex w-full items-center gap-3 px-6 py-4 transition-colors hover:bg-muted">
            <Settings className="h-5 w-5 text-muted-foreground" />
            <span className="flex-1 text-left font-medium text-foreground">설정</span>
            {settingsOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
          </button>
          {settingsOpen && (
            <div className="border-t border-border bg-muted/30 px-6 py-4">
              <button type="button" onClick={handleSignOut} className="flex items-center gap-2 text-body2 font-medium text-negative">
                <LogOut className="h-4 w-4" />
                로그아웃
              </button>
            </div>
          )}
        </div>

        {/* ── 어드민 링크 ── */}
        {role === 'admin' && (
          <Link href="/admin/agencies" className="mb-6 flex items-center gap-3 rounded-xl border border-accent/30 bg-accent/5 px-5 py-4">
            <ShieldCheck className="h-5 w-5 text-accent" />
            <div>
              <p className="font-semibold text-foreground">유학원 어드민 페이지</p>
              <p className="text-body2 text-muted-foreground">유학원 추가, 수정, 삭제와 노출 순서를 관리할 수 있어요.</p>
            </div>
          </Link>
        )}

        {/* ── 관심 유학원 목록 ── */}
        <div id="favorites-section" className="mb-8 scroll-mt-4">
          <h2 className="mb-3 font-semibold text-foreground">관심 유학원</h2>
          {myFavoritesQuery.isLoading && (
            <p className="py-4 text-center text-body2 text-muted-foreground">불러오는 중...</p>
          )}
          {!myFavoritesQuery.isLoading && myFavoriteCount === 0 && (
            <div className="rounded-xl border border-dashed border-border px-6 py-8 text-center">
              <p className="mb-1 font-medium text-foreground">관심 유학원이 없어요</p>
              <p className="text-body2 text-muted-foreground">유학원 상세 페이지에서 하트 버튼을 눌러 저장해 보세요.</p>
            </div>
          )}
          <div className="space-y-2">
            {(myFavoritesQuery.data?.items ?? []).map((fav) => (
              <Link
                key={fav.favoriteId}
                href={`/au/agency/${fav.slug}`}
                className="flex items-center gap-4 rounded-xl border border-border bg-card px-4 py-3.5 transition-colors hover:bg-muted"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10 text-sm font-bold text-accent">
                  {fav.name.slice(0, 1)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-foreground">{fav.name}</p>
                  <div className="flex items-center gap-1 text-caption text-muted-foreground">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    <span>{fav.avgScore.toFixed(1)}</span>
                    <span>·</span>
                    <span>후기 {fav.reviewCount}개</span>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
              </Link>
            ))}
          </div>
        </div>

        {/* ── 내가 쓴 후기 목록 ── */}
        <div ref={reviewsRef} className="scroll-mt-4">
          <h2 className="mb-3 font-semibold text-foreground">내가 쓴 후기</h2>
          {myReviewsQuery.isLoading && (
            <p className="py-4 text-center text-body2 text-muted-foreground">후기를 불러오는 중...</p>
          )}
          {!myReviewsQuery.isLoading && myReviewCount === 0 && (
            <div className="rounded-xl border border-border bg-card px-6 py-10 text-center">
              <p className="mb-1 font-medium text-foreground">아직 작성한 후기가 없어요</p>
              <p className="mb-4 text-body2 text-muted-foreground">첫 후기를 남겨보세요. 익명으로 게시돼요.</p>
              {verificationStatus === 'approved' ? (
                <Link href="/reviews/write" className="inline-flex h-10 items-center rounded-lg bg-accent px-5 text-body2 font-semibold text-accent-foreground">
                  후기 쓰러 가기
                </Link>
              ) : (
                <Link href="/verification" className="inline-flex h-10 items-center rounded-lg border border-accent px-5 text-body2 font-semibold text-accent">
                  인증 후 작성 가능해요
                </Link>
              )}
            </div>
          )}
          <div className="space-y-3">
            {(myReviewsQuery.data?.items ?? []).map((review) => (
              <article key={review.id} className="rounded-xl border border-border bg-card p-4">
                {editingId === review.id ? (
                  <div className="space-y-3">
                    <input value={draftSummary} onChange={(e) => setDraftSummary(e.target.value)}
                      placeholder="한 줄 요약" className="h-11 w-full rounded-lg border border-border bg-background px-3 text-body2" />
                    <textarea value={draftPros} onChange={(e) => setDraftPros(e.target.value)}
                      rows={3} placeholder="좋았던 점" className="w-full rounded-lg border border-border bg-background px-3 py-3 text-body2" />
                    <textarea value={draftCons} onChange={(e) => setDraftCons(e.target.value)}
                      rows={3} placeholder="아쉬운 점" className="w-full rounded-lg border border-border bg-background px-3 py-3 text-body2" />
                    <div className="flex gap-2">
                      <button type="button"
                        onClick={async () => {
                          try {
                            await updateMutation.mutateAsync({ id: review.id, summary: draftSummary, pros: draftPros, cons: draftCons });
                            toast.success('후기를 수정했어요.');
                            setEditingId(null);
                          } catch (error) {
                            toast.error(error instanceof Error ? error.message : '후기 수정에 실패했어요.');
                          }
                        }}
                        className="rounded-lg bg-accent px-3 py-1.5 text-caption font-semibold text-accent-foreground">
                        저장
                      </button>
                      <button type="button" onClick={() => setEditingId(null)} className="rounded-lg border border-border px-3 py-1.5 text-caption">
                        취소
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="mb-2 font-semibold text-foreground">{review.summary}</p>
                    <p className="mb-2 line-clamp-2 text-body2 text-muted-foreground">{review.pros}</p>
                    <p className="mb-3 line-clamp-2 text-body2 text-muted-foreground">{review.cons}</p>
                    <div className="flex gap-2">
                      <button type="button"
                        onClick={() => { setEditingId(review.id); setDraftSummary(review.summary); setDraftPros(review.pros); setDraftCons(review.cons); }}
                        className="rounded-lg border border-border px-3 py-1.5 text-caption text-foreground">
                        수정
                      </button>
                      <button type="button"
                        onClick={() => { if (confirm('후기를 삭제할까요?')) deleteMutation.mutate(review.id); }}
                        className="rounded-lg border border-negative px-3 py-1.5 text-caption text-negative">
                        삭제
                      </button>
                    </div>
                  </>
                )}
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
