import { NextResponse, type NextRequest } from 'next/server';
import { fail, ok } from '@/lib/api';
import { requireAdmin } from '@/lib/supabase/repositories/profiles';
import { getSchoolById } from '@/lib/supabase/repositories/schools';
import { mockSchools } from '@/lib/mock/schools';
import { isSupabaseConfigured } from '@/lib/supabase/env';
import type { School } from '@/types/school';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const item = await getSchoolById(id);
    if (!item) {
      return NextResponse.json(fail('NOT_FOUND', '학교를 찾을 수 없어요.'), { status: 404 });
    }
    return NextResponse.json(ok(item));
  } catch (error) {
    if (error instanceof Error && error.message === 'ADMIN_ONLY') {
      return NextResponse.json(fail('FORBIDDEN', '어드민만 접근할 수 있어요.'), { status: 403 });
    }
    return NextResponse.json(fail('SCHOOL_LOAD_FAILED', '학교 정보를 불러오지 못했어요.'), { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = (await request.json()) as Partial<School>;

    if (!isSupabaseConfigured()) {
      const idx = mockSchools.findIndex((s) => s.id === id);
      if (idx === -1) {
        return NextResponse.json(fail('NOT_FOUND', '학교를 찾을 수 없어요.'), { status: 404 });
      }
      mockSchools[idx] = { ...mockSchools[idx], ...body, id };
      return NextResponse.json(ok(mockSchools[idx]));
    }

    // TODO: Supabase 연동 시 구현
    return NextResponse.json(fail('NOT_IMPLEMENTED', 'Supabase 연동 후 사용 가능해요.'), { status: 501 });
  } catch (error) {
    if (error instanceof Error && error.message === 'ADMIN_ONLY') {
      return NextResponse.json(fail('FORBIDDEN', '어드민만 접근할 수 있어요.'), { status: 403 });
    }
    return NextResponse.json(fail('SCHOOL_UPDATE_FAILED', '학교 수정에 실패했어요.'), { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;

    if (!isSupabaseConfigured()) {
      const idx = mockSchools.findIndex((s) => s.id === id);
      if (idx === -1) {
        return NextResponse.json(fail('NOT_FOUND', '학교를 찾을 수 없어요.'), { status: 404 });
      }
      mockSchools.splice(idx, 1);
      return NextResponse.json(ok({ id }));
    }

    // TODO: Supabase 연동 시 구현
    return NextResponse.json(fail('NOT_IMPLEMENTED', 'Supabase 연동 후 사용 가능해요.'), { status: 501 });
  } catch (error) {
    if (error instanceof Error && error.message === 'ADMIN_ONLY') {
      return NextResponse.json(fail('FORBIDDEN', '어드민만 접근할 수 있어요.'), { status: 403 });
    }
    return NextResponse.json(fail('SCHOOL_DELETE_FAILED', '학교 삭제에 실패했어요.'), { status: 500 });
  }
}
