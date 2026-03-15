import { NextResponse } from 'next/server';
import { fail, ok } from '@/lib/api';
import { getReviewById, incrementReviewHelpful } from '@/lib/supabase/repositories/reviews';

export async function POST(_: Request, { params }: { params: { id: string } }) {
  try {
    const review = await getReviewById(params.id);
    if (!review) {
      return NextResponse.json(fail('REVIEW_NOT_FOUND', '후기를 찾을 수 없어요.'), { status: 404 });
    }

    await incrementReviewHelpful(params.id);
    return NextResponse.json(ok({ id: review.id, helpful_count: review.helpful_count + 1 }));
  } catch {
    return NextResponse.json(fail('REVIEW_HELPFUL_FAILED', '도움 반영 중 오류가 발생했어요.'), { status: 500 });
  }
}
