import { NextResponse } from 'next/server';
import { ok, fail } from '@/lib/api';
import { listSchools } from '@/lib/supabase/repositories/schools';
import { getSchoolStats } from '@/lib/supabase/repositories/aggregations';

export async function GET() {
  try {
    const items = await listSchools();
    const statsEntries = await Promise.all(items.map(async (school) => [school.id, await getSchoolStats(school.id)] as const));
    const statsById = Object.fromEntries(statsEntries);
    return NextResponse.json(ok({ items, statsById, total: items.length }));
  } catch {
    return NextResponse.json(fail('SCHOOLS_LOAD_FAILED', '학교 목록을 불러오지 못했어요.'), { status: 500 });
  }
}
