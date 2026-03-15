import type { ApiResponse } from '@/lib/api';
import type { Comment, ReviewCardData } from '@/types/reviewCard';

const mockCommentsStore: Comment[] = [
  {
    id: 'c1',
    reviewId: 'r1',
    parentId: null,
    authorNickname: '시드니준비중',
    content: '상담 디테일하게 적어주셔서 도움 많이 됐어요!',
    likeCount: 3,
    createdAt: '2024-06-20T09:00:00Z'
  },
  {
    id: 'c2',
    reviewId: 'r1',
    parentId: 'c1',
    authorNickname: '호주유학고민중',
    mentionNickname: '시드니준비중',
    content: '혹시 상담은 온라인으로만 진행하셨나요?',
    likeCount: 1,
    createdAt: '2024-06-21T11:30:00Z'
  },
  {
    id: 'c3',
    reviewId: 'r2',
    parentId: null,
    authorNickname: '멜버른예정',
    content: '사후관리 부분이 살짝 걱정되긴 하네요 ㅠㅠ',
    likeCount: 0,
    createdAt: '2024-06-15T12:00:00Z'
  }
];

export async function getReview(reviewId: string): Promise<ReviewCardData | null> {
  const response = await fetch(`/api/v1/reviews/${reviewId}`);
  const json: ApiResponse<ReviewCardData> = await response.json();
  return response.ok ? json.data : null;
}

export async function likeReview(reviewId: string): Promise<void> {
  await fetch(`/api/v1/reviews/${reviewId}/helpful`, { method: 'POST' });
}

export async function getComments(reviewId: string): Promise<Comment[]> {
  const roots = mockCommentsStore.filter((comment) => comment.reviewId === reviewId && comment.parentId === null);
  return roots.map((root) => ({
    ...root,
    replies: mockCommentsStore.filter((reply) => reply.parentId === root.id)
  }));
}

export async function addComment(input: {
  reviewId: string;
  parentId: string | null;
  content: string;
  authorNickname: string;
  mentionNickname?: string | null;
}): Promise<Comment> {
  const newComment: Comment = {
    id: `c${Date.now()}`,
    reviewId: input.reviewId,
    parentId: input.parentId,
    authorNickname: input.authorNickname,
    mentionNickname: input.mentionNickname ?? null,
    content: input.content,
    likeCount: 0,
    createdAt: new Date().toISOString()
  };
  mockCommentsStore.push(newComment);
  return newComment;
}

export async function likeComment(commentId: string): Promise<void> {
  const target = mockCommentsStore.find((comment) => comment.id === commentId);
  if (target) {
    target.likeCount += 1;
  }
}

