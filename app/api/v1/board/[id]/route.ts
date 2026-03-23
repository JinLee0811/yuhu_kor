import { type NextRequest, NextResponse } from 'next/server';
import { getBoardPost } from '@/lib/supabase/repositories/board';

// GET /api/v1/board/[id]
export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const post = await getBoardPost(params.id);
    if (!post) {
      return NextResponse.json({ data: null, error: { code: 'NOT_FOUND', message: '게시글을 찾을 수 없습니다.' } }, { status: 404 });
    }
    return NextResponse.json({ data: post, error: null });
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') console.error('[GET /api/v1/board/[id]]', err);
    return NextResponse.json(
      { data: null, error: { code: 'FETCH_FAILED', message: '게시글을 불러오지 못했습니다.' } },
      { status: 500 }
    );
  }
}
