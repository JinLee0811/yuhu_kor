'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowLeft, Eye, Heart, Lock, MessageSquare } from 'lucide-react';
import type { BoardPost } from '@/types/board';
import type { Comment } from '@/types/reviewCard';
import { useAuthStore } from '@/lib/store/auth';
import { addBoardComment, getBoardComments, incrementBoardView, likeBoardComment, likeBoardPost } from '@/lib/mock/board';
import { SchoolVerificationBadge } from '@/components/board/SchoolVerificationBadge';
import { CommentThread } from '@/components/common/CommentThread';

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(iso));
}

interface Props {
  post: BoardPost;
}

export function BoardPostDetail({ post }: Props) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const nickname = useAuthStore((state) => state.nickname);
  const role = useAuthStore((state) => state.role);
  const verificationStatus = useAuthStore((state) => state.verificationStatus);
  const stickyTopClass = isLoggedIn ? 'top-14 md:top-16' : 'top-[90px] md:top-[96px]';
  // 어드민은 인증 없이 전체 열람 가능
  const canRead = verificationStatus === 'approved' || role === 'admin';

  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    incrementBoardView(post.id);
    if (canRead) {
      getBoardComments(post.id).then(setComments);
    }
  }, [post.id, canRead]);

  const authorLabel = post.isAnonymous ? '익명' : post.authorNickname;

  return (
    <div className="min-h-screen bg-background pb-safe">
      <div className={`sticky z-30 border-b border-border bg-background/95 backdrop-blur md:hidden ${stickyTopClass}`}>
        <div className="mx-auto max-w-3xl px-4 py-3">
          <button
            type="button"
            onClick={() => history.back()}
            className="inline-flex items-center gap-1 text-body2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>목록으로</span>
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-6 md:px-6 md:py-8">
        <button
          type="button"
          onClick={() => history.back()}
          className="mb-4 hidden items-center gap-1 text-body2 text-muted-foreground hover:text-foreground md:inline-flex"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>목록으로</span>
        </button>

        <article className="rounded-2xl border border-border bg-card p-5 shadow-sm md:p-6">
          <h1 className="text-xl font-bold text-foreground">{post.title}</h1>

          <div className="mt-3 flex flex-wrap items-center gap-1.5 text-caption text-muted-foreground">
            <span className="font-medium text-foreground">{authorLabel}</span>
            {post.schoolVerification.isVerified && post.schoolVerification.schoolName ? (
              <SchoolVerificationBadge schoolName={post.schoolVerification.schoolName} />
            ) : null}
            <span>·</span>
            <span>{formatDate(post.createdAt)}</span>
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
          </div>

          <div className="my-5 h-px bg-border/80" />

          <div className="relative">
            <div className={canRead ? '' : 'select-none blur-[10px]'}>
              <p className="whitespace-pre-line text-body2 leading-relaxed text-foreground">{post.content}</p>
            </div>

            {!canRead ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl bg-background/70 px-6 text-center backdrop-blur-sm">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-accent/10">
                  <Lock className="h-5 w-5 text-accent" />
                </div>
                <p className="font-semibold text-foreground">인증된 유학생만 볼 수 있어요</p>
                <p className="mt-1 text-body2 text-muted-foreground">COE 또는 재학증명서로 인증하면 바로 열람 가능해요</p>
                <Link href="/verification" className="mt-4 rounded-lg bg-accent px-4 py-2.5 text-caption font-semibold text-accent-foreground">
                  인증하러 가기
                </Link>
              </div>
            ) : null}
          </div>

          <div className="my-5 h-px bg-border/80" />

          <button
            type="button"
            onClick={async () => {
              setLikeCount((prev) => prev + 1);
              await likeBoardPost(post.id);
            }}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-body2 text-muted-foreground transition-colors hover:bg-muted/80"
          >
            <Heart className="h-4 w-4" />
            도움이 됐어요 {likeCount}
          </button>
        </article>

        {canRead ? (
          <CommentThread
            comments={comments}
            isLoggedIn={isLoggedIn}
            subtitle="학교생활 얘기도 편하게 이어서 남겨봐요."
            onAddRootComment={async (content) => {
              await addBoardComment({
                postId: post.id,
                parentId: null,
                content,
                authorNickname: nickname || '익명'
              });
              setComments(await getBoardComments(post.id));
            }}
            onAddReply={async (parentId, content, mentionNickname) => {
              await addBoardComment({
                postId: post.id,
                parentId,
                content,
                authorNickname: nickname || '익명',
                mentionNickname
              });
              setComments(await getBoardComments(post.id));
            }}
            onLikeComment={async (commentId) => {
              await likeBoardComment(commentId);
              setComments(await getBoardComments(post.id));
            }}
          />
        ) : (
          <section className="mt-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
            <p className="text-body2 text-muted-foreground">댓글도 인증된 유학생에게만 열려 있어요.</p>
          </section>
        )}
      </div>
    </div>
  );
}
