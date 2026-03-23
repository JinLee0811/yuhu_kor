'use client';

import { useState } from 'react';
import { X, Flag, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

const REPORT_REASONS = [
  '광고성/홍보성 후기',
  '허위/과장된 내용',
  '욕설 또는 비방',
  '개인정보 포함',
  '관련 없는 내용',
  '기타'
] as const;

interface Props {
  reviewId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ReportModal({ reviewId, isOpen, onClose }: Props) {
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [customReason, setCustomReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async () => {
    const reason = selectedReason === '기타' ? customReason.trim() || '기타' : selectedReason;
    if (!reason) return;

    try {
      setLoading(true);
      const res = await fetch(`/api/v1/reviews/${reviewId}/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason })
      });

      const json = (await res.json()) as { data?: unknown; error?: { code: string; message: string } };

      if (!res.ok || json.error) {
        if (json.error?.code === 'UNAUTHORIZED') {
          toast.error('로그인 후 신고할 수 있어요.');
        } else if (json.error?.code === 'ALREADY_REPORTED') {
          toast.error('이미 신고한 후기예요.');
          handleClose();
        } else {
          toast.error(json.error?.message ?? '신고 처리 중 오류가 발생했어요.');
        }
        return;
      }

      setDone(true);
    } catch {
      toast.error('신고 처리 중 오류가 발생했어요.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedReason('');
    setCustomReason('');
    setDone(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      onClick={handleClose}
    >
      {/* 배경 오버레이 */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

      {/* 모달 */}
      <div
        className="relative z-10 w-full max-w-md rounded-t-2xl bg-card p-5 shadow-xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flag className="h-4 w-4 text-destructive" />
            <h2 className="font-semibold text-foreground">후기 신고</h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-1 text-muted-foreground hover:bg-muted/80"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {done ? (
          // 신고 완료 화면
          <div className="py-6 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <Flag className="h-5 w-5 text-green-600" />
            </div>
            <p className="mb-1 font-semibold text-foreground">신고가 접수됐어요</p>
            <p className="text-body2 text-muted-foreground">검토 후 조치를 취할게요. 감사해요.</p>
            <button
              type="button"
              onClick={handleClose}
              className="mt-5 h-10 w-full rounded-lg bg-accent text-caption font-semibold text-accent-foreground"
            >
              확인
            </button>
          </div>
        ) : (
          // 신고 사유 선택
          <>
            <div className="mb-2 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
              <p className="text-body2 text-amber-800">
                신고는 운영자가 검토한 뒤 처리돼요. 허위 신고는 이용 제한이 될 수 있어요.
              </p>
            </div>

            <p className="mb-3 text-body2 font-semibold text-foreground">신고 사유를 선택해주세요</p>
            <div className="mb-4 space-y-2">
              {REPORT_REASONS.map((reason) => (
                <button
                  key={reason}
                  type="button"
                  onClick={() => {
                    setSelectedReason(reason);
                    if (reason !== '기타') setCustomReason('');
                  }}
                  className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-body2 transition-colors ${
                    selectedReason === reason
                      ? 'border-accent bg-accent/5 text-accent'
                      : 'border-border bg-card text-foreground hover:bg-muted/60'
                  }`}
                >
                  <span
                    className={`h-4 w-4 shrink-0 rounded-full border-2 transition-colors ${
                      selectedReason === reason ? 'border-accent bg-accent' : 'border-border'
                    }`}
                  />
                  {reason}
                </button>
              ))}
            </div>

            {selectedReason === '기타' && (
              <textarea
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="신고 사유를 직접 입력해주세요 (선택)"
                maxLength={200}
                rows={3}
                className="mb-4 w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-body2 outline-none focus:border-ring"
              />
            )}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={!selectedReason || loading}
              className="h-11 w-full rounded-lg bg-destructive font-semibold text-white disabled:opacity-50"
            >
              {loading ? '처리 중...' : '신고하기'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
