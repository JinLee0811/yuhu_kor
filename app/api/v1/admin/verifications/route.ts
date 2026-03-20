import { NextResponse, type NextRequest } from 'next/server';
import { fail, ok } from '@/lib/api';
import { requireAdmin } from '@/lib/supabase/repositories/profiles';
import { listAdminVerifications } from '@/lib/supabase/repositories/admin-verifications';

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') ?? 'all';
    const items = await listAdminVerifications(status);
    return NextResponse.json(ok({ items, total: items.length }));
  } catch (error) {
    if (error instanceof Error && error.message === 'ADMIN_ONLY') {
      return NextResponse.json(fail('FORBIDDEN', '어드민만 접근할 수 있어요.'), { status: 403 });
    }
    return NextResponse.json(fail('VERIFICATIONS_LOAD_FAILED', '인증 목록을 불러오지 못했어요.'), { status: 500 });
  }
}
