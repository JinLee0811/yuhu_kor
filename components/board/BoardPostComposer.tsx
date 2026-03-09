'use client';

import { useState } from 'react';
import type { BoardPost } from '@/types/board';
import { SchoolVerificationBadge } from '@/components/board/SchoolVerificationBadge';

interface Props {
  authorNickname: string;
  verifiedSchoolName: string;
  onSubmit: (input: Pick<BoardPost, 'title' | 'content' | 'isAnonymous' | 'schoolVerification' | 'authorNickname' | 'schoolId'>) => Promise<void>;
  selectedSchoolId?: string | null;
}

export function BoardPostComposer({ authorNickname, verifiedSchoolName, selectedSchoolId, onSubmit }: Props) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <h2 className="font-semibold text-foreground">글쓰기</h2>
        <SchoolVerificationBadge schoolName={verifiedSchoolName} />
      </div>

      <div className="space-y-3">
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value.slice(0, 100))}
          placeholder="제목을 써줘요"
          className="h-11 w-full rounded-lg border border-border bg-background px-3 text-body2 outline-none focus:border-ring"
        />
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value.slice(0, 2000))}
          placeholder="학교생활, 수업 분위기, 적응 팁 같은 거 편하게 남겨봐요"
          rows={6}
          className="w-full rounded-xl border border-border bg-background px-3 py-3 text-body2 outline-none focus:border-ring"
        />

        <label className="flex items-center gap-2 text-body2 text-muted-foreground">
          <input type="checkbox" checked={isAnonymous} onChange={(event) => setIsAnonymous(event.target.checked)} />
          닉네임 숨기기
        </label>

        <div className="flex items-center justify-between">
          <p className="text-caption text-muted-foreground">학교 마크는 유지되고 닉네임만 가려져요.</p>
          <button
            type="button"
            onClick={async () => {
              if (!title.trim() || !content.trim()) return;
              await onSubmit({
                title: title.trim(),
                content: content.trim(),
                isAnonymous,
                authorNickname,
                schoolVerification: {
                  isVerified: true,
                  schoolName: verifiedSchoolName
                },
                schoolId: selectedSchoolId ?? null
              });
              setTitle('');
              setContent('');
              setIsAnonymous(false);
            }}
            className="rounded-lg bg-accent px-4 py-2.5 text-caption font-semibold text-accent-foreground"
          >
            등록
          </button>
        </div>
      </div>
    </section>
  );
}
