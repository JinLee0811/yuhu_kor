import { NextResponse, type NextRequest } from 'next/server';
import { fail, ok } from '@/lib/api';
import { requireAdmin } from '@/lib/supabase/repositories/profiles';
import { listSchools, createSchool } from '@/lib/supabase/repositories/schools';
import type { SchoolInput } from '@/lib/supabase/repositories/schools';

export async function GET() {
  try {
    await requireAdmin();
    const items = await listSchools();
    return NextResponse.json(ok(items));
  } catch (error) {
    if (error instanceof Error && error.message === 'ADMIN_ONLY') {
      return NextResponse.json(fail('FORBIDDEN', '어드민만 접근할 수 있어요.'), { status: 403 });
    }
    return NextResponse.json(fail('SCHOOLS_LOAD_FAILED', '학교 목록을 불러오지 못했어요.'), { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json() as SchoolInput;

    if (!body.name?.trim()) {
      return NextResponse.json(fail('INVALID_REQUEST', '학교 이름은 꼭 입력해 주세요.'), { status: 400 });
    }

    const school = await createSchool({
      name: body.name,
      type: body.type ?? 'university',
      city: body.city ?? '시드니',
      description: body.description ?? '',
      fields: body.fields ?? [],
      address: body.address ?? '',
      website: body.website ?? '',
      tuitionRange: body.tuitionRange ?? '',
      intakePeriods: body.intakePeriods ?? [],
      cricosCode: body.cricosCode ?? null,
      programs: body.programs ?? [],
      featureTags: body.featureTags ?? [],
      logoText: body.logoText,
      ieltsRequirement: body.ieltsRequirement,
      qsRanking: body.qsRanking,
      scholarships: body.scholarships ?? []
    });

    return NextResponse.json(ok(school), { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === 'ADMIN_ONLY') {
      return NextResponse.json(fail('FORBIDDEN', '어드민만 접근할 수 있어요.'), { status: 403 });
    }
    if (process.env.NODE_ENV !== 'production') console.error('[POST /api/v1/admin/schools]', error);
    return NextResponse.json(fail('SCHOOL_CREATE_FAILED', '학교 생성에 실패했어요.'), { status: 500 });
  }
}
