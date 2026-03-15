import { NextResponse, type NextRequest } from 'next/server';
import { fail, ok } from '@/lib/api';
import { deleteEntity, updateEntity, type EntityAdminInput } from '@/lib/supabase/repositories/entities';
import { requireAdmin } from '@/lib/supabase/repositories/profiles';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
    const body = (await request.json()) as Partial<EntityAdminInput>;
    if (!body.name?.trim() || !body.slug?.trim()) {
      return NextResponse.json(fail('INVALID_REQUEST', '이름과 slug는 꼭 필요해요.'), { status: 400 });
    }

    const updated = await updateEntity(params.id, {
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

    if (!updated) {
      return NextResponse.json(fail('ENTITY_NOT_FOUND', '유학원을 찾지 못했어요.'), { status: 404 });
    }

    return NextResponse.json(ok(updated));
  } catch (error) {
    if (error instanceof Error && error.message === 'ADMIN_ONLY') {
      return NextResponse.json(fail('FORBIDDEN', '어드민만 접근할 수 있어요.'), { status: 403 });
    }
    return NextResponse.json(fail('ADMIN_ENTITY_UPDATE_FAILED', '유학원 수정에 실패했어요.'), { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
    const deletedId = await deleteEntity(params.id);
    if (!deletedId) {
      return NextResponse.json(fail('ENTITY_NOT_FOUND', '유학원을 찾지 못했어요.'), { status: 404 });
    }
    return NextResponse.json(ok({ id: deletedId }));
  } catch (error) {
    if (error instanceof Error && error.message === 'ADMIN_ONLY') {
      return NextResponse.json(fail('FORBIDDEN', '어드민만 접근할 수 있어요.'), { status: 403 });
    }
    return NextResponse.json(fail('ADMIN_ENTITY_DELETE_FAILED', '유학원 삭제에 실패했어요.'), { status: 500 });
  }
}
