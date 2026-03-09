import { NextResponse } from 'next/server';
import { reviews } from '@/lib/mock-db';
import { fail, ok } from '@/lib/api';

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const review = reviews.find((item) => item.id === params.id);
  if (!review) {
    return NextResponse.json(fail('REVIEW_NOT_FOUND', '후기를 찾을 수 없어요.'), { status: 404 });
  }

  review.helpful_count += 1;
  return NextResponse.json(ok({ id: review.id, helpful_count: review.helpful_count }));
}
