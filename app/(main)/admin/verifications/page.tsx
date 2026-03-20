'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { ChevronRight, ClockIcon, FileText } from 'lucide-react';
import { toast } from 'sonner';
import type { ApiResponse } from '@/lib/api';
import type { AdminVerification } from '@/types/admin';

const DOC_TYPE_LABEL: Record<AdminVerification['documentType'], string> = {
  coe: 'COE',
  tuition_receipt: '수업료 영수증',
  enrollment: '재학증명서',
  agency: '대화 내역'
};

const STATUS_TABS = [
  { key: 'pending', label: '대기중' },
  { key: 'approved', label: '승인됨' },
  { key: 'rejected', label: '반려됨' },
  { key: 'all', label: '전체' }
] as const;

function StatusBadge({ status }: { status: AdminVerification['status'] }) {
  const map = {
    pending: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700'
  };
  const label = { pending: '대기중', approved: '승인됨', rejected: '반려됨' };
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-caption font-semibold ${map[status]}`}>
      {label[status]}
    </span>
  );
}

function VerificationsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeStatus = (searchParams.get('status') ?? 'pending') as AdminVerification['status'] | 'all';
  const [items, setItems] = useState<AdminVerification[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async (status: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/v1/admin/verifications?status=${status}`);
      const json: ApiResponse<{ items: AdminVerification[] }> = await res.json();
      if (!res.ok || !json.data) throw new Error(json.error?.message ?? '');
      setItems(json.data.items);
    } catch {
      toast.error('인증 목록을 불러오지 못했어요.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load(activeStatus);
  }, [activeStatus]);

  const handleTabChange = (key: string) => {
    router.push(`/admin/verifications?status=${key}`);
  };

  return (
    <div className="space-y-4">
      {/* 헤더 */}
      <div>
        <h1 className="text-lg font-bold text-foreground">인증 관리</h1>
        <p className="mt-1 text-body2 text-muted-foreground">사용자가 제출한 학교 인증 요청을 검토하고 승인/반려해요.</p>
      </div>

      {/* 상태 탭 */}
      <div className="flex gap-1 rounded-xl border border-border bg-card p-1 shadow-sm">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => handleTabChange(tab.key)}
            className={`flex-1 rounded-lg py-2 text-body2 font-medium transition-colors ${
              activeStatus === tab.key
                ? 'bg-accent text-accent-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 목록 */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card py-16 text-center">
          <FileText className="mb-3 h-10 w-10 text-muted-foreground/40" />
          <p className="font-semibold text-muted-foreground">해당 상태의 인증 요청이 없어요.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="rounded-2xl border border-border bg-card p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-foreground">{item.userNickname}</span>
                    <StatusBadge status={item.status} />
                    <span className="rounded-full bg-muted px-2 py-0.5 text-caption text-muted-foreground">
                      {DOC_TYPE_LABEL[item.documentType]}
                    </span>
                  </div>
                  <p className="mt-1 text-body2 text-muted-foreground">{item.schoolName}</p>
                  <p className="mt-0.5 text-caption text-muted-foreground">{item.userEmail}</p>
                  <div className="mt-2 flex items-center gap-1 text-caption text-muted-foreground">
                    <ClockIcon className="h-3 w-3" />
                    <span>
                      {new Date(item.submittedAt).toLocaleDateString('ko-KR', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  {item.rejectionReason && (
                    <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-caption text-red-700">
                      반려 사유: {item.rejectionReason}
                    </p>
                  )}
                </div>
                <Link
                  href={`/admin/verifications/${item.id}`}
                  className="flex shrink-0 items-center gap-1 rounded-xl border border-border px-3 py-2 text-body2 font-medium text-foreground transition-colors hover:border-accent hover:text-accent"
                >
                  검토
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminVerificationsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <VerificationsContent />
    </Suspense>
  );
}
