import Link from 'next/link';
import { ChevronRight, MapPin, Star, BookOpen, GraduationCap } from 'lucide-react';
import type { School } from '@/types/school';

const typeLabelMap: Record<string, string> = {
  university:  '대학교',
  tafe:        'TAFE',
  language:    '어학원',
  college:     '전문대',
  rto:         'RTO',
  foundation:  '파운데이션',
};

// 타입마다 고정된 색상 — 카드 어느 위치에서도 동일
const typeToneMap: Record<string, { bg: string; text: string; dot: string }> = {
  university: { bg: 'bg-blue-50',    text: 'text-blue-700',    dot: 'bg-blue-400' },
  tafe:       { bg: 'bg-violet-50',  text: 'text-violet-700',  dot: 'bg-violet-400' },
  language:   { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-400' },
  college:    { bg: 'bg-amber-50',   text: 'text-amber-700',   dot: 'bg-amber-400' },
  rto:        { bg: 'bg-orange-50',  text: 'text-orange-700',  dot: 'bg-orange-400' },
  foundation: { bg: 'bg-pink-50',    text: 'text-pink-700',    dot: 'bg-pink-400' },
};

interface Props {
  school: School;
  reviewCount: number;
  avgScore: number;
  topAgencyCount: number;
}

export function SchoolCard({ school, reviewCount, avgScore, topAgencyCount }: Props) {
  const tone = typeToneMap[school.type] ?? typeToneMap.university;

  return (
    <Link href={`/schools/${school.id}`}>
      <article className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-[0_4px_16px_rgba(0,0,0,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-[0_12px_28px_rgba(0,0,0,0.09)]">

        {/* ── 상단: 타입 배지 + 도시 (항상 고정 위치) ── */}
        <div className="flex items-center justify-between px-4 pt-4 pb-3">
          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${tone.bg} ${tone.text}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${tone.dot}`} />
            {typeLabelMap[school.type]}
          </span>
          <span className="flex items-center gap-1 text-[12px] text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            {school.city}
          </span>
        </div>

        {/* ── 학교 로고 + 이름 ── */}
        <div className="flex items-start gap-3 px-4 pb-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-[#fafafa] text-[11px] font-bold text-primary">
            {school.logoText ?? school.name.slice(0, 2)}
          </div>
          <div className="min-w-0 flex-1 pt-0.5">
            <h3 className="line-clamp-2 text-[15px] font-bold leading-[1.35] text-foreground">
              {school.name}
            </h3>
            {school.cricosCode ? (
              <p className="mt-0.5 text-[11px] text-muted-foreground">CRICOS {school.cricosCode}</p>
            ) : null}
          </div>
        </div>

        {/* ── 분야 해시태그 (고정 위치) ── */}
        {school.fields.length > 0 ? (
          <div className="flex flex-wrap gap-1.5 px-4 pb-3">
            {school.fields.slice(0, 5).map((field) => (
              <span key={field} className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                #{field}
              </span>
            ))}
          </div>
        ) : null}

        {/* ── 입학 시기 + 학비 ── */}
        <div className="flex-1 space-y-1.5 px-4 pb-4">
          {school.intakePeriods.length > 0 ? (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] text-muted-foreground">입학:</span>
              {school.intakePeriods.map((period) => (
                <span key={period} className="rounded-full bg-accent/10 px-2 py-0.5 text-[11px] font-medium text-accent">
                  {period}
                </span>
              ))}
            </div>
          ) : null}
          {school.tuitionRange ? (
            <p className="text-[12px] text-muted-foreground">학비 {school.tuitionRange}</p>
          ) : null}
        </div>

        {/* ── 푸터: 통계 + CTA ── */}
        <div className="flex items-center justify-between border-t border-border/60 px-4 py-3">
          <div className="flex items-center gap-3">
            {reviewCount > 0 ? (
              <span className="flex items-center gap-1 text-[12px] text-muted-foreground">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span className="font-semibold text-foreground">{avgScore.toFixed(1)}</span>
                <span className="text-muted-foreground/70">({reviewCount})</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <BookOpen className="h-3.5 w-3.5" />
                후기 없음
              </span>
            )}
            {topAgencyCount > 0 ? (
              <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <GraduationCap className="h-3.5 w-3.5 text-accent" />
                유학원 {topAgencyCount}곳
              </span>
            ) : null}
          </div>
          <span className="flex items-center gap-0.5 text-[12px] font-semibold text-accent transition-colors group-hover:text-accent/80">
            자세히
            <ChevronRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </article>
    </Link>
  );
}
