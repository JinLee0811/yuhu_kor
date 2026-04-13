'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Clock3, Paperclip, ShieldCheck, X } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/lib/store/auth';
import type { ApiResponse } from '@/lib/api';
import type { UserVerification } from '@/types/verification';
import { DOCUMENT_TYPE_LABEL, SCHOOL_STATUS_LABEL } from '@/types/verification';

const DOCUMENT_OPTIONS = [
  { value: 'coe',             label: DOCUMENT_TYPE_LABEL['coe'] },
  { value: 'student_id',      label: DOCUMENT_TYPE_LABEL['student_id'] },
  { value: 'enrollment',      label: DOCUMENT_TYPE_LABEL['enrollment'] },
  { value: 'tuition_receipt', label: DOCUMENT_TYPE_LABEL['tuition_receipt'] },
  { value: 'agency',          label: DOCUMENT_TYPE_LABEL['agency'] }
] as const;

const SCHOOL_STATUS_OPTIONS = [
  { value: 'enrolled',     label: SCHOOL_STATUS_LABEL['enrolled'] },
  { value: 'prospective',  label: SCHOOL_STATUS_LABEL['prospective'] },
  { value: 'graduated',    label: SCHOOL_STATUS_LABEL['graduated'] }
] as const;

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
const MAX_SIZE_MB = 5;

export default function VerificationPage() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const verificationStatus = useAuthStore((state) => state.verificationStatus);
  const verifiedSchoolName = useAuthStore((state) => state.verifiedSchoolName);
  const setVerificationStatus = useAuthStore((state) => state.setVerificationStatus);

  const [documentType, setDocumentType] = useState<(typeof DOCUMENT_OPTIONS)[number]['value']>('coe');
  const [realName, setRealName] = useState('');
  const [schoolName, setSchoolName] = useState(verifiedSchoolName ?? '');
  const [department, setDepartment] = useState('');
  const [schoolStatus, setSchoolStatus] = useState<(typeof SCHOOL_STATUS_OPTIONS)[number]['value']>('enrolled');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error('JPG, PNG, WebP, PDF 파일만 첨부할 수 있어요.');
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      toast.error(`파일 크기는 ${MAX_SIZE_MB}MB 이하여야 해요.`);
      return;
    }
    setSelectedFile(file);
  };

  return (
    <div className="min-h-screen bg-background pb-safe">
      <div className="mx-auto max-w-2xl px-4 py-6 md:px-6 md:py-8">
        <section className="mb-5 rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-caption font-semibold text-accent">
            <ShieldCheck className="h-4 w-4" />
            학교 인증
          </div>
          <h1 className="text-xl font-bold text-foreground">인증된 유학생만 리뷰 작성과 게시판 이용이 가능해요</h1>
          <p className="mt-2 text-body2 text-muted-foreground">
            COE, 학생증, 재학증명서 등 서류 한 가지면 돼요. 관리자 확인 후 승인이 처리돼요.
          </p>
        </section>

        {!isLoggedIn ? (
          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <p className="text-body2 text-muted-foreground">먼저 로그인해야 인증 신청을 남길 수 있어요.</p>
            <Link href="/login" className="mt-4 inline-flex rounded-lg bg-accent px-4 py-2.5 text-caption font-semibold text-accent-foreground">
              로그인하러 가기
            </Link>
          </section>

        ) : verificationStatus === 'approved' ? (
          <section className="rounded-2xl border border-green-200 bg-green-50 p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-full bg-white">
                <CheckCircle2 className="h-5 w-5 text-green-700" />
              </div>
              <div>
                <p className="font-semibold text-green-900">{verifiedSchoolName ?? '학교'} 인증이 완료됐어요</p>
                <p className="mt-1 text-body2 text-green-800/80">이제 후기 작성과 학교생활 게시판을 이용할 수 있어요.</p>
                <Link href="/board" className="mt-4 inline-flex rounded-lg bg-accent px-4 py-2.5 text-caption font-semibold text-accent-foreground">
                  게시판 보러 가기
                </Link>
              </div>
            </div>
          </section>

        ) : verificationStatus === 'pending' ? (
          <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-full bg-white">
                <Clock3 className="h-5 w-5 text-amber-700" />
              </div>
              <div>
                <p className="font-semibold text-amber-900">인증 심사 중이에요</p>
                <p className="mt-1 text-body2 text-amber-800/80">
                  {verifiedSchoolName ? `${verifiedSchoolName} 기준으로` : '제출한'} 서류를 확인 중이에요. 승인 전까지는 게시판 일부만 볼 수 있어요.
                </p>
              </div>
            </div>
          </section>

        ) : (
          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="space-y-4">

              {/* 실명 (인증 핵심) */}
              <div>
                <label className="mb-2 block text-body2 font-semibold text-foreground">
                  실명 <span className="text-negative">*</span>
                </label>
                <input
                  value={realName}
                  onChange={(e) => setRealName(e.target.value)}
                  placeholder="서류에 표기된 이름과 동일하게 입력해주세요"
                  className="h-11 w-full rounded-lg border border-border bg-background px-3 text-body2 outline-none focus:border-ring"
                />
                <p className="mt-1.5 text-caption text-muted-foreground">실명은 관리자 인증 확인 용도로만 사용되며 게시판에 공개되지 않아요.</p>
              </div>

              {/* 학교명 */}
              <div>
                <label className="mb-2 block text-body2 font-semibold text-foreground">
                  학교명 <span className="text-negative">*</span>
                </label>
                <input
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  placeholder="예: UNSW, University of Melbourne"
                  className="h-11 w-full rounded-lg border border-border bg-background px-3 text-body2 outline-none focus:border-ring"
                />
              </div>

              {/* 학과/전공 */}
              <div>
                <label className="mb-2 block text-body2 font-semibold text-foreground">학과 / 전공</label>
                <input
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="예: Computer Science, Business, ELICOS"
                  className="h-11 w-full rounded-lg border border-border bg-background px-3 text-body2 outline-none focus:border-ring"
                />
                <p className="mt-1.5 text-caption text-muted-foreground">게시판에 학교·학과가 함께 공개돼요. 비워두면 학교명만 표시돼요.</p>
              </div>

              {/* 학생 상태 */}
              <div>
                <label className="mb-2 block text-body2 font-semibold text-foreground">현재 상태</label>
                <div className="flex gap-2">
                  {SCHOOL_STATUS_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setSchoolStatus(opt.value)}
                      className={`flex-1 rounded-lg border py-2.5 text-body2 font-medium transition-colors ${
                        schoolStatus === opt.value
                          ? 'border-accent bg-accent/10 text-accent'
                          : 'border-border bg-background text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 문서 종류 */}
              <div>
                <label className="mb-2 block text-body2 font-semibold text-foreground">
                  인증 서류 종류 <span className="text-negative">*</span>
                </label>
                <select
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value as (typeof DOCUMENT_OPTIONS)[number]['value'])}
                  className="h-11 w-full rounded-lg border border-border bg-background px-3 text-body2"
                >
                  {DOCUMENT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* 서류 파일 첨부 */}
              <div>
                <label className="mb-2 block text-body2 font-semibold text-foreground">
                  서류 파일 <span className="ml-1 text-caption font-normal text-muted-foreground">(JPG / PNG / PDF · 최대 5MB)</span>
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                {selectedFile ? (
                  <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2.5">
                    <Paperclip className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="flex-1 truncate text-body2 text-foreground">{selectedFile.name}</span>
                    <button type="button" onClick={() => { setSelectedFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                      className="shrink-0 text-muted-foreground hover:text-foreground">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <button type="button" onClick={() => fileInputRef.current?.click()}
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/30 text-body2 text-muted-foreground hover:bg-muted/50">
                    <Paperclip className="h-4 w-4" />
                    파일 선택하기
                  </button>
                )}
              </div>

              <div className="rounded-xl bg-muted/35 px-4 py-3 text-body2 text-muted-foreground">
                제출 후에는 관리자 확인 전까지 자동 승인되지 않아요. 보통 1~2 영업일 이내 처리됩니다.
              </div>

              <button
                type="button"
                onClick={async () => {
                  if (!realName.trim()) { toast.error('실명을 입력해줘요.'); return; }
                  if (!schoolName.trim()) { toast.error('학교명을 입력해줘요.'); return; }

                  try {
                    setLoading(true);

                    let documentUrl: string | undefined;
                    if (selectedFile) {
                      const uploadFormData = new FormData();
                      uploadFormData.append('file', selectedFile);
                      const uploadRes = await fetch('/api/v1/verifications/upload', { method: 'POST', body: uploadFormData });
                      const uploadJson: ApiResponse<{ documentUrl: string }> = await uploadRes.json();
                      if (!uploadRes.ok || !uploadJson.data) throw new Error(uploadJson.error?.message ?? '파일 업로드에 실패했어요.');
                      documentUrl = uploadJson.data.documentUrl;
                    }

                    const response = await fetch('/api/v1/verifications', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        realName: realName.trim(),
                        schoolName: schoolName.trim(),
                        department: department.trim() || undefined,
                        schoolStatus,
                        documentType,
                        documentUrl
                      })
                    });
                    const json: ApiResponse<UserVerification> = await response.json();
                    if (!response.ok || !json.data) throw new Error(json.error?.message ?? '인증 신청에 실패했어요.');

                    setVerificationStatus('pending', schoolName.trim());
                    toast.success('인증 신청이 접수됐어요.');
                  } catch (error) {
                    toast.error(error instanceof Error ? error.message : '인증 신청에 실패했어요.');
                  } finally {
                    setLoading(false);
                  }
                }}
                disabled={loading}
                className="h-11 w-full rounded-lg bg-accent text-body2 font-semibold text-accent-foreground disabled:opacity-60"
              >
                {loading ? '처리 중...' : '인증 신청하기'}
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
