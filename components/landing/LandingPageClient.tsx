'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Noto_Sans_KR } from 'next/font/google';
import {
  ArrowRight,
  BadgeCheck,
  ChevronRight,
  Eye,
  Lock,
  ShieldOff
} from 'lucide-react';
import type { Route } from 'next';
import type { Review } from '@/types/review';

const notoSansKr = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '700', '900']
});

function RevealSection({
  children,
  className = ''
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.16
      }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: 'opacity 0.5s ease, transform 0.5s ease'
      }}
    >
      {children}
    </section>
  );
}

function LandingLogo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-sm font-black text-white shadow-[0_10px_25px_rgba(255,107,53,0.25)]">
        유후
      </div>
      <div>
        <p className="text-sm font-black text-[#1A1A2E]">유후</p>
        <p className="text-[11px] text-[#6B7280]">유학후기</p>
      </div>
    </Link>
  );
}

function NavLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href as Route} className="text-sm font-medium text-[#4B5563] transition-colors hover:text-[#1A1A2E]">
      {children}
    </Link>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function LandingPageClient({ reviews, embedded = false }: { reviews: Review[]; embedded?: boolean }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navClass = scrolled
    ? 'border-b border-gray-100 bg-white/80 backdrop-blur-md'
    : 'border-b border-transparent bg-transparent';

  const flowCards = [
    {
      step: '1',
      title: '유학원, 어디가 좋을까요?',
      description: '수백 개 유학원 중 어디를 골라야 할지 실제 다녀온 사람들 후기로 확인해요.',
      tags: ['#유학원검색', '#후기비교']
    },
    {
      step: '2',
      title: '유학원 결정했어요',
      description: '후기 보고 결정했다면 이제 당신의 차례예요. 상담 경험을 남겨서 다음 사람을 도와주세요.',
      tags: ['#후기작성', '#인증마크']
    },
    {
      step: '3',
      title: '호주 도착했어요',
      description: '학교 이메일로 인증하면 정착, 수업, 생활 정보까지 담긴 선배들의 꿀팁을 볼 수 있어요.',
      tags: ['#학교인증', '#게시판입장']
    },
    {
      step: '4',
      title: '이제 나도 선배예요',
      description: '집 구하는 법, 수업 따라가는 법, 현지 친구 사귀는 법까지 후배들에게 알려주세요.',
      tags: ['#꿀팁공유', '#커뮤니티']
    }
  ];

  const valueCards = [
    {
      icon: ShieldOff,
      title: '광고비 받고 후기 안 지워요',
      description: '유학원에서 돈을 받고 나쁜 후기를 삭제하는 거, 저희는 절대 하지 않아요.'
    },
    {
      icon: BadgeCheck,
      title: '실제 경험자만 후기 써요',
      description: '상담 캡처, 학교 이메일, COE로 인증한 사람들의 후기만 등록돼요.'
    },
    {
      icon: Eye,
      title: '좋은 유학원도 제대로 알려요',
      description: '나쁜 후기만 모으는 게 아니에요. 진짜 좋은 유학원은 더 빛날 수 있어요.'
    }
  ];

  const promises = [
    {
      emoji: '🔒',
      title: '완전 익명',
      description: '닉네임으로만 활동해요. 실명은 절대 공개되지 않아요.'
    },
    {
      emoji: '📵',
      title: '광고 없음',
      description: '유학원 광고비를 받지 않아요. 후기는 절대 삭제되지 않아요.'
    },
    {
      emoji: '✅',
      title: '인증된 후기',
      description: '실제 경험자만 후기를 남길 수 있어요. 가짜 후기는 없어요.'
    },
    {
      emoji: '🇦🇺',
      title: '한인 전용',
      description: '호주 유학을 준비하거나 경험한 한인들만을 위한 공간이에요.'
    }
  ];

  return (
    <div
      className={`${notoSansKr.className} ${embedded ? '' : 'min-h-screen'} bg-[#FAFAF8] text-[#1A1A2E]`}
      style={{ wordBreak: 'keep-all', lineHeight: 1.6 }}
    >
      {!embedded ? (
        <header className={`sticky top-0 z-50 transition-all duration-300 ${navClass}`}>
          <div className="mx-auto flex max-w-screen-lg items-center justify-between px-5 py-4">
            <LandingLogo />

            <nav className="hidden items-center gap-7 lg:flex">
              <NavLink href="/au/agency">유학원</NavLink>
              <NavLink href="/schools">학교</NavLink>
              <NavLink href="/board">게시판</NavLink>
            </nav>

            <div className="hidden items-center gap-3 lg:flex">
              <Link
                href="/login"
                className="rounded-xl border border-[#E5E7EB] px-4 py-2 text-sm font-semibold text-[#1A1A2E] transition hover:bg-white"
              >
                로그인
              </Link>
              <Link
                href="/signup"
                className="rounded-xl bg-[#FF6B35] px-4 py-2 text-sm font-bold text-white shadow-[0_10px_25px_rgba(255,107,53,0.18)] transition hover:brightness-110"
              >
                가입하기
              </Link>
            </div>

            <div className="lg:hidden">
              <Link
                href="/signup"
                className="rounded-xl bg-[#FF6B35] px-4 py-2 text-sm font-bold text-white shadow-[0_10px_25px_rgba(255,107,53,0.18)] transition hover:brightness-110"
              >
                가입하기
              </Link>
            </div>
          </div>
        </header>
      ) : null}

      <main>
        <section className="relative overflow-hidden bg-[#1A1A2E] text-white">
          <div className="pointer-events-none absolute right-[-80px] top-[-60px] h-[400px] w-[400px] rounded-full bg-[#FF6B35] opacity-15 blur-[80px]" />
          <div className="mx-auto max-w-screen-lg px-5 py-20 lg:py-28">
            <div className="max-w-3xl">
              <div className="inline-flex items-center rounded-full border border-[#FF6B35]/50 bg-[#FF6B35]/10 px-4 py-2 text-sm font-semibold text-[#FFB49A]">
                🇦🇺 호주 유학원 후기 플랫폼
              </div>
              <h1 className="mt-6 text-[2.5rem] font-black leading-[1.08] tracking-[-0.04em] text-white lg:text-[4rem]">
                유학원 가기 전에
                <br />
                여기 먼저 확인하세요
              </h1>
              <p className="mt-4 max-w-xl text-base text-gray-400">
                유학원 잘 고르는 방법부터
                <br />
                호주생활 꿀팁까지, 실제 경험이 쌓여 있어요.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/reviews"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF6B35] px-6 py-3 font-semibold text-white transition hover:brightness-110"
                >
                  후기 둘러보기
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/reviews/write"
                  className="inline-flex items-center justify-center rounded-xl border border-white/30 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
                >
                  내 후기 남기기
                </Link>
              </div>

              <div className="mt-16 grid grid-cols-3 gap-4 border-t border-white/10 pt-8 lg:max-w-xl lg:gap-8">
                {[
                  ['2,847', '등록된 후기'],
                  ['156', '유학원 수'],
                  ['98%', '신뢰 후기']
                ].map(([value, label]) => (
                  <div key={label}>
                    <p className="text-3xl font-black text-[#FF6B35]">{value}</p>
                    <p className="mt-1 text-sm text-gray-400">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <RevealSection className="bg-[#FAFAF8]">
          <div className="mx-auto grid max-w-screen-lg gap-10 px-5 py-20 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold text-[#FF6B35]">유후를 만든 이유</p>
              <h2 className="mt-3 text-[1.75rem] font-black leading-[1.25] tracking-[-0.03em] text-[#1A1A2E]">
                유학원 다녀봤어요.
                <br />
                근데 아무도 솔직하게
                <br />
                얘기 안 해줬어요.
              </h2>
              <p className="mt-4 text-[15px] text-[#6B7280]">
                호주에 유학원이 넘쳐나지만 어떤지 알 수 있는 곳은 없었어요.
                <br />
                영주권 된다, 취업 잘 된다는 말에 이끌려 결정했다가 후회하는 분들을 너무 많이 봤어요.
                <br />
                그래서 만들었어요.
              </p>
            </div>

            <div className="rounded-2xl bg-[#FF6B35] p-6 text-white shadow-[0_20px_45px_rgba(255,107,53,0.2)]">
              <p className="font-serif text-6xl leading-none opacity-20">&quot;</p>
              <p className="mt-3 text-lg font-bold leading-relaxed">
                저도 유학원 출신이에요.
                <br />
                내부에서 본 것들을
                <br />
                솔직하게 얘기하고 싶었어요.
              </p>
              <p className="mt-6 text-sm text-white/80">— 유후 만든 사람</p>
            </div>
          </div>
        </RevealSection>

        <RevealSection className="bg-white">
          <div className="mx-auto max-w-screen-lg px-5 py-20">
            <div className="text-center">
              <p className="text-sm font-semibold text-[#FF6B35]">유학원 선택부터 호주생활까지</p>
              <h2 className="mt-3 text-[1.75rem] font-black tracking-[-0.03em] text-[#1A1A2E]">유후가 함께해요</h2>
            </div>

            <div className="mt-12 space-y-8 lg:hidden">
              {flowCards.map((item, index) => (
                <div key={item.step} className="relative pl-10">
                  {index < flowCards.length - 1 ? (
                    <div className="absolute left-[15px] top-9 h-[calc(100%+18px)] w-px bg-[#FF6B35]/30" />
                  ) : null}
                  <div className="absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full bg-[#FF6B35] text-sm font-black text-white">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-bold text-[#1A1A2E]">{item.title}</h3>
                  <p className="mt-2 text-[15px] text-[#6B7280]">{item.description}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-[#FFF0EB] px-2.5 py-1 text-xs font-semibold text-[#FF6B35]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mx-auto mt-12 hidden max-w-[1160px] items-stretch gap-3 lg:flex">
              {flowCards.map((item, index) => (
                <div key={item.step} className="flex min-w-0 flex-1 items-stretch gap-3">
                  <div className="flex-1 rounded-2xl border border-gray-100 p-6 transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFF0EB] text-base font-black text-[#FF6B35]">
                      {item.step}
                    </div>
                    <h3 className="mt-4 text-lg font-bold text-[#1A1A2E]">{item.title}</h3>
                    <p className="mt-2 text-sm text-[#6B7280]">{item.description}</p>
                    <div className="mt-4 flex flex-nowrap gap-2">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="whitespace-nowrap rounded-full bg-[#FFF0EB] px-2.5 py-1 text-[11px] font-semibold text-[#FF6B35]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  {index < flowCards.length - 1 ? (
                    <div className="flex shrink-0 items-center justify-center px-1 text-2xl font-black text-[#FF6B35]">→</div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </RevealSection>

        <RevealSection className="bg-[#FAFAF8]">
          <div className="mx-auto max-w-screen-lg px-5 py-20">
            <div className="text-center">
              <h2 className="text-[1.75rem] font-black tracking-[-0.03em] text-[#1A1A2E]">유후가 다른 이유</h2>
            </div>

            <div className="mt-12 grid gap-5 lg:grid-cols-3">
              {valueCards.map((item) => {
                const Icon = item.icon;
                return (
                  <article
                    key={item.title}
                    className="rounded-2xl border-t-4 border-[#FF6B35] bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <Icon className="h-7 w-7 text-[#FF6B35]" />
                    <h3 className="mt-4 text-lg font-bold text-[#1A1A2E]">{item.title}</h3>
                    <p className="mt-3 text-[15px] text-[#6B7280]">{item.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </RevealSection>

        <RevealSection className="bg-white">
          <div className="mx-auto max-w-screen-lg px-5 py-20">
            <div className="text-center">
              <h2 className="text-[1.75rem] font-black tracking-[-0.03em] text-[#1A1A2E]">실제 후기 이렇게 생겼어요</h2>
              <p className="mt-3 text-[15px] text-[#6B7280]">유후에는 이런 식으로 솔직한 경험이 쌓여요</p>
            </div>

            <div className="mx-auto mt-12 max-w-4xl">
              <div className="relative overflow-hidden rounded-[28px] border border-[#E5E7EB] bg-white p-5 shadow-[0_20px_45px_rgba(17,24,39,0.06)] sm:p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex rounded-full bg-[#FFF0EB] px-2.5 py-1 text-[11px] font-semibold leading-none text-[#FF6B35]">
                        #등록하고 학교까지 갔어요
                      </span>
                      <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold leading-none text-emerald-700">
                        #인증 완료
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 text-[12px] text-[#6B7280]">
                      <span className="font-semibold text-[#111827]">시드니유학생_2026</span>
                      <span>·</span>
                      <span>2026년</span>
                      <span>·</span>
                      <span>대학진학</span>
                      <span>·</span>
                      <span>작성일 2026.03.09</span>
                    </div>

                    <p className="text-[13px] font-medium text-[#6B7280]">유후 유학원</p>
                  </div>

                  <aside className="w-full md:w-[136px] md:flex-shrink-0">
                    <section className="rounded-xl border border-[#E5E7EB] bg-[#FAFAF8] p-3">
                      <p className="text-[10px] font-medium text-[#6B7280]">평점</p>
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="text-[#FF6B35]">★</span>
                        <span className="text-xl font-black text-[#111827]">4.8</span>
                      </div>
                    </section>
                  </aside>
                </div>

                <div className="my-5 h-px bg-[#EEF0F3]" />

                <div className="space-y-4">
                  <section className="rounded-2xl border border-green-100 bg-green-50/60 p-4">
                    <h3 className="mb-2 text-sm font-semibold text-green-700">장점</h3>
                    <p className="text-[14px] leading-[1.75] text-[#1F2937]">
                      처음 상담부터 학교 추천 기준이 꽤 현실적이었어요. 지금 성적으로 가능한 학교, 장학금 가능성,
                      비자 일정까지 한 번에 설명해줘서 부모님이랑 같이 결정할 때도 도움이 됐어요.
                    </p>
                  </section>

                  <section className="rounded-2xl border border-red-100 bg-red-50/50 p-4">
                    <h3 className="mb-2 text-sm font-semibold text-red-600">단점</h3>
                    <p className="text-[14px] leading-[1.75] text-[#1F2937]">
                      등록 직전에는 답변 속도가 조금 느려졌어요. 특히 주말에는 연락이 한 템포 늦어서 급하게 확인할 때는
                      답답한 순간이 있었습니다.
                    </p>
                  </section>

                  <section className="rounded-xl border border-[#E5E7EB] bg-[#FAFAF8] p-4">
                    <p className="mb-2 text-xs font-medium tracking-[0.02em] text-[#6B7280]">한줄평</p>
                    <p className="text-[14px] font-semibold leading-relaxed text-[#111827]">
                      “상담은 현실적이고 좋았지만, 등록 직전 대응 속도는 조금 아쉬웠어요.”
                    </p>
                  </section>
                </div>

                <div
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-24"
                  style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0.98))' }}
                />
              </div>

              <div className="mt-10 flex flex-col items-center text-center">
                <div className="rounded-full bg-[#FFF0EB] p-3 text-[#FF6B35] shadow-sm">
                  <Lock className="h-8 w-8" />
                </div>
                <p className="mt-4 text-lg font-bold text-[#1F2937]">가입하면 전체 후기를 볼 수 있어요</p>
                <Link
                  href="/signup"
                  className="mt-5 rounded-xl bg-[#FF6B35] px-6 py-3 font-semibold text-white shadow-[0_14px_30px_rgba(255,107,53,0.22)] transition hover:brightness-110"
                >
                  무료로 가입하기
                </Link>
              </div>
            </div>
          </div>
        </RevealSection>

        <RevealSection className="bg-[#1A1A2E]">
          <div className="mx-auto max-w-screen-lg px-5 py-20">
            <div className="text-center">
              <h2 className="text-[1.75rem] font-black tracking-[-0.03em] text-white">유후의 약속</h2>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {promises.map((item) => (
                <article
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5 text-white"
                >
                  <p className="text-2xl">{item.emoji}</p>
                  <h3 className="mt-3 font-bold">{item.title}</h3>
                  <p className="mt-2 text-sm text-white/72">{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </RevealSection>

        <RevealSection className="bg-[linear-gradient(135deg,#FF6B35_0%,#FF8C5A_100%)]">
          <div className="mx-auto max-w-screen-lg px-5 py-20 text-center">
            <h2 className="text-[2rem] font-black tracking-[-0.04em] text-white">
              유학원 결정 전에
              <br />
              후기 먼저 확인하세요
            </h2>
            <p className="mt-2 text-white/80">지금 바로 무료로 시작할 수 있어요</p>
            <Link
              href="/au/agency"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-lg font-black text-[#FF6B35] shadow-lg transition hover:scale-[1.02]"
            >
              유학원 후기 보러가기
              <ChevronRight className="h-5 w-5" />
            </Link>
          </div>
        </RevealSection>
      </main>

      {!embedded ? (
        <footer className="bg-[#111827]">
          <div className="mx-auto max-w-screen-lg px-5 py-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF6B35] text-sm font-black text-white">
                  유후
                </div>
                <div>
                  <p className="font-bold text-white">유후</p>
                  <p className="text-sm text-gray-400">호주 유학원 후기 플랫폼</p>
                </div>
              </div>

              <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-400">
                <Link href="/au/agency" className="transition hover:text-white">
                  유학원
                </Link>
                <Link href="/schools" className="transition hover:text-white">
                  학교
                </Link>
                <Link href="/board" className="transition hover:text-white">
                  게시판
                </Link>
                <Link href="/" className="transition hover:text-white">
                  개인정보처리방침
                </Link>
              </nav>
            </div>

            <div className="mt-8 border-t border-white/10 pt-5 text-sm text-gray-600">
              © 2025 유후. All rights reserved.
            </div>
          </div>
        </footer>
      ) : null}
    </div>
  );
}
