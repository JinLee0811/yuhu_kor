import { NextResponse } from 'next/server';
import { fail, ok } from '@/lib/api';
import { getReviewCardDetail } from '@/lib/supabase/repositories/reviews';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const review = await getReviewCardDetail(params.id);
    if (!review) {
      return NextResponse.json(fail('REVIEW_NOT_FOUND', '후기를 찾을 수 없어요.'), { status: 404 });
    }

    return NextResponse.json(ok(review));
  } catch {
    return NextResponse.json(fail('REVIEW_LOAD_FAILED', '후기를 불러오지 못했어요.'), { status: 500 });
  }
}
