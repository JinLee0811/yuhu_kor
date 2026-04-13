import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { likeBoardCommentDb } from '@/lib/supabase/repositories/board';

// POST /api/v1/board/comments/[commentId]/like — 댓글 좋아요 (로그인 필요)
export async function POST(_request: NextRequest, { params }: { params: { commentId: string } }) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ data: null, error: { code: 'UNAUTHORIZED', message: '로그인이 필요합니다.' } }, { status: 401 });
    }

    await likeBoardCommentDb(params.commentId);
    return NextResponse.json({ data: null, error: null });
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') console.error('[POST /api/v1/board/comments/[commentId]/like]', err);
    return NextResponse.json({ data: null, error: { code: 'UPDATE_FAILED', message: '댓글 좋아요 처리에 실패했습니다.' } }, { status: 500 });
  }
}
