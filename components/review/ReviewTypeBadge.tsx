import { MessageCircle, Plane, Phone } from 'lucide-react';
import type { ReviewType } from '@/types/review';

interface Props {
  type: ReviewType;
}

const map = {
  consultation: {
    label: '상담만 받았어요',
    icon: MessageCircle,
    className: 'bg-sky-100 text-sky-700 border-sky-200/80'
  },
  full: {
    label: '등록하고 학교까지 갔어요',
    icon: Plane,
    className: 'bg-emerald-100 text-emerald-700 border-emerald-200/80'
  },
  aftercare: {
    label: '학교 다니면서 관리받은 후기예요',
    icon: Phone,
    className: 'bg-violet-100 text-violet-700 border-violet-200/80'
  }
} as const;

export function ReviewTypeBadge({ type }: Props) {
  const item = map[type];
  const Icon = item.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[12px] font-semibold leading-none ${item.className}`}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
      {item.label}
    </span>
  );
}
