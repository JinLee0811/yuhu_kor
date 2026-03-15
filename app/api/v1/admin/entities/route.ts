import { NextResponse, type NextRequest } from 'next/server';
import { fail, ok } from '@/lib/api';
import { createEntity, listEntities, type EntityAdminInput } from '@/lib/supabase/repositories/entities';
import { requireAdmin } from '@/lib/supabase/repositories/profiles';

export async function GET() {
  try {
    await requireAdmin();
    const result = await listEntities({ page: 1, limit: 500, sort: 'display_order' });
    return NextResponse.json(ok(result));
  } catch (error) {
    if (error instanceof Error && error.message === 'ADMIN_ONLY') {
      return NextResponse.json(fail('FORBIDDEN', '어드민만 접근할 수 있어요.'), { status: 403 });
    }
    return NextResponse.json(fail('ADMIN_ENTITIES_LOAD_FAILED', '유학원 관리 목록을 불러오지 못했어요.'), { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const body = (await request.json()) as Partial<EntityAdminInput>;
    if (!body.name?.trim() || !body.slug?.trim()) {
      return NextResponse.json(fail('INVALID_REQUEST', '이름과 slug는 꼭 필요해요.'), { status: 400 });
    }

    const created = await createEntity({
      slug: body.slug,
      name: body.name,
      description: body.description,
      website: body.website,
      phone: body.phone,
      email: body.email,
      logo_url: body.logo_url,
      headquarters_country: body.headquarters_country,
      headquarters_address: body.headquarters_address,
      coverage_cities: body.coverage_cities ?? [],
      coverage_countries: body.coverage_countries ?? ['AU'],
      specialties: body.specialties ?? [],
      tags: body.tags ?? [],
      is_verified: Boolean(body.is_verified),
      qeac_verified: Boolean(body.qeac_verified),
      is_claimed: Boolean(body.is_claimed),
      display_order: Number(body.display_order ?? 0),
      sns_links: body.sns_links ?? {}
    });

    return NextResponse.json(ok(created), { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === 'ADMIN_ONLY') {
      return NextResponse.json(fail('FORBIDDEN', '어드민만 접근할 수 있어요.'), { status: 403 });
    }
    return NextResponse.json(fail('ADMIN_ENTITY_CREATE_FAILED', '유학원 생성에 실패했어요.'), { status: 500 });
  }
}
