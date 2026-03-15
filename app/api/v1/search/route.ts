import { NextResponse, type NextRequest } from 'next/server';
import { ok } from '@/lib/api';
import { searchEntities } from '@/lib/supabase/repositories/entities';

export async function GET(request: NextRequest) {
  const q = (request.nextUrl.searchParams.get('q') ?? '').toLowerCase().trim();
  void request.nextUrl.searchParams.get('category');
  const items = q ? await searchEntities(q) : [];

  return NextResponse.json(ok({ items, total: items.length }));
}
