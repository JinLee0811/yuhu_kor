import { MapPin, Phone, Globe, Clock, Share2, Star } from 'lucide-react';
import type { Entity } from '@/types/entity';
import { QeacVerifiedBadge } from '@/components/entity/QeacVerifiedBadge';

interface ScoreItem {
  label: string;
  score: number;
}

interface Props {
  entity: Entity;
  scoreItems: ScoreItem[];
}

const distribution = [
  { stars: 5, count: 178, percentage: 89 },
  { stars: 4, count: 18, percentage: 9 },
  { stars: 3, count: 3, percentage: 1 },
  { stars: 2, count: 1, percentage: 0.5 },
  { stars: 1, count: 1, percentage: 0.5 }
];

export function EntityDetail({ entity, scoreItems }: Props) {
  return (
    <div className="border-b border-border bg-card p-4 md:p-6 lg:rounded-xl lg:border">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <h1 className="font-bold">{entity.name}</h1>
            {entity.qeac_verified ? <QeacVerifiedBadge /> : null}
          </div>
          <div className="flex items-center gap-2 text-body2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{entity.coverage_cities[0] || '시드니'}</span>
          </div>
        </div>
        <button className="hidden rounded-lg border border-border p-2 transition-colors hover:bg-muted md:block">
          <Share2 className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>

      <div className="mb-4 rounded-lg bg-background p-4">
        <div className="mb-3 flex items-end gap-3">
          <div className="text-[48px] leading-none text-accent">{entity.avg_score.toFixed(1)}</div>
          <div className="mb-2">
            <div className="mb-1 flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < Math.floor(entity.avg_score) ? 'fill-accent text-accent' : 'text-muted-foreground/30'}`}
                />
              ))}
            </div>
            <p className="text-body2 text-muted-foreground">{entity.review_count}개 후기</p>
          </div>
        </div>

        <div className="space-y-2">
          {distribution.map((item) => (
            <div key={item.stars} className="flex items-center gap-2">
              <span className="w-6 text-caption text-muted-foreground">{item.stars}점</span>
              <progress
                max={100}
                value={item.percentage}
                className="h-1.5 w-full flex-1 overflow-hidden rounded-full [&::-webkit-progress-bar]:bg-muted [&::-webkit-progress-value]:bg-accent [&::-moz-progress-bar]:bg-accent"
              />
              <span className="w-8 text-right text-caption text-muted-foreground">{item.count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4 space-y-2">
        {scoreItems.map((item) => (
          <div key={item.label} className="flex items-center justify-between">
            <span className="text-body2 text-muted-foreground">{item.label}</span>
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${i < Math.floor(item.score) ? 'fill-accent text-accent' : 'text-muted-foreground/30'}`}
                  />
                ))}
              </div>
              <span className="w-8 text-right text-body2 font-semibold text-foreground">{item.score.toFixed(1)}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-2 border-t border-border pt-4 text-body2">
        <div className="flex items-start gap-2 text-muted-foreground">
          <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <span>{entity.address || 'Sydney CBD, NSW'}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Phone className="h-4 w-4" />
          <span>{entity.phone || '+61 2 1234 5678'}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Globe className="h-4 w-4" />
          <span>{entity.website || 'www.yuhu.kr'}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>월-금 09:00-18:00</span>
        </div>
      </div>

      <div className="mt-4 border-t border-border pt-4">
        <h3 className="mb-2 font-semibold text-foreground">소개</h3>
        <p className="mb-3 text-body2 leading-relaxed text-muted-foreground">{entity.description}</p>
        <div className="flex flex-wrap gap-1.5">
          {entity.specialties.map((tag) => (
            <span key={tag} className="rounded-md bg-accent/10 px-2.5 py-1 text-label font-medium text-accent">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
