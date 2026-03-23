import { NextResponse, type NextRequest } from 'next/server';
import { fail, ok } from '@/lib/api';
import { requireAdmin } from '@/lib/supabase/repositories/profiles';
import { getSchoolById, updateSchool, deleteSchool } from '@/lib/supabase/repositories/schools';
import type { SchoolInput } from '@/lib/supabase/repositories/schools';

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
    const body = await request.json() as Partial<SchoolInput>;

    const updated = await updateSchool(id, body);
    return NextResponse.json(ok(updated));
  } catch (error) {
    if (error instanceof Error && error.message === 'ADMIN_ONLY') {
      return NextResponse.json(fail('FORBIDDEN', '어드민만 접근할 수 있어요.'), { status: 403 });
    }
    if (error instanceof Error && error.message === 'NOT_FOUND') {
      return NextResponse.json(fail('NOT_FOUND', '학교를 찾을 수 없어요.'), { status: 404 });
    }
    if (process.env.NODE_ENV !== 'production') console.error('[PATCH /api/v1/admin/schools/[id]]', error);
    return NextResponse.json(fail('SCHOOL_UPDATE_FAILED', '학교 수정에 실패했어요.'), { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;

    await deleteSchool(id);
    return NextResponse.json(ok({ id }));
  } catch (error) {
    if (error instanceof Error && error.message === 'ADMIN_ONLY') {
      return NextResponse.json(fail('FORBIDDEN', '어드민만 접근할 수 있어요.'), { status: 403 });
    }
    if (error instanceof Error && error.message === 'NOT_FOUND') {
      return NextResponse.json(fail('NOT_FOUND', '학교를 찾을 수 없어요.'), { status: 404 });
    }
    if (process.env.NODE_ENV !== 'production') console.error('[DELETE /api/v1/admin/schools/[id]]', error);
    return NextResponse.json(fail('SCHOOL_DELETE_FAILED', '학교 삭제에 실패했어요.'), { status: 500 });
  }
}
