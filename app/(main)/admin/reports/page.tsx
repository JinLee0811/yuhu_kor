'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ChevronDown, ChevronUp, Flag } from 'lucide-react';
import { toast } from 'sonner';
import type { ApiResponse } from '@/lib/api';
import type { AdminReport } from '@/types/admin';

const STATUS_TABS = [
  { key: 'pending', label: '미처리' },
  { key: 'dismissed', label: '무시됨' },
  { key: 'actioned', label: '처리됨' },
  { key: 'all', label: '전체' }
] as const;

const TARGET_LABEL: Record<AdminReport['targetType'], string> = {
  review: '리뷰',
  board_post: '게시글'
};

function StatusBadge({ status }: { status: AdminReport['status'] }) {
  const map = {
    pending: 'bg-yellow-100 text-yellow-700',
    dismissed: 'bg-muted text-muted-foreground',
    actioned: 'bg-green-100 text-green-700'
  };
  const label = { pending: '미처리', dismissed: '무시됨', actioned: '처리됨' };
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-caption font-semibold ${map[status]}`}>
      {label[status]}
    </span>
  );
}

function ReportsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeStatus = (searchParams.get('status') ?? 'pending') as AdminReport['status'] | 'all';
  const [items, setItems] = useState<AdminReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = async (status: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/v1/admin/reports?status=${status}`);
      const json: ApiResponse<{ items: AdminReport[] }> = await res.json();
      if (!res.ok || !json.data) throw new Error(json.error?.message ?? '');
      setItems(json.data.items);
    } catch {
      toast.error('신고 목록을 불러오지 못했어요.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load(activeStatus);
  }, [activeStatus]);

  const handleAction = async (id: string, action: 'dismiss' | 'hide_content') => {
    try {
      setProcessing(id);
      const res = await fetch(`/api/v1/admin/reports/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      const json: ApiResponse<AdminReport> = await res.json();
      if (!res.ok || !json.data) throw new Error(json.error?.message ?? '');

      toast.success(action === 'dismiss' ? '신고를 무시 처리했어요.' : '콘텐츠를 숨김 처리했어요.');
      // 목록에서 업데이트
      setItems((prev) => prev.map((item) => (item.id === id ? json.data! : item)));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '처리에 실패했어요.');
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* 헤더 */}
      <div>
        <h1 className="text-lg font-bold text-foreground">신고 관리</h1>
        <p className="mt-1 text-body2 text-muted-foreground">사용자가 신고한 리뷰 및 게시글을 검토하고 처리해요.</p>
      </div>

      {/* 상태 탭 */}
      <div className="flex gap-1 rounded-xl border border-border bg-card p-1 shadow-sm">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => router.push(`/admin/reports?status=${tab.key}`)}
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
            <div key={i} className="h-32 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card py-16 text-center">
          <Flag className="mb-3 h-10 w-10 text-muted-foreground/40" />
          <p className="font-semibold text-muted-foreground">해당 상태의 신고가 없어요.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const isExpanded = expanded === item.id;
            const isPending = item.status === 'pending';
            return (
              <div key={item.id} className="rounded-2xl border border-border bg-card shadow-sm">
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge status={item.status} />
                        <span className="rounded-full bg-muted px-2 py-0.5 text-caption text-muted-foreground">
                          {TARGET_LABEL[item.targetType]}
                        </span>
                        <span className="text-caption text-muted-foreground">신고자: {item.reporterNickname}</span>
                      </div>
                      <p className="mt-2 text-body2 font-medium text-foreground">{item.reason}</p>
                      <p className="mt-1 text-caption text-muted-foreground">
                        {new Date(item.createdAt).toLocaleDateString('ko-KR', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setExpanded(isExpanded ? null : item.id)}
                      className="flex shrink-0 items-center gap-1 rounded-xl border border-border px-3 py-2 text-caption text-muted-foreground hover:text-foreground"
                    >
                      내용
                      {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                    </button>
                  </div>

                  {/* 신고 대상 내용 (펼쳐보기) */}
                  {isExpanded && (
                    <div className="mt-3 rounded-xl border border-border bg-muted/40 p-3">
                      <p className="mb-1 text-caption font-semibold text-muted-foreground">신고 대상 내용</p>
                      <p className="text-body2 text-foreground">{item.targetPreview}</p>
                    </div>
                  )}

                  {/* 액션 버튼 (미처리 신고만) */}
                  {isPending && (
                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        disabled={processing === item.id}
                        onClick={() => handleAction(item.id, 'dismiss')}
                        className="flex-1 rounded-xl border border-border px-3 py-2.5 text-body2 font-semibold text-muted-foreground transition-colors hover:border-muted hover:bg-muted/50 disabled:opacity-60"
                      >
                        무시
                      </button>
                      <button
                        type="button"
                        disabled={processing === item.id}
                        onClick={() => handleAction(item.id, 'hide_content')}
                        className="flex-1 rounded-xl border border-negative px-3 py-2.5 text-body2 font-semibold text-negative transition-colors hover:bg-negative/5 disabled:opacity-60"
                      >
                        콘텐츠 숨김
                      </button>
                    </div>
                  )}

                  {/* 처리 완료 메시지 */}
                  {!isPending && item.reviewedAt && (
                    <p className="mt-3 text-caption text-muted-foreground">
                      {new Date(item.reviewedAt).toLocaleDateString('ko-KR', {
                        month: 'short',
                        day: 'numeric'
                      })}
                      에 처리됨
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function AdminReportsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <ReportsContent />
    </Suspense>
  );
}
