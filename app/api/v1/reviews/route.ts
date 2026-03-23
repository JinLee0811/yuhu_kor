import { NextResponse, type NextRequest } from 'next/server';
import { fail, ok } from '@/lib/api';
import type { ReviewMeta, ReviewType } from '@/types/review';
import { createClient } from '@/lib/supabase/server';
import { createNicknameForUser, createReviewForUser, deleteReviewForUser } from '@/lib/supabase/repositories/reviews';
import { ensureProfile } from '@/lib/supabase/repositories/profiles';
import { isSupabaseConfigured } from '@/lib/supabase/env';
import { isPendingNickname } from '@/lib/profile/nickname';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { entity_id, review_type, scores, pros, cons, summary, meta, is_verified_review } = body as {
      entity_id?: string;
      review_type?: ReviewType;
      scores?: Record<string, number>;
      pros?: string;
      cons?: string;
      summary?: string;
      meta?: Record<string, unknown>;
      is_verified_review?: boolean;
    };

    if (!entity_id || !review_type || !scores || !pros || !cons || !summary) {
      return NextResponse.json(fail('INVALID_REQUEST', '필수 항목이 누락됐어요.'), { status: 400 });
    }

    if (pros.trim().length < 20 || cons.trim().length < 20 || summary.length > 100) {
      return NextResponse.json(fail('INVALID_REVIEW_TEXT', '후기 입력 조건을 확인해줘요.'), { status: 400 });
    }

    if (!isSupabaseConfigured()) {
      const review = await createReviewForUser('mock-user-1', createNicknameForUser(), {
        entity_id,
        review_type,
        scores,
        pros,
        cons,
        summary,
        meta: (meta ?? {}) as ReviewMeta,
        is_verified_review: Boolean(is_verified_review)
      });
      return NextResponse.json(ok(review), { status: 201 });
    }

    const supabase = await createClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(fail('UNAUTHORIZED', '로그인이 필요해요.'), { status: 401 });
    }

    const profile = await ensureProfile(user);
    if (isPendingNickname(profile.nickname)) {
      return NextResponse.json(fail('NICKNAME_REQUIRED', '후기를 남기려면 먼저 닉네임을 설정해줘요.'), { status: 400 });
    }

    // is_verified_review는 클라이언트 값을 신뢰하지 않고 서버에서 직접 확인
    const { data: verification } = await supabase
      .from('user_verifications')
      .select('status')
      .eq('user_id', user.id)
      .eq('status', 'approved')
      .maybeSingle();
    const verifiedByServer = Boolean(verification);

    const review = await createReviewForUser(user.id, profile.nickname, {
      entity_id,
      review_type,
      scores,
      pros,
      cons,
      summary,
      meta: (meta ?? {}) as ReviewMeta,
      is_verified_review: verifiedByServer
    });

    return NextResponse.json(ok(review), { status: 201 });
  } catch {
    return NextResponse.json(fail('SERVER_ERROR', '후기 작성 중 오류가 발생했어요.'), { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id');
  if (!id) {
    return NextResponse.json(fail('INVALID_REQUEST', '후기 id가 필요해요.'), { status: 400 });
  }

  if (!isSupabaseConfigured()) {
    const removed = await deleteReviewForUser(id, 'mock-user-1');
    if (!removed) {
      return NextResponse.json(fail('REVIEW_NOT_FOUND', '삭제할 후기를 찾을 수 없어요.'), { status: 404 });
    }
    return NextResponse.json(ok({ id: removed.id }));
  }

  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(fail('UNAUTHORIZED', '로그인이 필요해요.'), { status: 401 });
  }

  const removed = await deleteReviewForUser(id, user.id);
  if (!removed) {
    return NextResponse.json(fail('REVIEW_NOT_FOUND', '삭제할 후기를 찾을 수 없어요.'), { status: 404 });
  }
  return NextResponse.json(ok({ id: removed.id }));
}
