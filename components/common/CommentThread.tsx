'use client';

import { useMemo, useState } from 'react';
import { MessageCircle, ThumbsUp } from 'lucide-react';
import type { Comment } from '@/types/reviewCard';

function timeAgo(iso: string): string {
  const created = new Date(iso).getTime();
  const now = Date.now();
  const diffDays = Math.floor((now - created) / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) return '오늘';
  if (diffDays === 1) return '1일 전';
  return `${diffDays}일 전`;
}

function stringToColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 65%, 60%)`;
}

interface Props {
  comments: Comment[];
  isLoggedIn: boolean;
  subtitle?: string;
  onAddRootComment: (content: string) => Promise<void>;
  onAddReply: (parentId: string, content: string, mentionNickname?: string | null) => Promise<void>;
  onLikeComment: (commentId: string) => Promise<void>;
}

export function CommentThread({
  comments,
  isLoggedIn,
  subtitle = '읽고 느낀 점을 편하게 남겨봐요.',
  onAddRootComment,
  onAddReply,
  onLikeComment
}: Props) {
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [showAllComments, setShowAllComments] = useState(false);

  const totalCommentCount = useMemo(
    () => comments.reduce((sum, comment) => sum + 1 + (comment.replies?.length ?? 0), 0),
    [comments]
  );

  const visibleComments = useMemo(
    () => (showAllComments ? comments : comments.slice(0, 5)),
    [comments, showAllComments]
  );

  return (
    <section className="mt-4 rounded-2xl border border-border bg-card/80 p-4 shadow-sm backdrop-blur-sm md:p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10">
            <MessageCircle className="h-4 w-4 text-accent" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">댓글 {totalCommentCount}개</h2>
            <p className="text-caption text-muted-foreground">{subtitle}</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {visibleComments.map((comment) => (
          <div key={comment.id} className="rounded-xl border border-border/60 bg-background p-3 md:p-4">
            <div className="mb-2 flex items-center gap-2">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-semibold text-white shadow-sm"
                style={{ backgroundColor: stringToColor(comment.authorNickname) }}
              >
                {comment.authorNickname.charAt(0)}
              </div>
              <div className="flex items-center gap-1 text-caption text-muted-foreground">
                <span className="font-semibold text-foreground">{comment.authorNickname}</span>
                <span>·</span>
                <span>{timeAgo(comment.createdAt)}</span>
              </div>
            </div>
            <p className="mb-2 text-body2 leading-relaxed text-foreground">{comment.content}</p>
            <div className="flex items-center gap-3 text-caption text-muted-foreground">
              <button
                type="button"
                onClick={() => onLikeComment(comment.id)}
                className="flex items-center gap-1 rounded-full px-2.5 py-1 transition-colors hover:bg-muted/80"
              >
                <ThumbsUp className="h-3 w-3" strokeWidth={2} />
                <span>{comment.likeCount}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setReplyTo((prev) => (prev === comment.id ? null : comment.id));
                  setReplyContent('');
                }}
                className="rounded-full px-2.5 py-1 transition-colors hover:bg-muted/80"
              >
                답글 달기
              </button>
            </div>

            {comment.replies && comment.replies.length > 0 ? (
              <div className="mt-3 space-y-2 border-l-2 border-border/50 pl-3">
                {comment.replies.map((reply) => (
                  <div key={reply.id} className="rounded-lg bg-muted/35 p-3">
                    <div className="mb-2 flex items-center gap-2">
                      <div
                        className="flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-semibold text-white shadow-sm"
                        style={{ backgroundColor: stringToColor(reply.authorNickname) }}
                      >
                        {reply.authorNickname.charAt(0)}
                      </div>
                      <div className="flex items-center gap-1 text-caption text-muted-foreground">
                        <span className="font-semibold text-foreground">{reply.authorNickname}</span>
                        <span>·</span>
                        <span>{timeAgo(reply.createdAt)}</span>
                      </div>
                    </div>
                    <p className="mb-2 text-body2 leading-relaxed text-foreground">
                      {reply.mentionNickname ? (
                        <span className="mr-1.5 inline-flex rounded-full bg-accent/10 px-2 py-0.5 text-[11px] font-semibold text-accent">
                          @{reply.mentionNickname}
                        </span>
                      ) : null}
                      {reply.content}
                    </p>
                    <div className="flex items-center gap-3 text-caption text-muted-foreground">
                      <button
                        type="button"
                        onClick={() => onLikeComment(reply.id)}
                        className="flex items-center gap-1 rounded-full px-2.5 py-1 transition-colors hover:bg-background"
                      >
                        <ThumbsUp className="h-3 w-3" strokeWidth={2} />
                        <span>{reply.likeCount}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}

            {replyTo === comment.id && isLoggedIn ? (
              <div className="mt-3 rounded-lg bg-muted/35 p-3">
                <p className="mb-2 text-caption text-muted-foreground">@{comment.authorNickname}에게 답글</p>
                <div className="flex flex-col gap-2 md:flex-row">
                  <input
                    value={replyContent}
                    onChange={(event) => setReplyContent(event.target.value)}
                    className="h-10 flex-1 rounded-lg border border-border bg-card px-3 text-body2 outline-none focus:border-ring"
                    placeholder="댓글을 남겨봐요..."
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={async () => {
                        if (!replyContent.trim()) return;
                        await onAddReply(comment.id, replyContent.trim(), comment.authorNickname);
                        setReplyContent('');
                        setReplyTo(null);
                      }}
                      className="h-10 rounded-lg bg-accent px-4 text-caption font-semibold text-accent-foreground"
                    >
                      등록
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setReplyTo(null);
                        setReplyContent('');
                      }}
                      className="h-10 rounded-lg border border-border px-4 text-caption text-muted-foreground"
                    >
                      취소
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        ))}

        {comments.length > 5 && !showAllComments ? (
          <button
            type="button"
            onClick={() => setShowAllComments(true)}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-body2 font-medium text-accent transition-colors hover:bg-muted/60"
          >
            댓글 {comments.length - visibleComments.length}개 더 보기
          </button>
        ) : null}
      </div>

      <div className="mt-4 border-t border-border/60 pt-4">
        {isLoggedIn ? (
          <div className="rounded-xl bg-muted/35 p-3">
            <div className="flex flex-col gap-2 md:flex-row md:items-center">
              <input
                value={newComment}
                onChange={(event) => setNewComment(event.target.value)}
                className="h-11 flex-1 rounded-lg border border-border bg-card px-3 text-body2 outline-none focus:border-ring"
                placeholder="댓글을 남겨봐요..."
              />
              <button
                type="button"
                onClick={async () => {
                  if (!newComment.trim()) return;
                  await onAddRootComment(newComment.trim());
                  setNewComment('');
                }}
                className="h-11 rounded-lg bg-accent px-5 text-caption font-semibold text-accent-foreground"
              >
                등록
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-xl bg-muted/35 px-4 py-3">
            <p className="text-caption text-muted-foreground">로그인 후 댓글을 남길 수 있어요</p>
          </div>
        )}
      </div>
    </section>
  );
}
