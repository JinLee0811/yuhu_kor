'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BookOpenText, ChevronLeft, MessageSquareText } from 'lucide-react';
import type { School } from '@/types/school';
import { SchoolDetailSidebar } from '@/components/school/SchoolDetailSidebar';

interface Props {
  school: School;
  topAgencies: Array<{ agencyId: string; agencyName: string; agencySlug: string; count: number }>;
}

export function SchoolDetailView({ school, topAgencies }: Props) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background pb-safe">
      {/* 모바일 뒤로가기 바 — 헤더(h-14) 바로 아래에 고정 */}
      <div className="sticky top-14 z-30 flex items-center justify-between border-b border-border bg-card px-4 py-3 md:hidden">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-1 text-foreground"
        >
          <ChevronLeft className="h-5 w-5" />
          <span className="font-medium">뒤로</span>
        </button>
      </div>

      {/* 콘텐츠 — 모바일에서 뒤로가기 바 높이(~46px)만큼 여백 확보 */}
      <div className="mx-auto max-w-layout pt-3 md:pt-0 lg:grid lg:grid-cols-[40%_60%] lg:gap-8 lg:pt-4">
        <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <SchoolDetailSidebar school={school} topAgencies={topAgencies} />
        </div>

        <div className="px-4 py-6 md:px-6 lg:px-0 lg:py-0">
          <button
            type="button"
            onClick={() => router.back()}
            className="mb-4 hidden items-center gap-1 text-body2 text-muted-foreground hover:text-foreground md:inline-flex"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>목록으로</span>
          </button>

          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm md:p-6">
            <div className="mb-5">
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-caption font-semibold text-accent">
                <BookOpenText className="h-4 w-4" />
                학교 소개
              </div>
              <p className="text-body2 leading-relaxed text-muted-foreground">{school.description}</p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="rounded-xl bg-muted/35 p-4">
                <h2 className="mb-3 font-semibold text-foreground">제공 과정/학과</h2>
                <div className="space-y-2 text-body2 text-muted-foreground">
                  {(school.programs ?? []).map((program) => (
                    <p key={program}>{program}</p>
                  ))}
                </div>
              </div>

              <div className="rounded-xl bg-muted/35 p-4">
                <h2 className="mb-3 font-semibold text-foreground">학교 특징</h2>
                <div className="flex flex-wrap gap-1.5">
                  {(school.featureTags ?? []).map((tag) => (
                    <span key={tag} className="rounded-full bg-background px-3 py-1 text-[11px] font-medium text-muted-foreground">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <Link
            href={`/board?school=${school.id}`}
            className="mt-4 flex items-center justify-between rounded-2xl border border-border bg-accent px-5 py-4 text-accent-foreground shadow-sm transition-opacity hover:opacity-95"
          >
            <div>
              <p className="font-semibold">이 학교 다녀오셨나요? 게시판에서 후기를 나눠봐요</p>
              <p className="mt-1 text-caption opacity-90">학교생활 얘기, 수업 후기, 적응 팁까지 편하게 남겨봐요.</p>
            </div>
            <MessageSquareText className="h-5 w-5 shrink-0" />
          </Link>
        </div>
      </div>
    </div>
  );
}
