import { NextResponse, type NextRequest } from 'next/server';
import { fail, ok } from '@/lib/api';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/env';
import { updateReviewForUser } from '@/lib/supabase/repositories/reviews';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = (await request.json()) as {
      summary?: string;
      pros?: string;
      cons?: string;
    };

    if (!body.summary?.trim() || !body.pros?.trim() || !body.cons?.trim()) {
      return NextResponse.json(fail('INVALID_REQUEST', '요약, 장점, 아쉬운 점을 모두 입력해줘요.'), { status: 400 });
    }

    if (body.pros.trim().length < 20 || body.cons.trim().length < 20 || body.summary.trim().length > 100) {
      return NextResponse.json(fail('INVALID_REVIEW_TEXT', '후기 입력 조건을 확인해줘요.'), { status: 400 });
    }

    if (!isSupabaseConfigured()) {
      const updated = await updateReviewForUser(params.id, 'mock-user-1', {
        summary: body.summary.trim(),
        pros: body.pros.trim(),
        cons: body.cons.trim()
      });
      if (!updated) {
        return NextResponse.json(fail('REVIEW_NOT_FOUND', '수정할 후기를 찾지 못했어요.'), { status: 404 });
      }
      return NextResponse.json(ok(updated));
    }

    const supabase = await createClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(fail('UNAUTHORIZED', '로그인이 필요해요.'), { status: 401 });
    }

    const updated = await updateReviewForUser(params.id, user.id, {
      summary: body.summary.trim(),
      pros: body.pros.trim(),
      cons: body.cons.trim()
    });

    if (!updated) {
      return NextResponse.json(fail('REVIEW_NOT_FOUND', '본인 후기만 수정할 수 있어요.'), { status: 404 });
    }

    return NextResponse.json(ok(updated));
  } catch {
    return NextResponse.json(fail('REVIEW_UPDATE_FAILED', '후기 수정에 실패했어요.'), { status: 500 });
  }
}
