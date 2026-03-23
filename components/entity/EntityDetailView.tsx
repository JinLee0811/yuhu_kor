'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ChevronDown, ChevronLeft, Heart, PenSquare, Share2, X } from 'lucide-react';
import type { Route } from 'next';
import type { Entity } from '@/types/entity';
import type { Review, ReviewType } from '@/types/review';
import { EntityDetail } from '@/components/entity/EntityDetail';
import { ReviewList } from '@/components/review/ReviewList';
import { useAuthStore } from '@/lib/store/auth';
import { AuthRequiredPanel } from '@/components/common/AuthRequiredPanel';
import { useFavoriteToggle } from '@/lib/hooks/useFavorites';
import { toast } from 'sonner';

interface Props {
  entity: Entity;
  reviews: Review[];
  topSchools: Array<{ schoolId: string; schoolName: string; count: number }>;
}

const sortOptions = ['최신순', '도움순', '평점높은순', '평점낮은순'] as const;

const reviewTabs: Array<{ key: 'all' | ReviewType; label: string }> = [
  { key: 'all', label: '전체' },
  { key: 'consultation', label: '상담만 받았어요' },
  { key: 'full', label: '등록하고 학교까지 갔어요' },
  { key: 'aftercare', label: '학교 다니면서 관리받은 후기예요' }
];

export function EntityDetailView({ entity, reviews, topSchools }: Props) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const canViewContent = isLoggedIn || process.env.NODE_ENV !== 'production';
  const [sortBy, setSortBy] = useState<(typeof sortOptions)[number]>('최신순');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | ReviewType>('all');
  const [isPolicyOpen, setIsPolicyOpen] = useState(false);

  // 즐겨찾기 토글 (로그인한 경우에만 동작)
  const { isFavorited, isLoading: favLoading, toggle: toggleFavorite } = useFavoriteToggle(entity.id, false);

  const handleFavorite = () => {
    if (!isLoggedIn) {
      toast.error('로그인 후 즐겨찾기를 사용할 수 있어요.');
      return;
    }
    toggleFavorite();
    toast.success(isFavorited ? '관심 유학원에서 제거했어요.' : '관심 유학원에 추가했어요.');
  };
  const stickyTopClass = canViewContent ? 'top-14 md:top-16' : 'top-[90px] md:top-[96px]';

  const scoreItems = [
    { label: '상담은 어땠어요?', score: 4.9 },
    { label: '비용 설명 잘 해줬어요?', score: 4.7 },
    { label: '등록 후 관리는요?', score: 5.0 },
    { label: '전문성', score: 4.8 },
    { label: '연락은 빨랐어요?', score: 4.6 }
  ];

  const filteredByType = useMemo(
    () => reviews.filter((review) => (activeTab === 'all' ? true : review.review_type === activeTab)),
    [reviews, activeTab]
  );

  const displayedReviews = useMemo(() => {
    const sorted = [...filteredByType];
    if (sortBy === '도움순') {
      sorted.sort((a, b) => b.helpful_count - a.helpful_count);
    } else if (sortBy === '평점높은순') {
      sorted.sort((a, b) => b.score_total - a.score_total);
    } else if (sortBy === '평점낮은순') {
      sorted.sort((a, b) => a.score_total - b.score_total);
    } else {
      sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
    return sorted;
  }, [filteredByType, sortBy]);

  const tabAverage = useMemo(() => {
    if (filteredByType.length === 0) return 0;
    const total = filteredByType.reduce((sum, review) => sum + review.score_total, 0);
    return Number((total / filteredByType.length).toFixed(2));
  }, [filteredByType]);

  if (!canViewContent) {
    return (
      <div className="min-h-screen bg-background pb-safe">
        <div className="mx-auto max-w-3xl px-4 py-10 md:px-6">
          <AuthRequiredPanel
            title={`${entity.name} 후기랑 자세한 정보는 회원만 볼 수 있어요`}
            description="유학원 리스트와 기본 정보는 둘러볼 수 있지만, 실제 후기와 연결 학교, 상세 비교는 로그인 후 열려요."
            signupHref={`/signup?next=${encodeURIComponent(`/au/agency/${entity.slug}`)}` as Route}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-safe">
      <div className={`sticky z-30 flex items-center justify-between border-b border-border bg-card px-4 py-3 md:hidden ${stickyTopClass}`}>
        <button type="button" onClick={() => history.back()} className="flex items-center gap-1 text-foreground">
          <ChevronLeft className="h-5 w-5" />
          <span className="font-medium">뒤로</span>
        </button>
        <div className="flex items-center gap-1">
          {/* 즐겨찾기 버튼 */}
          <button
            type="button"
            onClick={handleFavorite}
            disabled={favLoading}
            className="rounded-lg p-2 transition-colors hover:bg-muted"
            aria-label={isFavorited ? '즐겨찾기 해제' : '즐겨찾기 추가'}
          >
            <Heart
              className={`h-5 w-5 transition-colors ${isFavorited ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`}
            />
          </button>
          <button className="rounded-lg p-2 transition-colors hover:bg-muted">
            <Share2 className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-layout lg:grid lg:grid-cols-[40%_60%] lg:gap-8 lg:pt-4">
        <div className="space-y-4 lg:sticky lg:top-28 lg:self-start">
          <EntityDetail entity={entity} scoreItems={scoreItems} />
          <section className="border-b border-border bg-card p-4 md:p-6 lg:rounded-xl lg:border">
            <div className="mb-3">
              <h3 className="font-semibold text-foreground">이 유학원이 많이 보낸 학교</h3>
              <p className="mt-1 text-caption text-muted-foreground">후기를 남긴 유저 데이터 기준이에요</p>
            </div>

            {topSchools.length > 0 ? (
              <div className="space-y-2">
                {topSchools.map((school, index) => (
                  <Link
                    key={school.schoolId}
                    href={`/schools/${school.schoolId}`}
                    className="flex items-center justify-between rounded-xl border border-border/70 bg-background px-3 py-3 transition-colors hover:bg-muted/40"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="w-7 text-sm font-semibold text-accent">{index + 1}위</span>
                      <span className="truncate font-medium text-foreground">{school.schoolName}</span>
                    </div>
                    <div className="flex items-center gap-3 text-body2 text-muted-foreground">
                      <span>{school.count}명</span>
                      <span aria-hidden="true">→</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="rounded-xl border border-dashed border-border/70 bg-background px-4 py-4 text-body2 text-muted-foreground">
                아직 데이터가 없어요. 후기를 남겨주세요 👀
              </p>
            )}
          </section>
        </div>

        <div className="px-4 py-6 md:px-6 lg:px-0 lg:pb-0 lg:pt-6">
          <div className="mb-4 rounded-lg border border-border bg-card p-3 text-body2 text-muted-foreground lg:mb-5">
            유후는 광고비 받고 후기 지우는 거 없어요. 약속할게요.{' '}
            <button onClick={() => setIsPolicyOpen(true)} className="font-semibold text-accent hover:underline">
              자세히 알아보기
            </button>
          </div>

          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold text-foreground">
              후기 <span className="text-accent">{displayedReviews.length}</span>
            </h2>

            <div className="relative">
              <button
                onClick={() => setShowSortDropdown((prev) => !prev)}
                className="flex items-center gap-1 rounded-lg bg-muted px-3 py-1.5 text-body2 font-medium text-foreground transition-colors hover:bg-muted/80"
              >
                <span>{sortBy}</span>
                <ChevronDown className="h-4 w-4" />
              </button>

              {showSortDropdown ? (
                <>
                  <button className="fixed inset-0 z-30" onClick={() => setShowSortDropdown(false)} aria-label="close" />
                  <div className="absolute right-0 top-full z-40 mt-2 min-w-[120px] overflow-hidden rounded-lg border border-border bg-card shadow-lg">
                    {sortOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setSortBy(option);
                          setShowSortDropdown(false);
                        }}
                        className={`w-full px-4 py-2.5 text-left text-body2 transition-colors hover:bg-muted ${
                          sortBy === option ? 'font-semibold text-accent' : 'text-foreground'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </>
              ) : null}
            </div>
          </div>

          <div className="mb-4 rounded-xl border border-border bg-card p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-body2 font-semibold text-foreground">어떤 후기들이 있어요?</p>
              <p className="text-body2 text-muted-foreground">평균 {tabAverage.toFixed(1)}점</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {reviewTabs.map((tab) => {
                const count = reviews.filter((review) => (tab.key === 'all' ? true : review.review_type === tab.key)).length;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`rounded-lg px-3 py-2 text-body2 font-medium transition-colors ${
                      activeTab === tab.key ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {tab.label} {count}
                  </button>
                );
              })}
            </div>
          </div>

          <ReviewList items={displayedReviews} />

          <div className="mt-6 text-center">
            <button className="rounded-lg bg-secondary px-6 py-3 font-semibold text-secondary-foreground transition-colors hover:bg-secondary/80">
              후기 더 보기
            </button>
          </div>
        </div>
      </div>

      {isPolicyOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-xl border border-border bg-card p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold">후기 신뢰도 정책</h3>
              <button onClick={() => setIsPolicyOpen(false)} className="rounded-md p-1 hover:bg-muted" aria-label="닫기">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-2 text-body2 text-muted-foreground">
              <p>유후는 광고비 받고 후기 지우는 거 없어요. 약속할게요.</p>
              <p>검증된 문서 기반 인증 후기랑 소셜 인증 정보를 표시해서 신뢰도를 알려드려요.</p>
              <p>허위 후기로 확인되면 계정이랑 작성 권한이 제한돼요.</p>
            </div>
          </div>
        </div>
      ) : null}

      <div className="fixed bottom-14 left-0 right-0 z-30 bg-gradient-to-t from-background via-background to-transparent p-4 md:hidden">
        <Link href={`/reviews/write?agency=${entity.id}`}>
          <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3.5 font-semibold text-accent-foreground shadow-lg transition-opacity hover:opacity-90">
            <PenSquare className="h-5 w-5" />
            이 유학원 후기 남기기
          </button>
        </Link>
      </div>

      <div className="fixed bottom-8 right-8 z-30 hidden md:block">
        <Link href={`/reviews/write?agency=${entity.id}`}>
          <button className="flex items-center gap-2 rounded-lg bg-accent px-6 py-3.5 font-semibold text-accent-foreground shadow-xl transition-opacity hover:opacity-90">
            <PenSquare className="h-5 w-5" />
            후기 남기기
          </button>
        </Link>
      </div>
    </div>
  );
}
