import { type NextRequest, NextResponse } from 'next/server';
import { incrementBoardPostView } from '@/lib/supabase/repositories/board';

// POST /api/v1/board/[id]/view — 조회수 증가 (로그인 불필요, 단순 카운터)
export async function POST(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await incrementBoardPostView(params.id);
    return NextResponse.json({ data: null, error: null });
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') console.error('[POST /api/v1/board/[id]/view]', err);
    return NextResponse.json({ data: null, error: { code: 'UPDATE_FAILED', message: '조회수 업데이트에 실패했습니다.' } }, { status: 500 });
  }
}
