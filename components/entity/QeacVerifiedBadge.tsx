import { ShieldCheck } from 'lucide-react';

export function QeacVerifiedBadge() {
  return (
    <span className="group relative inline-flex">
      <span
        title="호주 정부 공인 유학 컨설턴트 자격증 보유 유학원이에요"
        tabIndex={0}
        className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-600 outline-none"
      >
        <ShieldCheck className="h-3.5 w-3.5" />
        QEAC 인증
      </span>
      <span className="pointer-events-none absolute left-0 top-full z-20 mt-2 hidden w-56 rounded-xl border border-blue-100 bg-white px-3 py-2 text-[11px] font-medium leading-relaxed text-slate-600 shadow-lg group-hover:block group-focus-within:block">
        호주 정부 공인 유학 컨설턴트 자격증 보유 유학원이에요.
      </span>
    </span>
  );
}
