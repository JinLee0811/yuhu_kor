import Link from 'next/link';
import { ChevronRight, MapPin, CalendarDays, GraduationCap } from 'lucide-react';
import type { School } from '@/types/school';

const typeLabelMap = {
  university: '대학교',
  tafe: 'TAFE',
  language: '어학원',
  college: '전문대'
} as const;

const typeToneMap = {
  university: 'bg-blue-50 text-blue-700',
  tafe: 'bg-violet-50 text-violet-700',
  language: 'bg-emerald-50 text-emerald-700',
  college: 'bg-amber-50 text-amber-700'
} as const;

interface Props {
  school: School;
  topAgencyCount: number;
}

export function SchoolCard({ school, topAgencyCount }: Props) {
  return (
    <Link href={`/schools/${school.id}`}>
      <article className="cursor-pointer overflow-hidden rounded-2xl border border-border bg-gradient-to-b from-card to-[#fbfcfd] p-4 shadow-[0_8px_22px_rgba(0,0,0,0.05)] transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(0,0,0,0.08)]">
        <div className="mb-3 flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-white text-[11px] font-semibold text-primary">
            {school.logoText ?? school.name.slice(0, 2)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <h3 className="line-clamp-1 font-bold text-foreground">{school.name}</h3>
              <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${typeToneMap[school.type]}`}>
                {typeLabelMap[school.type]}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-caption text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              <span>{school.city}</span>
            </div>
          </div>
        </div>

        <div className="mb-3 flex flex-wrap gap-1.5">
          {school.fields.map((field) => (
            <span key={field} className="rounded-md bg-muted px-2.5 py-1 text-label text-muted-foreground">
              #{field}
            </span>
          ))}
        </div>

        <div className="space-y-2 text-body2 text-muted-foreground">
          {school.cricosCode ? <p>CRICOS {school.cricosCode}</p> : null}
          <p>{school.tuitionRange}</p>
          <div className="flex flex-wrap items-center gap-1.5">
            <CalendarDays className="h-4 w-4" />
            {school.intakePeriods.map((period) => (
              <span key={period} className="rounded-full bg-accent/10 px-2.5 py-1 text-[11px] font-medium text-accent">
                {period}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-border/70 pt-3">
          <div className="inline-flex items-center gap-1.5 text-caption text-muted-foreground">
            <GraduationCap className="h-4 w-4 text-accent" />
            <span>이 학교로 많이 보내는 유학원 {topAgencyCount}곳</span>
          </div>
          <span className="inline-flex items-center gap-1 text-caption font-semibold text-accent">
            자세히 보기
            <ChevronRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </article>
    </Link>
  );
}
