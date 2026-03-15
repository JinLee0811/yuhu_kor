import { NextResponse, type NextRequest } from 'next/server';
import { fail, ok } from '@/lib/api';
import { reorderEntities } from '@/lib/supabase/repositories/entities';
import { requireAdmin } from '@/lib/supabase/repositories/profiles';

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const body = (await request.json()) as { items?: Array<{ id: string; display_order: number }> };
    if (!body.items?.length) {
      return NextResponse.json(fail('INVALID_REQUEST', '정렬할 유학원 목록이 필요해요.'), { status: 400 });
    }

    await reorderEntities(body.items);
    return NextResponse.json(ok({ success: true }));
  } catch (error) {
    if (error instanceof Error && error.message === 'ADMIN_ONLY') {
      return NextResponse.json(fail('FORBIDDEN', '어드민만 접근할 수 있어요.'), { status: 403 });
    }
    return NextResponse.json(fail('ADMIN_ENTITY_REORDER_FAILED', '유학원 순서 저장에 실패했어요.'), { status: 500 });
  }
}
