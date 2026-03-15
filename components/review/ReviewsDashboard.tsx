'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import { ArrowLeft, ArrowRight, ArrowUpRight, ChevronRight, FilePenLine, MapPin, Star } from 'lucide-react';
import type { Review } from '@/types/review';
import type { Entity } from '@/types/entity';
import { ReviewCard } from '@/components/review/ReviewCard';
import { useAuthStore } from '@/lib/store/auth';

interface Props {
  reviews: Review[];
  topAgencies: Entity[];
  reviewStats: {
    totalReviews: number;
    totalAgencies: number;
    totalMembers: number;
  };
}

export function ReviewsDashboard({ reviews, topAgencies, reviewStats }: Props) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const canViewContent = isLoggedIn || process.env.NODE_ENV !== 'production';
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const node = carouselRef.current;
    if (!node || reviews.length === 0) return;

    const handleScroll = () => {
      const nextIndex = Math.round(node.scrollLeft / Math.max(node.clientWidth, 1));
      setActiveIndex(Math.min(reviews.length - 1, Math.max(0, nextIndex)));
    };

    handleScroll();
    node.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      node.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [reviews.length]);

  const moveToReview = (index: number) => {
    const node = carouselRef.current;
    if (!node || reviews.length === 0) return;

    const nextIndex = Math.min(reviews.length - 1, Math.max(0, index));
    node.scrollTo({
      left: nextIndex * node.clientWidth,
      behavior: 'smooth'
    });
    setActiveIndex(nextIndex);
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#FAFAF8] pb-safe">
      <div className="mx-auto max-w-screen-lg px-2.5 py-3 sm:px-4 sm:py-5 lg:px-5 lg:py-7">
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-start">
          <div className="min-w-0 space-y-5">
            <section className="w-full min-w-0 rounded-[22px] border border-[#F2B399] bg-[linear-gradient(135deg,#FFF7F3_0%,#FFFDFB_100%)] p-3.5 shadow-[0_10px_28px_rgba(17,24,39,0.05)] sm:rounded-[24px] sm:p-5">
              <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between md:grid md:grid-cols-[minmax(0,1fr)_auto] md:gap-5">
                <div className="max-w-lg md:max-w-none">
                  <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#FF6B35] shadow-sm sm:h-9 sm:w-9">
                    <FilePenLine className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </div>
                  <h2 className="text-[15px] font-black text-[#1A1A2E] sm:text-lg">후기 작성하기</h2>
                  <p className="mt-1 text-[12px] leading-relaxed text-[#6B7280] sm:text-sm">
                    다녀온 유학원 경험을 남기고 다른 학생들에게 실질적인 도움을 주세요.
                  </p>
                </div>
                <Link
                  href="/reviews/write"
                  className="inline-flex h-9 w-full shrink-0 items-center justify-center rounded-xl bg-[#FF6B35] px-4 text-[13px] font-semibold text-white transition hover:brightness-110 sm:h-10 sm:w-auto sm:min-w-[110px] sm:text-sm md:min-w-[136px]"
                >
                  작성하기
                </Link>
              </div>
            </section>

            <section className="w-full min-w-0 rounded-[22px] border border-[#E5E7EB] bg-white p-3.5 shadow-[0_10px_28px_rgba(17,24,39,0.05)] sm:rounded-[24px] sm:p-5">
              <div className="md:max-lg:grid md:max-lg:grid-cols-[minmax(220px,280px)_minmax(0,1fr)] md:max-lg:items-start md:max-lg:gap-5">
                <div className="min-w-0">
                  <h1 className="text-[1.95rem] font-black tracking-[-0.04em] text-[#1A1A2E] sm:text-[1.6rem]">최신 후기</h1>
                  <p className="mt-1 text-[12px] leading-relaxed text-[#6B7280] sm:text-sm">실제 상담과 이용 경험이 빠르게 업데이트돼요.</p>
                  <p className="mt-1 text-[10px] font-medium text-[#9CA3AF] sm:mt-1.5 sm:text-[11px]">카드를 좌우로 넘겨 최신 후기를 확인해보세요.</p>
                  <div className="mt-3 flex items-center justify-between gap-2 md:mt-5 md:max-lg:justify-start lg:mt-3 lg:justify-end">
                    <Link
                      href={canViewContent ? '/reviews/all' : ('/signup?next=%2Freviews%2Fall' as Route)}
                      className="text-[13px] font-semibold text-[#FF6B35] hover:underline sm:text-sm"
                    >
                      전체보기
                    </Link>

                    {reviews.length > 1 ? (
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <button
                          type="button"
                          onClick={() => moveToReview(activeIndex - 1)}
                          disabled={activeIndex === 0}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#E5E7EB] text-[#1A1A2E] transition hover:border-[#FFD5C6] hover:bg-[#FFF6F2] disabled:cursor-not-allowed disabled:opacity-35 sm:h-9 sm:w-9"
                          aria-label="이전 후기"
                        >
                          <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveToReview(activeIndex + 1)}
                          disabled={activeIndex === reviews.length - 1}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#E5E7EB] text-[#1A1A2E] transition hover:border-[#FFD5C6] hover:bg-[#FFF6F2] disabled:cursor-not-allowed disabled:opacity-35 sm:h-9 sm:w-9"
                          aria-label="다음 후기"
                        >
                          <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="mt-4 mx-auto w-full min-w-0 max-w-[470px] md:max-lg:mt-0 md:max-lg:max-w-none lg:max-w-[640px] xl:max-w-[560px]">
                  <div ref={carouselRef} className="w-full max-w-full overflow-x-auto scrollbar-hide snap-x snap-mandatory px-1 py-1">
                    <div className="flex">
                      {reviews.map((review) => {
                        const href = canViewContent
                          ? (`/reviews/${review.id}` as Route)
                          : (`/signup?next=${encodeURIComponent(`/reviews/${review.id}`)}` as Route);

                        return (
                          <div key={review.id} className="relative w-full min-w-0 shrink-0 snap-center px-1 pb-1.5 sm:pb-2">
                            <div className="w-full min-w-0">
                              <Link href={href} className="block h-full">
                                <div className={!canViewContent ? 'pointer-events-none blur-[6px]' : ''}>
                                  <ReviewCard
                                    review={review}
                                    compact
                                    commentsInteractive={false}
                                    className="h-full w-full cursor-pointer rounded-[20px] border-[#E5E7EB] p-3 shadow-[0_10px_24px_rgba(17,24,39,0.04)] sm:rounded-[22px] sm:p-4"
                                  />
                                </div>
                              </Link>

                              {!canViewContent ? (
                                <div className="absolute inset-[4px] flex items-center justify-center rounded-[20px] bg-white/55 px-4 text-center sm:rounded-[22px] sm:px-5">
                                  <div className="rounded-xl bg-white/95 px-4 py-3 shadow-md">
                                    <p className="font-semibold text-[#1A1A2E]">로그인 후 후기 확인</p>
                                    <p className="mt-1 text-xs text-[#6B7280]">가입하면 전체 후기를 볼 수 있어요.</p>
                                  </div>
                                </div>
                              ) : null}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {reviews.length > 1 ? (
                    <div className="mt-4 flex items-center justify-center gap-2 md:max-lg:mt-3 md:max-lg:justify-start">
                      {reviews.map((review, index) => (
                        <button
                          key={review.id}
                          type="button"
                          onClick={() => moveToReview(index)}
                          className={`h-2.5 rounded-full transition-all ${
                            index === activeIndex ? 'w-7 bg-[#FF6B35]' : 'w-2.5 bg-[#E5E7EB] hover:bg-[#FFD5C6]'
                          }`}
                          aria-label={`${index + 1}번째 후기 보기`}
                        />
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            </section>
          </div>

          <aside className="min-w-0 grid gap-5 lg:grid-cols-2 xl:grid-cols-1">
            <section className="w-full min-w-0 rounded-[28px] border border-[#E5E7EB] bg-white p-5 shadow-[0_10px_28px_rgba(17,24,39,0.05)]">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-black text-[#1A1A2E]">인기 유학원 TOP 5</h2>
              </div>

              <div className="space-y-2">
                {topAgencies.map((agency, index) => {
                  const href = canViewContent
                    ? (`/au/agency/${agency.slug}` as Route)
                    : (`/signup?next=${encodeURIComponent(`/au/agency/${agency.slug}`)}` as Route);

                  return (
                    <Link
                      key={agency.id}
                      href={href}
                      className="flex w-full min-w-0 items-center justify-between rounded-xl border border-[#F3F4F6] px-3 py-3 transition hover:border-[#FFE2D6] hover:bg-[#FFF8F5]"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#FFF0EB] text-[11px] font-bold text-[#FF6B35]">
                            {index + 1}
                          </span>
                          <p className="line-clamp-1 text-sm font-semibold text-[#111827]">{agency.name}</p>
                        </div>
                        <p className="mt-1 flex items-center gap-1 text-xs text-[#6B7280]">
                          <MapPin className="h-3 w-3" />
                          {agency.coverage_cities[0] ?? '호주'}
                          <span>·</span>
                          <Star className="h-3.5 w-3.5 fill-[#FF6B35] text-[#FF6B35]" />
                          {agency.avg_score.toFixed(1)} ({agency.review_count})
                        </p>
                      </div>
                      <ArrowUpRight className="h-4 w-4 shrink-0 text-[#9CA3AF]" />
                    </Link>
                  );
                })}
              </div>

              <Link
                href="/au/agency"
                className="mt-4 inline-flex w-full items-center justify-center gap-1 rounded-xl bg-[#FF6B35] px-4 py-3 text-sm font-semibold text-white transition hover:brightness-110"
              >
                전체 유학원 보기
                <ChevronRight className="h-4 w-4" />
              </Link>
            </section>

            <section className="w-full min-w-0 rounded-[28px] border border-[#E5E7EB] bg-white p-5 shadow-[0_10px_28px_rgba(17,24,39,0.05)]">
              <h2 className="text-base font-black text-[#1A1A2E]">유후 현황</h2>
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[#6B7280]">등록된 후기</span>
                  <span className="font-bold text-[#FF6B35]">{reviewStats.totalReviews.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#6B7280]">유학원 수</span>
                  <span className="font-bold text-[#FF6B35]">{reviewStats.totalAgencies.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#6B7280]">활동 회원</span>
                  <span className="font-bold text-[#FF6B35]">{reviewStats.totalMembers.toLocaleString()}</span>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
