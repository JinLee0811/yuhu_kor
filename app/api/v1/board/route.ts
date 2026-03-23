import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { listBoardPosts, createBoardPost } from '@/lib/supabase/repositories/board';
import { getLatestVerification } from '@/lib/supabase/repositories/verifications';
import type { BoardPost } from '@/types/board';

// GET /api/v1/board?school_id=xxx
export async function GET(request: NextRequest) {
  try {
    const schoolId = request.nextUrl.searchParams.get('school_id') || null;
    const posts = await listBoardPosts(schoolId);
    return NextResponse.json({ data: posts, error: null });
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') console.error('[GET /api/v1/board]', err);
    return NextResponse.json({ data: null, error: { code: 'FETCH_FAILED', message: '게시글을 불러오지 못했습니다.' } }, { status: 500 });
  }
}

// POST /api/v1/board
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ data: null, error: { code: 'UNAUTHORIZED', message: '로그인이 필요합니다.' } }, { status: 401 });
    }

    // 인증(verification) 확인
    const verification = await getLatestVerification(user.id);
    if (!verification || verification.status !== 'approved') {
      return NextResponse.json({ data: null, error: { code: 'FORBIDDEN', message: '인증된 유학생만 글을 작성할 수 있습니다.' } }, { status: 403 });
    }

    // 프로필에서 닉네임 조회
    const { data: profile } = await supabase
      .from('profiles')
      .select('nickname, department, school_status')
      .eq('id', user.id)
      .maybeSingle();

    const body = await request.json();
    const { title, content, isAnonymous, schoolId } = body as {
      title: string;
      content: string;
      isAnonymous: boolean;
      schoolId?: string | null;
    };

    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json(
        { data: null, error: { code: 'INVALID_INPUT', message: '제목과 내용을 입력해주세요.' } },
        { status: 400 }
      );
    }

    const post = await createBoardPost({
      authorId: user.id,
      authorNickname: profile?.nickname ?? '유학생',
      title: title.trim().slice(0, 100),
      content: content.trim().slice(0, 2000),
      isAnonymous,
      schoolId: schoolId ?? null,
      verifiedSchoolName: verification.schoolName,
      department: profile?.department ?? null,
      schoolStatus: (profile?.school_status as BoardPost['schoolVerification']['schoolStatus']) ?? null
    });

    return NextResponse.json({ data: post, error: null }, { status: 201 });
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') console.error('[POST /api/v1/board]', err);
    return NextResponse.json(
      { data: null, error: { code: 'CREATE_FAILED', message: '게시글 작성에 실패했습니다.' } },
      { status: 500 }
    );
  }
}
