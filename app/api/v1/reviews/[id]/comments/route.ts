import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { listReviewComments, createReviewComment } from '@/lib/supabase/repositories/reviews';

// GET /api/v1/reviews/[id]/comments — 댓글 목록 (로그인 필요)
export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user && process.env.NODE_ENV === 'production') {
      return NextResponse.json({ data: null, error: { code: 'UNAUTHORIZED', message: '로그인이 필요합니다.' } }, { status: 401 });
    }

    const comments = await listReviewComments(params.id);
    return NextResponse.json({ data: comments, error: null });
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') console.error('[GET /api/v1/reviews/[id]/comments]', err);
    return NextResponse.json({ data: null, error: { code: 'FETCH_FAILED', message: '댓글을 불러오지 못했습니다.' } }, { status: 500 });
  }
}

// POST /api/v1/reviews/[id]/comments — 댓글 작성 (로그인 + 인증 필요)
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ data: null, error: { code: 'UNAUTHORIZED', message: '로그인이 필요합니다.' } }, { status: 401 });
    }

    // 인증 확인 (어드민은 통과)
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, verification_status, nickname')
      .eq('id', user.id)
      .maybeSingle();

    if (profile?.role !== 'admin' && profile?.verification_status !== 'approved') {
      return NextResponse.json({ data: null, error: { code: 'FORBIDDEN', message: '인증된 유학생만 댓글을 작성할 수 있습니다.' } }, { status: 403 });
    }

    const body = await request.json() as { content: string; parentId?: string | null; mentionNickname?: string | null };
    const { content, parentId, mentionNickname } = body;

    if (!content?.trim()) {
      return NextResponse.json({ data: null, error: { code: 'INVALID_INPUT', message: '댓글 내용을 입력해주세요.' } }, { status: 400 });
    }

    const comment = await createReviewComment({
      reviewId: params.id,
      authorId: user.id,
      authorNickname: profile?.nickname ?? '유학생',
      parentId: parentId ?? null,
      mentionNickname: mentionNickname ?? null,
      content: content.trim().slice(0, 500)
    });

    return NextResponse.json({ data: comment, error: null }, { status: 201 });
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') console.error('[POST /api/v1/reviews/[id]/comments]', err);
    return NextResponse.json({ data: null, error: { code: 'CREATE_FAILED', message: '댓글 작성에 실패했습니다.' } }, { status: 500 });
  }
}
