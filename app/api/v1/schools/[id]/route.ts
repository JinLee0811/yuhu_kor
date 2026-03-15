import { NextResponse } from 'next/server';
import { ok, fail } from '@/lib/api';
import { getSchoolById } from '@/lib/supabase/repositories/schools';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const school = await getSchoolById(params.id);
    if (!school) {
      return NextResponse.json(fail('SCHOOL_NOT_FOUND', '학교를 찾을 수 없어요.'), { status: 404 });
    }
    return NextResponse.json(ok(school));
  } catch {
    return NextResponse.json(fail('SCHOOL_LOAD_FAILED', '학교 정보를 불러오지 못했어요.'), { status: 500 });
  }
}
