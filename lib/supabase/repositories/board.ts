import 'server-only';

import type { BoardPost } from '@/types/board';
import { isSupabaseConfigured } from '@/lib/supabase/env';
import { mockBoardPosts } from '@/lib/mock/board';

export async function listBoardPostsDraft() {
  if (!isSupabaseConfigured()) {
    return mockBoardPosts;
  }

  // Phase 2: board_posts + board_comments + school verification join으로 대체 예정
  return [] as BoardPost[];
}

export async function getBoardPostDraft(id: string) {
  if (!isSupabaseConfigured()) {
    return mockBoardPosts.find((post) => post.id === id) ?? null;
  }

  // Phase 2: author profile, school verification, 댓글 집계 포함 상세 조회 예정
  return null as BoardPost | null;
}
