import Link from 'next/link';
import Image from 'next/image';
import { Star, MapPin, ChevronRight } from 'lucide-react';
import type { Entity } from '@/types/entity';
import { QeacVerifiedBadge } from '@/components/entity/QeacVerifiedBadge';
import { getAgencyAiSummary } from '@/lib/mock/agencyAiSummary';

interface Props {
  entity: Entity;
  country?: string;
  category?: string;
}

export function EntityCard({ entity, country = 'au', category = 'agency' }: Props) {
  const aiSummary = getAgencyAiSummary(entity.id);

  return (
    <Link href={`/${country}/${category}/${entity.slug}`}>
      <article className="cursor-pointer overflow-hidden rounded-2xl border border-border bg-gradient-to-b from-card to-[#fbfcfd] p-4 shadow-[0_8px_22px_rgba(0,0,0,0.05)] transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(0,0,0,0.08)]">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-center gap-3 pr-1">
            {entity.logo_url ? (
              <div className="h-11 w-11 overflow-hidden rounded-xl border border-border bg-white">
                <Image src={entity.logo_url} alt={`${entity.name} 로고`} width={44} height={44} className="h-11 w-11 object-cover" />
              </div>
            ) : (
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-white text-[11px] font-semibold text-primary">
                {entity.name.slice(0, 2)}
              </div>
            )}
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5">
                <h3 className="line-clamp-1 font-semibold text-foreground">{entity.name}</h3>
                {entity.qeac_verified ? <QeacVerifiedBadge /> : null}
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-caption text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                <span className="line-clamp-1">{entity.coverage_cities.slice(0, 2).join(' · ') || '호주'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-2.5 py-1 text-body2">
            <Star className="h-4 w-4 fill-accent text-accent" />
            <span className="font-semibold text-foreground">{entity.avg_score.toFixed(1)}</span>
            <span className="text-muted-foreground">({entity.review_count})</span>
          </div>
        </div>

        <p className="mb-3 line-clamp-2 text-body2 text-muted-foreground">{entity.description}</p>

        {entity.specialties.length > 0 ? (
          <div className="mb-2 flex flex-wrap gap-1.5">
            {entity.specialties.slice(0, 3).map((tag) => (
              <span key={tag} className="rounded-md bg-muted px-2.5 py-1 text-label text-muted-foreground">
                #{tag}
              </span>
            ))}
          </div>
        ) : null}

        <div className="mb-3 flex flex-wrap gap-1.5">
          {entity.coverage_cities.slice(0, 2).map((city) => (
            <span key={city} className="rounded-md bg-primary/10 px-2.5 py-1 text-label text-primary">
              {city}
            </span>
          ))}
        </div>

        {aiSummary ? (
          <div className="mb-1 rounded-xl border border-border/70 bg-background px-3 py-2">
            <p className="mb-1 text-[11px] font-semibold text-accent">AI 한줄 요약</p>
            <p className="line-clamp-2 text-body2 text-muted-foreground">{aiSummary}</p>
          </div>
        ) : null}

        <div className="mt-3 inline-flex items-center gap-1 text-caption font-semibold text-accent">
          자세히 보기
          <ChevronRight className="h-3.5 w-3.5" />
        </div>
      </article>
    </Link>
  );
}
