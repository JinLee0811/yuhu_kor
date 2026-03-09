import { NextResponse, type NextRequest } from 'next/server';
import { entities } from '@/lib/mock-db';
import { fail, ok } from '@/lib/api';

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const entity = entities.find((item) => item.id === params.id || item.slug === params.id);
  if (!entity) {
    return NextResponse.json(fail('ENTITY_NOT_FOUND', '업체를 찾을 수 없어요.'), { status: 404 });
  }
  return NextResponse.json(ok(entity));
}
