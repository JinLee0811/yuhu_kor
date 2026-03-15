import { NextResponse, type NextRequest } from 'next/server';
import { fail, ok } from '@/lib/api';
import { getEntityByIdOrSlug } from '@/lib/supabase/repositories/entities';

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const entity = await getEntityByIdOrSlug(params.id);
  if (!entity) {
    return NextResponse.json(fail('ENTITY_NOT_FOUND', '업체를 찾을 수 없어요.'), { status: 404 });
  }
  return NextResponse.json(ok(entity));
}
