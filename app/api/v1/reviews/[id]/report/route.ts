import { NextResponse } from 'next/server';
import { fail, ok } from '@/lib/api';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/env';
import { getReviewById, reportReview } from '@/lib/supabase/repositories/reviews';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = (await request.json().catch(() => ({}))) as { reason?: string };
    const reason = body.reason?.trim() || '기타';

    const review = await getReviewById(id);
    if (!review) {
      return NextResponse.json(fail('REVIEW_NOT_FOUND', '후기를 찾을 수 없어요.'), { status: 404 });
    }

    if (!isSupabaseConfigured()) {
      await reportReview(review.id, 'mock-user-1', reason);
      return NextResponse.json(ok({ id: review.id, reported: true }));
    }

    const supabase = await createClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(fail('UNAUTHORIZED', '로그인이 필요해요.'), { status: 401 });
    }

    await reportReview(review.id, user.id, reason);
    return NextResponse.json(ok({ id: review.id, reported: true }));
  } catch (error) {
    // 중복 신고 (unique constraint 위반)
    const errMsg = error instanceof Error ? error.message : String(error);
    if (errMsg.includes('23505') || errMsg.includes('duplicate')) {
      return NextResponse.json(fail('ALREADY_REPORTED', '이미 신고한 후기예요.'), { status: 409 });
    }
    return NextResponse.json(fail('REVIEW_REPORT_FAILED', '신고 처리 중 오류가 발생했어요.'), { status: 500 });
  }
}
