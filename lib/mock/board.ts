import type { Comment } from '@/types/reviewCard';
import type { BoardPost } from '@/types/board';

export const mockBoardPosts: BoardPost[] = [
  {
    id: 'bp1',
    authorNickname: '야간도서관파',
    schoolVerification: {
      isVerified: true,
      schoolName: 'UNSW'
    },
    isAnonymous: false,
    title: 'UNSW 첫 학기 시간표 이렇게 짜니까 살만했어요',
    content:
      '월수에 몰아서 듣고 화목은 아예 비워두니까 과제랑 아르바이트 병행이 한결 편했어요. 첫 학기면 오전 수업만 꽉 채우는 것보다 이동시간까지 생각해서 짜는 게 훨씬 덜 힘들더라고요.',
    likeCount: 18,
    commentCount: 4,
    viewCount: 143,
    createdAt: '2026-03-04T09:00:00Z',
    schoolId: 's-unsw'
  },
  {
    id: 'bp2',
    authorNickname: '시드니기숙사러',
    schoolVerification: {
      isVerified: true,
      schoolName: 'University of Sydney'
    },
    isAnonymous: true,
    title: '시드니대 근처 쉐어하우스 구할 때 체크했던 것들',
    content:
      '캠퍼스랑 가까운 것보다 집주인 응답 속도, 세탁기 상태, 밤 소음이 더 중요했어요. inspection 갈 때 영상도 꼭 찍어두는 걸 추천해요.',
    likeCount: 9,
    commentCount: 2,
    viewCount: 98,
    createdAt: '2026-03-03T12:30:00Z',
    schoolId: 's-usyd'
  },
  {
    id: 'bp3',
    authorNickname: '멜번적응중',
    schoolVerification: {
      isVerified: true,
      schoolName: 'RMIT University'
    },
    isAnonymous: false,
    title: 'RMIT ELICOS 다녀본 사람 기준으로 수업 분위기 정리',
    content:
      '반마다 분위기 차이는 있지만 발표 비중이 생각보다 높았어요. 문법만 파는 스타일은 아니고 실제로 말하게 만드는 편이라 처음엔 빡세도 적응되면 실력이 빨리 늘어요.',
    likeCount: 14,
    commentCount: 6,
    viewCount: 121,
    createdAt: '2026-03-01T08:15:00Z',
    schoolId: 's-rmit'
  },
  {
    id: 'bp4',
    authorNickname: '워홀후학생',
    schoolVerification: {
      isVerified: false,
      schoolName: null
    },
    isAnonymous: true,
    title: 'TAFE NSW 요리 과정 들어가기 전에 준비하면 좋았던 것',
    content:
      '칼 쓰는 기본기보다 오히려 체력이 더 중요했어요. 수업 끝나고 바로 알바 가는 날은 진짜 빡셌고, 신발이랑 칼 세트는 초반에 괜찮은 걸로 맞춰두는 게 덜 후회돼요.',
    likeCount: 5,
    commentCount: 1,
    viewCount: 84,
    createdAt: '2026-02-26T16:10:00Z',
    schoolId: 's-tafe-nsw'
  }
];

const mockBoardCommentsStore: Comment[] = [
  {
    id: 'bc1',
    reviewId: 'bp1',
    parentId: null,
    authorNickname: '과제폭탄러',
    content: '화목 비우는 거 진짜 공감해요. 튜토리얼까지 붙으면 이동시간 무시 못하죠.',
    likeCount: 2,
    createdAt: '2026-03-04T10:20:00Z'
  },
  {
    id: 'bc2',
    reviewId: 'bp1',
    parentId: 'bc1',
    authorNickname: '야간도서관파',
    mentionNickname: '과제폭탄러',
    content: '맞아요. 특히 첫 학기엔 캠퍼스 동선 익히는 시간도 꽤 들더라고요.',
    likeCount: 1,
    createdAt: '2026-03-04T11:05:00Z'
  },
  {
    id: 'bc3',
    reviewId: 'bp3',
    parentId: null,
    authorNickname: '멜번첫학기',
    content: 'ELICOS 반 배정은 레벨 테스트 결과로만 나뉘나요?',
    likeCount: 0,
    createdAt: '2026-03-01T09:00:00Z'
  }
];

export async function getBoardPosts(schoolId?: string | null): Promise<BoardPost[]> {
  const items = schoolId ? mockBoardPosts.filter((post) => post.schoolId === schoolId) : mockBoardPosts;
  return [...items].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getBoardPost(postId: string): Promise<BoardPost | null> {
  return mockBoardPosts.find((post) => post.id === postId) ?? null;
}

export async function likeBoardPost(postId: string): Promise<void> {
  const target = mockBoardPosts.find((post) => post.id === postId);
  if (target) target.likeCount += 1;
}

export async function addBoardPost(input: Omit<BoardPost, 'id' | 'createdAt' | 'likeCount' | 'commentCount' | 'viewCount'>) {
  const next: BoardPost = {
    ...input,
    id: `bp${Date.now()}`,
    createdAt: new Date().toISOString(),
    likeCount: 0,
    commentCount: 0,
    viewCount: 0
  };
  mockBoardPosts.unshift(next);
  return next;
}

export async function getBoardComments(postId: string): Promise<Comment[]> {
  const roots = mockBoardCommentsStore.filter((comment) => comment.reviewId === postId && comment.parentId === null);
  return roots.map((root) => ({
    ...root,
    replies: mockBoardCommentsStore.filter((reply) => reply.parentId === root.id)
  }));
}

export async function addBoardComment(input: {
  postId: string;
  parentId: string | null;
  content: string;
  authorNickname: string;
  mentionNickname?: string | null;
}): Promise<Comment> {
  const next: Comment = {
    id: `bc${Date.now()}`,
    reviewId: input.postId,
    parentId: input.parentId,
    authorNickname: input.authorNickname,
    mentionNickname: input.mentionNickname ?? null,
    content: input.content,
    likeCount: 0,
    createdAt: new Date().toISOString()
  };
  mockBoardCommentsStore.push(next);

  const post = mockBoardPosts.find((item) => item.id === input.postId);
  if (post) post.commentCount += 1;

  return next;
}

export async function likeBoardComment(commentId: string): Promise<void> {
  const target = mockBoardCommentsStore.find((comment) => comment.id === commentId);
  if (target) target.likeCount += 1;
}

export async function incrementBoardView(postId: string): Promise<void> {
  const target = mockBoardPosts.find((post) => post.id === postId);
  if (target) target.viewCount += 1;
}
