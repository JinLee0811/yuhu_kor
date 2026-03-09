'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Clock3, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '@/lib/store/auth';

const documentOptions = [
  { value: 'coe', label: 'COE (Confirmation of Enrolment)' },
  { value: 'tuition_receipt', label: '등록금 납부 영수증' },
  { value: 'enrollment', label: '재학증명서' },
  { value: 'agency', label: '유학원 등록 증빙 서류' }
] as const;

export default function VerificationPage() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const verificationStatus = useAuthStore((state) => state.verificationStatus);
  const verifiedSchoolName = useAuthStore((state) => state.verifiedSchoolName);
  const submitVerification = useAuthStore((state) => state.submitVerification);

  const [documentType, setDocumentType] = useState<(typeof documentOptions)[number]['value']>('coe');
  const [schoolName, setSchoolName] = useState(verifiedSchoolName ?? '');

  return (
    <div className="min-h-screen bg-background pb-safe">
      <div className="mx-auto max-w-2xl px-4 py-6 md:px-6 md:py-8">
        <section className="mb-5 rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-caption font-semibold text-accent">
            <ShieldCheck className="h-4 w-4" />
            학교 인증
          </div>
          <h1 className="text-xl font-bold text-foreground">인증된 유학생만 게시판 전체를 볼 수 있어요</h1>
          <p className="mt-2 text-body2 text-muted-foreground">
            COE, 등록금 영수증, 재학증명서, 유학원 등록 증빙 중 하나만 제출해도 돼요. 자동 승인 대신 관리자 확인 후 열려요.
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
                <p className="mt-1 text-body2 text-green-800/80">이제 학교생활 게시판을 전체 열람하고 글도 쓸 수 있어요.</p>
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
                  {verifiedSchoolName ? `${verifiedSchoolName}` : '제출한 학교'} 기준으로 서류를 확인 중이에요. 승인 전까지는 게시판 일부만 볼 수 있어요.
                </p>
              </div>
            </div>
          </section>
        ) : (
          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-body2 font-semibold text-foreground">문서 종류</label>
                <select
                  value={documentType}
                  onChange={(event) => setDocumentType(event.target.value as (typeof documentOptions)[number]['value'])}
                  className="h-11 w-full rounded-lg border border-border bg-background px-3 text-body2"
                >
                  {documentOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-body2 font-semibold text-foreground">학교명</label>
                <input
                  value={schoolName}
                  onChange={(event) => setSchoolName(event.target.value)}
                  placeholder="예: UNSW"
                  className="h-11 w-full rounded-lg border border-border bg-background px-3 text-body2 outline-none focus:border-ring"
                />
              </div>

              <div className="rounded-xl bg-muted/35 px-4 py-3 text-body2 text-muted-foreground">
                제출 후에는 관리자 확인 전까지 자동 승인되지 않아요. 보통 하루 안쪽으로 처리된다는 가정으로 목업했어요.
              </div>

              <button
                type="button"
                onClick={() => {
                  if (!schoolName.trim()) return;
                  void documentType;
                  submitVerification(schoolName.trim());
                }}
                className="h-11 w-full rounded-lg bg-accent text-body2 font-semibold text-accent-foreground"
              >
                인증 신청하기
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
