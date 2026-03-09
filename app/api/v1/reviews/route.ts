import { NextResponse, type NextRequest } from 'next/server';
import { reviews } from '@/lib/mock-db';
import { fail, ok } from '@/lib/api';
import { calculateWeightedScore } from '@/lib/utils/score';
import { generateAnonymousNickname } from '@/lib/utils/nickname';
import type { Review, ReviewType } from '@/types/review';
import { REVIEW_SCHEMAS } from '@/lib/constants/reviewSchema';

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

    const score_total = calculateWeightedScore(scores, REVIEW_SCHEMAS[review_type]);
    const now = new Date().toISOString();

    const review: Review = {
      id: `rev-${Date.now()}`,
      entity_id,
      review_type,
      user_id: 'user-1',
      nickname: generateAnonymousNickname(),
      scores,
      score_total,
      pros,
      cons,
      summary,
      meta: (meta ?? {}) as Review['meta'],
      helpful_count: 0,
      is_anonymous: true,
      is_hidden: false,
      is_verified_review: Boolean(is_verified_review),
      is_social_verified: true,
      status: 'published',
      created_at: now,
      updated_at: now
    };

    reviews.unshift(review);
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

  const index = reviews.findIndex((review) => review.id === id && review.user_id === 'user-1');
  if (index === -1) {
    return NextResponse.json(fail('REVIEW_NOT_FOUND', '삭제할 후기를 찾을 수 없어요.'), { status: 404 });
  }

  const [removed] = reviews.splice(index, 1);
  return NextResponse.json(ok({ id: removed.id }));
}
