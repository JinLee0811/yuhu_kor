import { NextResponse, type NextRequest } from 'next/server';
import { fail, ok } from '@/lib/api';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/env';
import { getReviewById, incrementReviewHelpful } from '@/lib/supabase/repositories/reviews';

export async function POST(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // 로그인 확인 (비로그인 어뷰징 방지)
    if (isSupabaseConfigured()) {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return NextResponse.json(fail('UNAUTHORIZED', '로그인 후 도움 표시를 할 수 있어요.'), { status: 401 });
      }
    }

    const review = await getReviewById(id);
    if (!review) {
      return NextResponse.json(fail('REVIEW_NOT_FOUND', '후기를 찾을 수 없어요.'), { status: 404 });
    }

    await incrementReviewHelpful(id);
    return NextResponse.json(ok({ id: review.id, helpful_count: review.helpful_count + 1 }));
  } catch {
    return NextResponse.json(fail('REVIEW_HELPFUL_FAILED', '도움 반영 중 오류가 발생했어요.'), { status: 500 });
  }
}
