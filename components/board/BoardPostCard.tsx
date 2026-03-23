import Link from 'next/link';
import { Eye, Heart, MessageSquare } from 'lucide-react';
import type { BoardPost } from '@/types/board';
import { SchoolVerificationBadge } from '@/components/board/SchoolVerificationBadge';

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('ko-KR', {
    month: 'short',
    day: 'numeric'
  }).format(new Date(iso));
}

interface Props {
  post: BoardPost;
  canRead: boolean;
}

export function BoardPostCard({ post, canRead }: Props) {
  const authorLabel = post.isAnonymous ? '익명' : post.authorNickname;
  const preview = (
    <div className="relative mt-3">
      <p className={`line-clamp-1 text-body2 text-muted-foreground ${canRead ? '' : 'select-none blur-[6px]'}`}>{post.content}</p>
      {!canRead ? (
        <div className="absolute inset-0 flex items-center justify-between rounded-lg bg-background/65 px-3 backdrop-blur-sm">
          <div>
            <p className="text-body2 font-semibold text-foreground">인증된 유학생만 볼 수 있어요</p>
            <p className="text-caption text-muted-foreground">COE 또는 재학증명서로 인증하면 바로 열람 가능해요</p>
          </div>
          <Link href="/verification" className="rounded-lg bg-accent px-3 py-2 text-caption font-semibold text-accent-foreground">
            인증하러 가기
          </Link>
        </div>
      ) : null}
    </div>
  );

  const content = (
    <article className="rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(0,0,0,0.06)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-1 font-semibold text-foreground">{post.title}</h3>
          <div className="mt-2 flex flex-wrap items-center gap-1.5 text-caption text-muted-foreground">
            <span className="font-medium text-foreground">{authorLabel}</span>
            {post.schoolVerification.isVerified && post.schoolVerification.schoolName ? (
              <SchoolVerificationBadge
                schoolName={post.schoolVerification.schoolName}
                department={post.schoolVerification.department}
                schoolStatus={post.schoolVerification.schoolStatus}
              />
            ) : null}
            <span>·</span>
            <span>{formatDate(post.createdAt)}</span>
          </div>
          {preview}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-caption text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <Eye className="h-3.5 w-3.5" />
          {post.viewCount}
        </span>
        <span className="inline-flex items-center gap-1">
          <MessageSquare className="h-3.5 w-3.5" />
          {post.commentCount}
        </span>
        <span className="inline-flex items-center gap-1">
          <Heart className="h-3.5 w-3.5" />
          {post.likeCount}
        </span>
      </div>
    </article>
  );

  if (!canRead) return content;
  return <Link href={`/board/${post.id}`}>{content}</Link>;
}
