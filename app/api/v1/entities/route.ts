import { NextResponse, type NextRequest } from 'next/server';
import { getAgencies } from '@/lib/api/agencies';
import { ok } from '@/lib/api';

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const specialty = params.get('specialty');
  const city = params.get('city');
  const minScore = Number(params.get('min_score') ?? '0');
  const sort = (params.get('sort') ?? 'review_count') as 'review_count' | 'score_desc' | 'latest';
  const page = Number(params.get('page') ?? '1');
  const limit = Number(params.get('limit') ?? '10');
  const q = (params.get('q') ?? '').trim().toLowerCase();

  const result = await getAgencies({
    q,
    specialty: specialty ?? undefined,
    city: city ?? undefined,
    min_score: minScore,
    sort,
    page,
    limit
  });

  return NextResponse.json(
    ok({
      items: result.items.map((agency) => ({
        id: agency.id,
        slug: agency.slug,
        category_id: 'cat-agency',
        name: agency.name,
        description: agency.description,
        address: agency.headquarters_address,
        phone: agency.phone,
        website: agency.website,
        email: agency.email,
        headquarters_country: agency.headquarters_country,
        headquarters_address: agency.headquarters_address,
        coverage_countries: agency.coverage_countries,
        coverage_cities: agency.coverage_cities,
        specialties: agency.specialties,
        tags: agency.tags,
        is_verified: agency.is_verified,
        qeac_verified: agency.qeac_verified,
        is_claimed: agency.is_claimed,
        sns_links: agency.sns_links,
        avg_score: agency.avg_score,
        review_count: agency.review_count,
        updated_at: '2026-02-13T00:00:00.000Z'
      })),
      total: result.total,
      nextPage: result.nextPage
    })
  );
}
