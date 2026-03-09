import { Award } from 'lucide-react';

interface Props {
  reviewCount: number;
  avgScore: number;
}

export function YuhuVerifiedBadge({ reviewCount, avgScore }: Props) {
  if (reviewCount < 20 || avgScore < 4.0) return null;

  return (
    <span
      title="유후 인증을 받은 유학원이에요"
      className="inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-800"
    >
      <Award className="h-3 w-3" />
      유후 인증 🔍
    </span>
  );
}
