import { NextResponse, type NextRequest } from 'next/server';
import { ok } from '@/lib/api';
import { listEntityReviews } from '@/lib/supabase/repositories/reviews';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const sort = (request.nextUrl.searchParams.get('sort') ?? 'latest') as 'latest' | 'helpful';
  const type = request.nextUrl.searchParams.get('type') ?? undefined;
  const result = await listEntityReviews(params.id, type ?? undefined, sort);
  return NextResponse.json(ok(result));
}
