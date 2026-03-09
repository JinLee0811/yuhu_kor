import Link from 'next/link';
import { Globe, GraduationCap, MapPin, BookOpen, CalendarDays } from 'lucide-react';
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
  topAgencies: Array<{ agencyId: string; agencyName: string; agencySlug: string; count: number }>;
}

export function SchoolDetailSidebar({ school, topAgencies }: Props) {
  return (
    <div className="space-y-4">
      <section className="border-b border-border bg-card p-4 md:p-6 lg:rounded-xl lg:border">
        <div className="mb-4">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <h1 className="font-bold text-foreground">{school.name}</h1>
            <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${typeToneMap[school.type]}`}>
              {typeLabelMap[school.type]}
            </span>
          </div>
          <div className="flex items-start gap-2 text-body2 text-muted-foreground">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              {school.city} · {school.address}
            </span>
          </div>
        </div>

        <div className="space-y-2 border-t border-border pt-4 text-body2 text-muted-foreground">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <a href={school.website} target="_blank" rel="noreferrer" className="line-clamp-1 hover:text-foreground hover:underline">
              {school.website}
            </a>
          </div>
          {school.cricosCode ? (
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span>CRICOS {school.cricosCode}</span>
            </div>
          ) : null}
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            <span>{school.tuitionRange}</span>
          </div>
          <div className="flex items-start gap-2">
            <CalendarDays className="mt-0.5 h-4 w-4" />
            <div className="flex flex-wrap gap-1.5">
              {school.intakePeriods.map((period) => (
                <span key={period} className="rounded-full bg-accent/10 px-2.5 py-1 text-[11px] font-medium text-accent">
                  {period}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 border-t border-border pt-4">
          <h3 className="mb-2 font-semibold text-foreground">분야</h3>
          <div className="flex flex-wrap gap-1.5">
            {school.fields.map((field) => (
              <span key={field} className="rounded-md bg-muted px-2.5 py-1 text-label text-muted-foreground">
                #{field}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-card p-4 md:p-6 lg:rounded-xl lg:border">
        <div className="mb-3">
          <h3 className="font-semibold text-foreground">이 학교로 많이 보낸 유학원</h3>
          <p className="mt-1 text-caption text-muted-foreground">후기를 남긴 유저 데이터 기준이에요</p>
        </div>

        {topAgencies.length > 0 ? (
          <div className="space-y-2">
            {topAgencies.map((agency, index) => (
              <Link
                key={agency.agencyId}
                href={`/au/agency/${agency.agencySlug}`}
                className="flex items-center justify-between rounded-xl border border-border/70 bg-background px-3 py-3 transition-colors hover:bg-muted/40"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="w-7 text-sm font-semibold text-accent">{index + 1}위</span>
                  <span className="truncate font-medium text-foreground">{agency.agencyName}</span>
                </div>
                <div className="flex items-center gap-3 text-body2 text-muted-foreground">
                  <span>{agency.count}명</span>
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
  );
}
