import { type NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/supabase/repositories/profiles';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/env';
import { mockBoardPosts } from '@/lib/mock/board';

// DELETE /api/v1/admin/board/[id] — 게시글 삭제
export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();

    if (!isSupabaseConfigured()) {
      // mock 모드: 배열에서 제거
      const idx = mockBoardPosts.findIndex((p) => p.id === params.id);
      if (idx === -1) {
        return NextResponse.json({ data: null, error: { code: 'NOT_FOUND', message: '게시글을 찾을 수 없습니다.' } }, { status: 404 });
      }
      mockBoardPosts.splice(idx, 1);
      return NextResponse.json({ data: { id: params.id }, error: null });
    }

    const supabase = await createClient();
    const { error } = await supabase.from('board_posts').delete().eq('id', params.id);

    if (error) throw error;

    return NextResponse.json({ data: { id: params.id }, error: null });
  } catch (err) {
    if (err instanceof Error && err.message === 'ADMIN_ONLY') {
      return NextResponse.json({ data: null, error: { code: 'FORBIDDEN', message: '어드민만 접근 가능합니다.' } }, { status: 403 });
    }
    if (process.env.NODE_ENV !== 'production') console.error('[DELETE /api/v1/admin/board/[id]]', err);
    return NextResponse.json({ data: null, error: { code: 'DELETE_FAILED', message: '삭제에 실패했습니다.' } }, { status: 500 });
  }
}

// PATCH /api/v1/admin/board/[id] — 게시글 숨김 처리 (is_hidden 추가 전 임시: 콘텐츠 블라인드)
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();

    const body = await request.json();
    const { action } = body as { action: 'delete' };

    if (action === 'delete') {
      // PATCH로 들어와도 삭제 처리
      if (!isSupabaseConfigured()) {
        const idx = mockBoardPosts.findIndex((p) => p.id === params.id);
        if (idx !== -1) mockBoardPosts.splice(idx, 1);
        return NextResponse.json({ data: { id: params.id }, error: null });
      }
      const supabase = await createClient();
      const { error } = await supabase.from('board_posts').delete().eq('id', params.id);
      if (error) throw error;
      return NextResponse.json({ data: { id: params.id }, error: null });
    }

    return NextResponse.json({ data: null, error: { code: 'INVALID_ACTION', message: '알 수 없는 액션입니다.' } }, { status: 400 });
  } catch (err) {
    if (err instanceof Error && err.message === 'ADMIN_ONLY') {
      return NextResponse.json({ data: null, error: { code: 'FORBIDDEN', message: '어드민만 접근 가능합니다.' } }, { status: 403 });
    }
    if (process.env.NODE_ENV !== 'production') console.error('[PATCH /api/v1/admin/board/[id]]', err);
    return NextResponse.json({ data: null, error: { code: 'ACTION_FAILED', message: '처리에 실패했습니다.' } }, { status: 500 });
  }
}
