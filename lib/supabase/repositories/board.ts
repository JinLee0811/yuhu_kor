import 'server-only';

import type { BoardPost } from '@/types/board';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/env';
import { getBoardPosts as getMockBoardPosts, getBoardPost as getMockBoardPost } from '@/lib/mock/board';

// DB Row → BoardPost 매핑
function mapBoardPost(
  row: {
    id: string;
    author_id: string;
    school_id: string | null;
    title: string;
    content: string;
    is_anonymous: boolean;
    like_count: number;
    comment_count: number;
    view_count: number;
    created_at: string;
  },
  profile: { nickname: string; department: string | null; school_status: string | null; verified_at: string | null } | undefined,
  schoolName: string | null
): BoardPost {
  const isVerified = Boolean(profile?.verified_at);

  return {
    id: row.id,
    authorNickname: row.is_anonymous ? '익명' : (profile?.nickname ?? '탈퇴한 유저'),
    schoolVerification: {
      isVerified,
      schoolName: isVerified ? schoolName : null,
      department: isVerified ? (profile?.department ?? null) : null,
      schoolStatus: isVerified ? ((profile?.school_status as BoardPost['schoolVerification']['schoolStatus']) ?? null) : null
    },
    isAnonymous: row.is_anonymous,
    title: row.title,
    content: row.content,
    likeCount: row.like_count,
    commentCount: row.comment_count,
    viewCount: row.view_count,
    createdAt: row.created_at,
    schoolId: row.school_id
  };
}

// 게시글 목록 조회 (학교 필터 선택)
export async function listBoardPosts(schoolId?: string | null): Promise<BoardPost[]> {
  if (!isSupabaseConfigured()) {
    return getMockBoardPosts(schoolId);
  }

  const supabase = await createClient();

  // 1) board_posts 조회
  let query = supabase.from('board_posts').select('*').order('created_at', { ascending: false }).limit(50);
  if (schoolId) query = query.eq('school_id', schoolId);

  const { data: posts, error } = await query;
  if (error) throw error;
  if (!posts || posts.length === 0) return [];

  // 2) 작성자 프로필 batch 조회
  const authorIds = [...new Set(posts.map((p) => p.author_id))];
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, nickname, department, school_status, verified_at')
    .in('id', authorIds);

  // 3) 승인된 인증에서 학교명 batch 조회 (user_id별 최신 1건)
  const { data: verifications } = await supabase
    .from('user_verifications')
    .select('user_id, school_name, approved_at')
    .eq('status', 'approved')
    .in('user_id', authorIds)
    .order('approved_at', { ascending: false });

  // 맵 생성
  const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]));
  const verificationMap = new Map<string, string>();
  for (const v of verifications ?? []) {
    if (!verificationMap.has(v.user_id)) verificationMap.set(v.user_id, v.school_name);
  }

  return posts.map((post) =>
    mapBoardPost(post, profileMap.get(post.author_id), verificationMap.get(post.author_id) ?? null)
  );
}

// 게시글 단건 조회
export async function getBoardPost(id: string): Promise<BoardPost | null> {
  if (!isSupabaseConfigured()) {
    return getMockBoardPost(id);
  }

  const supabase = await createClient();
  const { data: post, error } = await supabase.from('board_posts').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  if (!post) return null;

  // 프로필 조회
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, nickname, department, school_status, verified_at')
    .eq('id', post.author_id)
    .maybeSingle();

  // 인증 학교명 조회
  const { data: verification } = await supabase
    .from('user_verifications')
    .select('school_name')
    .eq('user_id', post.author_id)
    .eq('status', 'approved')
    .order('approved_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  return mapBoardPost(post, profile ?? undefined, verification?.school_name ?? null);
}

// 게시글 작성 (인증된 유저만)
export async function createBoardPost(input: {
  authorId: string;
  authorNickname: string;
  title: string;
  content: string;
  isAnonymous: boolean;
  schoolId?: string | null;
  verifiedSchoolName: string;
  department?: string | null;
  schoolStatus?: BoardPost['schoolVerification']['schoolStatus'];
}): Promise<BoardPost> {
  if (!isSupabaseConfigured()) {
    const mock = await import('@/lib/mock/board');
    return mock.addBoardPost({
      authorNickname: input.authorNickname,
      title: input.title,
      content: input.content,
      isAnonymous: input.isAnonymous,
      schoolId: input.schoolId ?? null,
      schoolVerification: {
        isVerified: true,
        schoolName: input.verifiedSchoolName,
        department: input.department ?? null,
        schoolStatus: input.schoolStatus ?? null
      }
    });
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('board_posts')
    .insert({
      author_id: input.authorId,
      title: input.title,
      content: input.content,
      is_anonymous: input.isAnonymous,
      school_id: input.schoolId ?? null
    })
    .select('*')
    .single();

  if (error) throw error;

  return mapBoardPost(
    data,
    {
      nickname: input.authorNickname,
      department: input.department ?? null,
      school_status: input.schoolStatus ?? null,
      verified_at: new Date().toISOString()
    },
    input.verifiedSchoolName
  );
}

// 조회수 증가
export async function incrementBoardPostView(id: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    const mock = await import('@/lib/mock/board');
    return mock.incrementBoardView(id);
  }

  const supabase = await createClient();
  // RLS: select는 all open이므로 rpc 없이 increment 가능 (update own policy 있으나, view는 별도 처리 필요)
  // 간단하게 현재 값 읽고 +1 업데이트 (author check 없이 별도 정책 필요 시 RPC 분리)
  await supabase.rpc('increment_board_view', { post_id: id }).maybeSingle();
}

// 좋아요 토글 (간단 구현: like_count만 증가, 중복 방지는 별도 테이블 필요 시 추후 추가)
export async function likeBoardPostDb(id: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    const mock = await import('@/lib/mock/board');
    return mock.likeBoardPost(id);
  }
  const supabase = await createClient();
  const { data: post } = await supabase.from('board_posts').select('like_count').eq('id', id).maybeSingle();
  if (post) {
    await supabase.from('board_posts').update({ like_count: post.like_count + 1 }).eq('id', id);
  }
}

// ────────────────────────────────────────────────────────────────
// 게시판 댓글
// ────────────────────────────────────────────────────────────────

export interface BoardComment {
  id: string;
  postId: string;
  parentId: string | null;
  authorNickname: string;
  mentionNickname: string | null;
  content: string;
  likeCount: number;
  createdAt: string;
  replies: BoardComment[];
}

// DB Row → BoardComment 매핑 (replies는 호출 측에서 조립)
function mapBoardComment(
  row: {
    id: string;
    post_id: string;
    parent_id: string | null;
    mention_nickname: string | null;
    content: string;
    like_count: number;
    created_at: string;
  },
  nickname: string
): BoardComment {
  return {
    id: row.id,
    postId: row.post_id,
    parentId: row.parent_id,
    authorNickname: nickname,
    mentionNickname: row.mention_nickname,
    content: row.content,
    likeCount: row.like_count,
    createdAt: row.created_at,
    replies: []
  };
}

// 댓글 목록 조회 (트리 구조로 조립)
export async function listBoardComments(postId: string): Promise<BoardComment[]> {
  if (!isSupabaseConfigured()) {
    const mock = await import('@/lib/mock/board');
    // mock의 Comment 타입을 BoardComment로 변환
    const mockComments = await mock.getBoardComments(postId);
    return mockComments as unknown as BoardComment[];
  }

  const supabase = await createClient();
  const { data: rows, error } = await supabase
    .from('board_comments')
    .select('*')
    .eq('post_id', postId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  if (!rows || rows.length === 0) return [];

  // 작성자 닉네임 batch 조회
  const authorIds = [...new Set(rows.map((r) => r.author_id))];
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, nickname')
    .in('id', authorIds);
  const profileMap = new Map((profiles ?? []).map((p) => [p.id, p.nickname]));

  // 트리 조립: parent_id 없는 것 → 루트, 있는 것 → replies
  const mapped = rows.map((row) =>
    mapBoardComment(row, profileMap.get(row.author_id) ?? '탈퇴한 유저')
  );
  const rootMap = new Map(mapped.map((c) => [c.id, c]));

  const roots: BoardComment[] = [];
  for (const comment of mapped) {
    if (!comment.parentId) {
      roots.push(comment);
    } else {
      const parent = rootMap.get(comment.parentId);
      if (parent) parent.replies.push(comment);
    }
  }
  return roots;
}

// 댓글 작성 (인증된 유저만 — API 라우트에서 체크)
export async function createBoardComment(input: {
  postId: string;
  authorId: string;
  authorNickname: string;
  parentId?: string | null;
  mentionNickname?: string | null;
  content: string;
}): Promise<BoardComment> {
  if (!isSupabaseConfigured()) {
    const mock = await import('@/lib/mock/board');
    await mock.addBoardComment({
      postId: input.postId,
      parentId: input.parentId ?? null,
      content: input.content,
      authorNickname: input.authorNickname,
      mentionNickname: input.mentionNickname
    });
    const comments = await mock.getBoardComments(input.postId);
    const last = comments[comments.length - 1];
    return last as unknown as BoardComment;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('board_comments')
    .insert({
      post_id: input.postId,
      author_id: input.authorId,
      parent_id: input.parentId ?? null,
      mention_nickname: input.mentionNickname ?? null,
      content: input.content.trim()
    })
    .select('*')
    .single();

  if (error) throw error;

  // comment_count 증가
  await supabase.rpc('increment_board_comment_count', { post_id: input.postId }).maybeSingle();

  return mapBoardComment(data, input.authorNickname);
}

// 댓글 좋아요 (+1)
export async function likeBoardCommentDb(commentId: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    const mock = await import('@/lib/mock/board');
    return mock.likeBoardComment(commentId);
  }

  const supabase = await createClient();
  const { data: comment } = await supabase
    .from('board_comments')
    .select('like_count')
    .eq('id', commentId)
    .maybeSingle();
  if (comment) {
    await supabase
      .from('board_comments')
      .update({ like_count: comment.like_count + 1 })
      .eq('id', commentId);
  }
}
