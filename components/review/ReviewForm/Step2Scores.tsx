'use client';

import { StarRating } from '@/components/review/StarRating';

interface ScoreItem {
  key: string;
  label: string;
}

interface Props {
  items: ScoreItem[];
  scores: Record<string, number>;
  onChange: (key: string, value: number) => void;
}

export function Step2Scores({ items, scores, onChange }: Props) {
  return (
    <div className="space-y-3 rounded-xl border border-border bg-card p-4">
      {items.map((item) => (
        <div key={item.key} className="flex items-center justify-between gap-3 border-b border-border pb-3 last:border-b-0">
          <span className="text-body2 font-medium">{item.label}</span>
          <StarRating value={scores[item.key] ?? 0} onChange={(value) => onChange(item.key, value)} />
        </div>
      ))}
    </div>
  );
}
