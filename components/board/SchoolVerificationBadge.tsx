import { GraduationCap } from 'lucide-react';

interface Props {
  schoolName: string;
}

export function SchoolVerificationBadge({ schoolName }: Props) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-semibold text-green-700">
      <GraduationCap className="h-3.5 w-3.5" />
      {schoolName} 재학
    </span>
  );
}
