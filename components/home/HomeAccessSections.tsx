'use client';

import Link from 'next/link';
import type { Route } from 'next';
import type { Entity } from '@/types/entity';
import type { Review } from '@/types/review';
import { EntityCard } from '@/components/entity/EntityCard';
import { ReviewCard } from '@/components/review/ReviewCard';
import { useAuthStore } from '@/lib/store/auth';

interface Props {
  recentReviews: Review[];
  topAgencies: Entity[];
}

export function HomeAccessSections({ recentReviews, topAgencies }: Props) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const canViewContent = isLoggedIn || process.env.NODE_ENV !== 'production';

  return (
    <>
      <section className="px-5 py-6 lg:py-8">
        <div className="mx-auto max-w-screen-lg rounded-[28px] border border-[#E5E7EB] bg-white px-5 py-6 shadow-[0_18px_40px_rgba(17,24,39,0.05)] sm:px-7 lg:px-8">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-[1.5rem] font-black tracking-[-0.03em] text-[#1A1A2E]">최근 등록된 후기</h2>
              <p className="mt-1 text-sm text-[#6B7280]">실제 상담과 이용 경험이 빠르게 업데이트돼요.</p>
            </div>
          <Link href={canViewContent ? '/reviews' : ('/signup?next=%2Freviews' as Route)} className="text-sm font-semibold text-[#FF6B35] hover:underline">
              전체보기
            </Link>
          </div>

          <div className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 scroll-smooth scrollbar-hide lg:hidden">
            {recentReviews.map((review) => (
              <div key={review.id} className="relative w-[calc(100vw-3.25rem)] min-w-[calc(100vw-3.25rem)] shrink-0 snap-start">
                <Link href={canViewContent ? (`/reviews/${review.id}` as Route) : (`/signup?next=${encodeURIComponent(`/reviews/${review.id}`)}` as Route)}>
                  <div className={!canViewContent ? 'pointer-events-none blur-[8px]' : ''}>
                    <ReviewCard review={review} compact commentsInteractive={false} className="h-full cursor-pointer rounded-2xl border-[#E5E7EB] shadow-[0_12px_28px_rgba(17,24,39,0.06)]" />
                  </div>
                </Link>
                {!canViewContent ? (
                  <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white/35 px-6 text-center">
                    <div className="rounded-2xl bg-white/95 px-4 py-3 shadow-lg">
                      <p className="font-semibold text-[#1A1A2E]">로그인 후 후기 확인</p>
                      <p className="mt-1 text-[12px] text-[#6B7280]">가입하면 최근 등록된 후기를 바로 볼 수 있어요.</p>
                    </div>
                  </div>
                ) : null}
              </div>
            ))}
          </div>

          <div className="hidden grid-cols-3 gap-5 lg:grid">
            {recentReviews.map((review) => (
              <div key={review.id} className="relative">
                <Link href={canViewContent ? (`/reviews/${review.id}` as Route) : (`/signup?next=${encodeURIComponent(`/reviews/${review.id}`)}` as Route)} className="block">
                  <div className={!canViewContent ? 'pointer-events-none blur-[8px]' : ''}>
                    <ReviewCard
                      review={review}
                      commentsInteractive={false}
                      className="cursor-pointer rounded-2xl border-[#E5E7EB] shadow-[0_12px_28px_rgba(17,24,39,0.06)]"
                    />
                  </div>
                </Link>
                {!canViewContent ? (
                  <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white/35 px-6 text-center">
                    <div className="rounded-2xl bg-white/95 px-4 py-3 shadow-lg">
                      <p className="font-semibold text-[#1A1A2E]">로그인 후 후기 확인</p>
                      <p className="mt-1 text-[12px] text-[#6B7280]">회원만 실제 후기를 볼 수 있어요.</p>
                    </div>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-6 lg:py-8">
        <div className="mx-auto max-w-screen-lg rounded-[28px] border border-[#E5E7EB] bg-white px-5 py-6 shadow-[0_18px_40px_rgba(17,24,39,0.05)] sm:px-7 lg:px-8">
          <div className="mb-5 flex items-end justify-between gap-3">
            <div>
              <h2 className="text-[1.5rem] font-black tracking-[-0.03em] text-[#1A1A2E]">평점 높은 유학원</h2>
              <p className="mt-1 text-sm text-[#6B7280]">후기 점수와 실제 평가를 같이 보면서 비교해보세요.</p>
            </div>
            <Link href="/au/agency" className="text-sm font-semibold text-[#FF6B35] hover:underline">
              더 많은 유학원 보기
            </Link>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {topAgencies.map((agency) => (
              <EntityCard key={agency.id} entity={agency} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
