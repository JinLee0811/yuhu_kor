import { GraduationCap } from 'lucide-react';
import type { SchoolStatus } from '@/types/verification';

const SCHOOL_STATUS_LABEL: Record<SchoolStatus, string> = {
  prospective: '입학예정',
  enrolled: '재학생',
  graduated: '졸업생'
};

interface Props {
  schoolName: string;
  department?: string | null;
  schoolStatus?: SchoolStatus | null;
}

export function SchoolVerificationBadge({ schoolName, department, schoolStatus }: Props) {
  const statusLabel = schoolStatus ? SCHOOL_STATUS_LABEL[schoolStatus] : '재학';
  const schoolLabel = department ? `${schoolName} · ${department}` : schoolName;

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-semibold text-green-700">
      <GraduationCap className="h-3.5 w-3.5 shrink-0" />
      {schoolLabel} {statusLabel}
    </span>
  );
}
