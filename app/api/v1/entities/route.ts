import { NextResponse, type NextRequest } from 'next/server';
import { ok } from '@/lib/api';
import { listEntities } from '@/lib/supabase/repositories/entities';

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const specialty = params.get('specialty');
  const city = params.get('city');
  const minScore = Number(params.get('min_score') ?? '0');
  const sort = (params.get('sort') ?? 'display_order') as 'display_order' | 'review_count' | 'score_desc' | 'latest';
  const page = Number(params.get('page') ?? '1');
  const limit = Number(params.get('limit') ?? '10');
  const q = (params.get('q') ?? '').trim().toLowerCase();

  const result = await listEntities({
    q,
    specialty: specialty ?? undefined,
    city: city ?? undefined,
    min_score: minScore,
    sort,
    page,
    limit
  });

  return NextResponse.json(
    ok({
      items: result.items,
      total: result.total,
      nextPage: result.nextPage
    })
  );
}
