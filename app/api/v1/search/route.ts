import { NextResponse, type NextRequest } from 'next/server';
import { entities } from '@/lib/mock-db';
import { ok } from '@/lib/api';

export async function GET(request: NextRequest) {
  const q = (request.nextUrl.searchParams.get('q') ?? '').toLowerCase().trim();
  const category = request.nextUrl.searchParams.get('category');

  const items = entities
    .filter((entity) => (category ? entity.category_id === `cat-${category}` : true))
    .filter((entity) => (q ? entity.name.toLowerCase().includes(q) : true));

  return NextResponse.json(ok({ items, total: items.length }));
}
