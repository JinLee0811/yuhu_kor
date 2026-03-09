import { NextResponse } from 'next/server';
import { reviews, myUserId } from '@/lib/mock-db';
import { ok } from '@/lib/api';

export async function GET() {
  const items = reviews.filter((review) => review.user_id === myUserId && !review.is_hidden);
  return NextResponse.json(ok({ items, total: items.length }));
}
