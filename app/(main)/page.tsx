import { ArrowRight, PenSquare, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { entities, reviews } from '@/lib/mock-db';
import { ReviewCard } from '@/components/review/ReviewCard';
import Image from 'next/image';

export default function HomePage() {
  const topAgencies = [...entities].sort((a, b) => b.avg_score - a.avg_score).slice(0, 3);

  return (
    <div className="min-h-screen bg-background pb-safe">
      <div className="mx-auto max-w-layout">
        <section className="bg-primary px-4 py-8 text-primary-foreground md:px-6 md:py-12 lg:py-16">
          <div className="max-w-2xl">
            <h1 className="mb-3 text-display font-bold leading-tight md:mb-4 md:text-[32px] lg:text-[36px]">
              유학원 가기 전에,
              <br />
              여기 먼저 👀
            </h1>
            <p className="mb-6 text-[15px] leading-relaxed opacity-90 md:mb-8 md:text-[16px]">
              광고비 받고 후기 지우는 거 없어요. 진짜 다녀온 사람들 후기만 있어요.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/au/agency" className="inline-block">
                <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3 font-semibold text-accent-foreground transition-opacity hover:opacity-90 sm:w-auto">
                  <span>유학원 보러가기</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
              </Link>
              <Link href="/reviews/write" className="inline-block">
                <button className="w-full rounded-lg border-2 border-primary-foreground bg-primary-foreground px-6 py-3 font-semibold text-primary transition-colors hover:bg-primary-foreground/90 sm:w-auto">
                  내 후기 남기기
                </button>
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4 border-t border-primary-foreground/20 pt-6 md:mt-10 md:gap-6 md:pt-8">
              <div>
                <div className="text-h2 font-bold text-accent md:text-[24px]">2,847</div>
                <div className="mt-1 text-caption opacity-80 md:text-body2">등록된 후기</div>
              </div>
              <div>
                <div className="text-h2 font-bold text-accent md:text-[24px]">156</div>
                <div className="mt-1 text-caption opacity-80 md:text-body2">유학원</div>
              </div>
              <div>
                <div className="text-h2 font-bold text-accent md:text-[24px]">98%</div>
                <div className="mt-1 text-caption opacity-80 md:text-body2">신뢰도</div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-6 md:px-6 md:py-8">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-accent" />
              <h2 className="font-bold text-foreground">최근 등록된 후기</h2>
            </div>
            <Link href="/reviews" className="text-body2 font-medium text-accent hover:underline">
              전체보기
            </Link>
          </div>

          <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 scroll-smooth scrollbar-hide lg:hidden">
            {reviews.slice(0, 3).map((review) => {
              const entity = entities.find((item) => item.id === review.entity_id);
              if (!entity) return null;

              return (
                <Link
                  key={review.id}
                  href={`/reviews/${review.id}`}
                  className="w-[calc(100vw-2rem)] min-w-[calc(100vw-2rem)] shrink-0 snap-start"
                >
                  <ReviewCard review={review} compact commentsInteractive={false} className="h-full cursor-pointer" />
                </Link>
              );
            })}
          </div>

          <div className="hidden grid-cols-3 gap-5 lg:grid">
            {reviews.slice(0, 3).map((review) => {
              const entity = entities.find((item) => item.id === review.entity_id);
              if (!entity) return null;

              return (
                <Link key={review.id} href={`/reviews/${review.id}`} className="block">
                  <ReviewCard review={review} commentsInteractive={false} className="cursor-pointer" />
                </Link>
              );
            })}
          </div>
        </section>

        <section className="px-4 py-6 md:px-6 md:py-8">
          <div className="rounded-xl bg-accent p-6 text-accent-foreground md:p-8">
            <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-2">
                  <PenSquare className="h-5 w-5" />
                  <h2 className="font-bold">유학원 후기 남기기</h2>
                </div>
                <p className="text-body2 opacity-90">
                  여러분의 솔직한 후기가 다른 유학생들에게 큰 도움이 돼요.
                  <br className="hidden md:block" />
                  5분만 투자해서 소중한 경험 공유해줘요.
                </p>
              </div>
              <Link href="/reviews/write">
                <button className="w-full whitespace-nowrap rounded-lg bg-accent-foreground px-6 py-3 font-semibold text-accent transition-opacity hover:opacity-90 md:w-auto">
                  지금 작성하기
                </button>
              </Link>
            </div>
          </div>
        </section>

        <section className="px-4 py-6 md:px-6 md:py-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold text-foreground">평점 높은 유학원</h2>
            <span className="text-body2 text-muted-foreground">이런 정보들이 있어요</span>
          </div>

          <div className="space-y-3 md:grid md:grid-cols-3 md:gap-4 md:space-y-0">
            {topAgencies.map((agency) => (
              <Link key={agency.id} href={`/au/agency/${agency.slug}`} className="block">
                <article className="rounded-2xl border border-border bg-gradient-to-b from-card to-[#fafbfc] p-4 shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(0,0,0,0.08)]">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {agency.logo_url ? (
                        <div className="h-11 w-11 overflow-hidden rounded-xl border border-border bg-white">
                          <Image src={agency.logo_url} alt={`${agency.name} 로고`} width={44} height={44} className="h-11 w-11 object-cover" />
                        </div>
                      ) : (
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-white text-[11px] font-semibold text-primary">
                          {agency.name.slice(0, 2)}
                        </div>
                      )}
                      <h3 className="line-clamp-1 font-semibold text-foreground">{agency.name}</h3>
                    </div>
                    {agency.is_verified ? <span className="text-sm">🏅</span> : null}
                  </div>

                  <p className="mb-2 text-body2 text-muted-foreground">
                    ⭐ {agency.avg_score.toFixed(1)} · 후기 {agency.review_count}개
                  </p>

                  <div className="mb-2 flex flex-wrap gap-1.5">
                    {agency.specialties.slice(0, 3).map((tag) => (
                      <span key={tag} className="rounded-md bg-muted px-2 py-1 text-caption text-muted-foreground">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="mb-3 flex flex-wrap gap-1.5">
                    {agency.coverage_cities.slice(0, 2).map((city) => (
                      <span key={city} className="rounded-md bg-accent/10 px-2 py-1 text-caption text-accent">
                        {city}
                      </span>
                    ))}
                  </div>

                  <p className="line-clamp-2 text-body2 text-muted-foreground">{agency.description}</p>
                </article>
              </Link>
            ))}
          </div>

          <div className="mt-5">
            <Link href="/au/agency" className="inline-flex items-center gap-1 text-body2 font-semibold text-accent hover:underline">
              더 많은 유학원 보기
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <section className="bg-[#f3f4f6] px-4 py-6 md:px-6 md:py-8">
          <h2 className="mb-4 font-bold text-foreground">우리는 이렇게 운영해요</h2>
          <p className="mb-4 text-body2 text-muted-foreground">
            유후는 후기 신뢰도랑 작성자 안전 둘 다 챙기면서 운영해요.
          </p>
          <div className="space-y-3 md:grid md:grid-cols-3 md:gap-4 md:space-y-0">
            <article className="rounded-xl border border-border bg-card p-4">
              <h3 className="mb-2 font-semibold text-foreground">📝 광고 없음</h3>
              <p className="text-body2 text-muted-foreground">유학원이 돈 내도 후기 안 지워요</p>
              <p className="mt-2 text-caption text-muted-foreground">광고/협찬 후기는 정책 위반으로 노출 제외돼요.</p>
            </article>
            <article className="rounded-xl border border-border bg-card p-4">
              <h3 className="mb-2 font-semibold text-foreground">✅ 실사용자 인증</h3>
              <p className="text-body2 text-muted-foreground">소셜 로그인 + 선택적 서류 인증</p>
              <p className="mt-2 text-caption text-muted-foreground">인증된 후기는 배지 표기와 함께 우선 노출될 수 있어요.</p>
            </article>
            <article className="rounded-xl border border-border bg-card p-4">
              <h3 className="mb-2 font-semibold text-foreground">🔒 익명 보장</h3>
              <p className="text-body2 text-muted-foreground">닉네임은 자동 생성, 개인정보 안전</p>
              <p className="mt-2 text-caption text-muted-foreground">실명/연락처/민감정보는 저장하거나 공개 안 해요.</p>
            </article>
          </div>
        </section>
      </div>
    </div>
  );
}
