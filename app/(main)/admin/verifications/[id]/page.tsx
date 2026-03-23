'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  ExternalLink,
  FileText,
  User,
  XCircle
} from 'lucide-react';
import { toast } from 'sonner';
import type { ApiResponse } from '@/lib/api';
import type { AdminVerification } from '@/types/admin';

const DOC_TYPE_LABEL: Record<AdminVerification['documentType'], string> = {
  coe: 'COE (Confirmation of Enrolment)',
  tuition_receipt: '수업료 영수증',
  enrollment: '재학증명서',
  agency: '유학원 대화 내역',
  student_id: '학생증'
};

const SCHOOL_STATUS_LABEL: Record<string, string> = {
  prospective: '입학 예정',
  enrolled: '재학생',
  graduated: '졸업생'
};

function StatusBadge({ status }: { status: AdminVerification['status'] }) {
  const map = {
    pending: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700'
  };
  const label = { pending: '대기중', approved: '승인됨', rejected: '반려됨' };
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-body2 font-semibold ${map[status]}`}>
      {label[status]}
    </span>
  );
}

export default function AdminVerificationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [item, setItem] = useState<AdminVerification | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    fetch(`/api/v1/admin/verifications/${id}`)
      .then((r) => r.json())
      .then((json: ApiResponse<AdminVerification>) => {
        if (json.data) setItem(json.data);
        else toast.error('인증 요청을 찾을 수 없어요.');
      })
      .catch(() => toast.error('불러오기에 실패했어요.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAction = async (action: 'approve' | 'reject') => {
    if (action === 'reject' && !rejectionReason.trim()) {
      toast.error('반려 사유를 입력해 주세요.');
      return;
    }

    try {
      setProcessing(true);
      const res = await fetch(`/api/v1/admin/verifications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, rejectionReason: rejectionReason.trim() || undefined })
      });
      const json: ApiResponse<AdminVerification> = await res.json();
      if (!res.ok || !json.data) throw new Error(json.error?.message ?? '');

      toast.success(action === 'approve' ? '인증을 승인했어요.' : '인증을 반려했어요.');
      router.push('/admin/verifications?status=pending');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '처리에 실패했어요.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-32 animate-pulse rounded-lg bg-muted" />
        <div className="h-64 animate-pulse rounded-2xl bg-muted" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center">
        <p className="text-muted-foreground">인증 요청을 찾을 수 없어요.</p>
      </div>
    );
  }

  const isProcessed = item.status !== 'pending';

  return (
    <div className="space-y-4">
      {/* 뒤로가기 */}
      <button
        type="button"
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-body2 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        목록으로
      </button>

      {/* 제목 */}
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-lg font-bold text-foreground">인증 요청 검토</h1>
        <StatusBadge status={item.status} />
      </div>

      {/* 제출 정보 */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h2 className="mb-4 font-semibold text-foreground">제출 정보</h2>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <User className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <div>
              <p className="text-caption text-muted-foreground">사용자</p>
              <p className="font-semibold text-foreground">{item.userNickname}</p>
              <p className="text-body2 text-muted-foreground">{item.userEmail}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <FileText className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <div>
              <p className="text-caption text-muted-foreground">서류 종류</p>
              <p className="font-semibold text-foreground">{DOC_TYPE_LABEL[item.documentType]}</p>
            </div>
          </div>
          {item.realName && (
            <div className="flex items-start gap-3">
              <User className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-caption text-muted-foreground">실명 (어드민 전용)</p>
                <p className="font-semibold text-foreground">{item.realName}</p>
              </div>
            </div>
          )}
          <div className="flex items-start gap-3">
            <div className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground">🎓</div>
            <div>
              <p className="text-caption text-muted-foreground">입력한 학교명</p>
              <p className="font-semibold text-foreground">{item.schoolName}</p>
            </div>
          </div>
          {item.department && (
            <div className="flex items-start gap-3">
              <div className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground">📚</div>
              <div>
                <p className="text-caption text-muted-foreground">학과 / 전공</p>
                <p className="font-semibold text-foreground">{item.department}</p>
              </div>
            </div>
          )}
          {item.schoolStatus && (
            <div className="flex items-start gap-3">
              <div className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground">📋</div>
              <div>
                <p className="text-caption text-muted-foreground">학생 상태</p>
                <p className="font-semibold text-foreground">{SCHOOL_STATUS_LABEL[item.schoolStatus] ?? item.schoolStatus}</p>
              </div>
            </div>
          )}
          <div className="flex items-start gap-3">
            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <div>
              <p className="text-caption text-muted-foreground">제출 시각</p>
              <p className="font-semibold text-foreground">
                {new Date(item.submittedAt).toLocaleString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
          {item.reviewedAt && (
            <div className="flex items-start gap-3">
              <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-caption text-muted-foreground">처리 시각</p>
                <p className="font-semibold text-foreground">
                  {new Date(item.reviewedAt).toLocaleString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 서류 미리보기 */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-foreground">업로드 서류</h2>
          {item.documentUrl && (
            <a
              href={item.documentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-body2 text-accent hover:underline"
            >
              새 탭에서 열기
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
        {item.documentUrl ? (
          <div className="overflow-hidden rounded-xl border border-border bg-muted">
            {item.documentUrl.endsWith('.pdf') ? (
              <iframe src={item.documentUrl} className="h-96 w-full" title="인증 서류" />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.documentUrl} alt="인증 서류" className="max-h-96 w-full object-contain" />
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/40 py-12 text-center">
            <FileText className="mb-2 h-10 w-10 text-muted-foreground/40" />
            <p className="text-body2 font-medium text-muted-foreground">파일 없음</p>
            <p className="mt-1 text-caption text-muted-foreground">이메일 인증 방식이거나 파일이 업로드되지 않았어요.</p>
          </div>
        )}
      </div>

      {/* 반려 사유 (기존 반려된 경우 표시) */}
      {item.status === 'rejected' && item.rejectionReason && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
          <p className="mb-1 text-body2 font-semibold text-red-700">반려 사유</p>
          <p className="text-body2 text-red-700">{item.rejectionReason}</p>
        </div>
      )}

      {/* 검토 액션 (대기중일 때만) */}
      {!isProcessed && (
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h2 className="mb-4 font-semibold text-foreground">검토 결과</h2>
          <div>
            <label className="mb-2 block text-body2 font-medium text-foreground">
              반려 사유
              <span className="ml-1 text-caption font-normal text-muted-foreground">(반려 시 필수 · 승인 시 불필요)</span>
            </label>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="예) 업로드된 서류가 COE로 확인되지 않아요. 올바른 서류를 다시 제출해 주세요."
              rows={3}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-body2 placeholder:text-muted-foreground focus:border-accent focus:outline-none"
            />
          </div>
          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={() => handleAction('reject')}
              disabled={processing}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-negative px-4 py-3 font-semibold text-negative transition-colors hover:bg-negative/5 disabled:opacity-60"
            >
              <XCircle className="h-5 w-5" />
              반려
            </button>
            <button
              type="button"
              onClick={() => handleAction('approve')}
              disabled={processing}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 font-semibold text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              <CheckCircle className="h-5 w-5" />
              승인
            </button>
          </div>
        </div>
      )}

      {/* 이미 처리된 경우 안내 */}
      {isProcessed && (
        <div className="rounded-2xl border border-border bg-card p-4 text-center">
          <p className="text-body2 text-muted-foreground">
            이 인증 요청은 이미{' '}
            <span className={item.status === 'approved' ? 'font-semibold text-green-700' : 'font-semibold text-red-700'}>
              {item.status === 'approved' ? '승인' : '반려'}
            </span>
            되었어요.
          </p>
        </div>
      )}
    </div>
  );
}
