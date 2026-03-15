import { NextResponse } from 'next/server';
import { fail, ok } from '@/lib/api';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/env';
import { getReviewById, reportReview } from '@/lib/supabase/repositories/reviews';

export async function POST(_: Request, { params }: { params: { id: string } }) {
  try {
    const review = await getReviewById(params.id);
    if (!review) {
      return NextResponse.json(fail('REVIEW_NOT_FOUND', '후기를 찾을 수 없어요.'), { status: 404 });
    }

    if (!isSupabaseConfigured()) {
      await reportReview(review.id, 'mock-user-1');
      return NextResponse.json(ok({ id: review.id, reported: true }));
    }

    const supabase = await createClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(fail('UNAUTHORIZED', '로그인이 필요해요.'), { status: 401 });
    }

    await reportReview(review.id, user.id);
    return NextResponse.json(ok({ id: review.id, reported: true }));
  } catch {
    return NextResponse.json(fail('REVIEW_REPORT_FAILED', '신고 처리 중 오류가 발생했어요.'), { status: 500 });
  }
}
