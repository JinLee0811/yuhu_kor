import { ShieldCheck } from 'lucide-react';

interface Props {
  kind: 'verified-review' | 'social';
}

export function ReviewCredibilityBadge({ kind }: Props) {
  if (kind === 'verified-review') {
    return (
      <span
        title="직접 확인된 인증 후기예요"
        className="inline-flex items-center gap-1 rounded-full border border-emerald-200/80 bg-emerald-50 px-2.5 py-1.5 text-[12px] font-semibold leading-none text-emerald-700"
      >
        <ShieldCheck className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
        직접 확인됨
      </span>
    );
  }

  return (
    <span
      title="인증된 후기예요"
      className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1.5 text-[12px] font-semibold leading-none text-slate-600"
    >
      <ShieldCheck className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
      인증된 후기
    </span>
  );
}
