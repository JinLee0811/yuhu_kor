import 'server-only';

import type { Entity } from '@/types/entity';
import type { Database } from '@/types/supabase';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/env';
import { mockAgencies } from '@/lib/mock/agencies';
import { mockReviews } from '@/lib/mock/reviews';

interface EntityFilters {
  q?: string;
  city?: string;
  specialty?: string;
  min_score?: number;
  sort?: 'display_order' | 'review_count' | 'score_desc' | 'latest';
  page?: number;
  limit?: number;
}

export interface EntityAdminInput {
  slug: string;
  name: string;
  description?: string;
  website?: string;
  phone?: string;
  email?: string;
  logo_url?: string;
  headquarters_country?: string;
  headquarters_address?: string;
  coverage_cities: string[];
  coverage_countries: string[];
  specialties: string[];
  tags: string[];
  is_verified: boolean;
  qeac_verified: boolean;
  is_claimed: boolean;
  display_order: number;
  sns_links?: {
    instagram?: string;
    kakao?: string;
  };
}

function mapEntity(row: Database['public']['Tables']['entities']['Row']): Entity {
  return {
    id: row.id,
    slug: row.slug,
    category_id: row.category_id,
    region_id: row.region_id ?? undefined,
    display_order: row.display_order ?? undefined,
    name: row.name,
    description: row.description ?? undefined,
    address: row.address ?? undefined,
    phone: row.phone ?? undefined,
    website: row.website ?? undefined,
    email: row.email ?? undefined,
    logo_url: row.logo_url ?? undefined,
    headquarters_country: row.headquarters_country ?? undefined,
    headquarters_address: row.headquarters_address ?? undefined,
    coverage_countries: row.coverage_countries ?? [],
    coverage_cities: row.coverage_cities ?? [],
    specialties: row.specialties ?? [],
    tags: row.tags ?? [],
    is_verified: row.is_verified,
    qeac_verified: row.qeac_verified,
    is_claimed: row.is_claimed,
    sns_links: (row.sns_links as Entity['sns_links']) ?? {},
    avg_score: Number(row.avg_score ?? 0),
    review_count: row.review_count ?? 0,
    updated_at: row.updated_at
  };
}

export async function listEntities(filters: EntityFilters = {}) {
  if (!isSupabaseConfigured()) {
    const q = (filters.q ?? '').trim().toLowerCase();
    const city = filters.city;
    const specialty = filters.specialty;
    const minScore = filters.min_score ?? 0;
    const sort = filters.sort ?? 'display_order';
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 10;

    const filtered = mockAgencies
      .filter((agency) => (q ? agency.name.toLowerCase().includes(q) : true))
      .filter((agency) => (city ? agency.coverage_cities.includes(city) : true))
      .filter((agency) => (specialty ? agency.specialties.includes(specialty) : true))
      .filter((agency) => agency.avg_score >= minScore);

    const sorted = [...filtered].sort((a, b) => {
      if (sort === 'display_order') return (a.display_order ?? Number.MAX_SAFE_INTEGER) - (b.display_order ?? Number.MAX_SAFE_INTEGER);
      if (sort === 'score_desc') return b.avg_score - a.avg_score;
      if (sort === 'latest') {
        const aLatest = mockReviews.find((review) => review.entity_id === a.id)?.created_at ?? '';
        const bLatest = mockReviews.find((review) => review.entity_id === b.id)?.created_at ?? '';
        return new Date(bLatest).getTime() - new Date(aLatest).getTime();
      }
      return b.review_count - a.review_count;
    });

    const start = (page - 1) * limit;
    const items = sorted.slice(start, start + limit).map((agency) => ({
      id: agency.id,
      slug: agency.slug,
      category_id: 'cat-agency',
        display_order: agency.display_order,
      name: agency.name,
      description: agency.description,
      address: agency.headquarters_address,
      phone: agency.phone,
      website: agency.website,
      email: agency.email,
      logo_url: agency.logo_url,
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
    }));

    return {
      items,
      total: sorted.length,
      nextPage: start + limit < sorted.length ? page + 1 : null
    };
  }

  const supabase = await createClient();
  let query = supabase.from('entities').select('*', { count: 'exact' });

  if (filters.q) query = query.ilike('name', `%${filters.q}%`);
  if (filters.city) query = query.contains('coverage_cities', [filters.city]);
  if (filters.specialty) query = query.contains('specialties', [filters.specialty]);
  if (filters.min_score !== undefined) query = query.gte('avg_score', filters.min_score);

  if (filters.sort === 'display_order') query = query.order('display_order', { ascending: true }).order('review_count', { ascending: false });
  else if (filters.sort === 'score_desc') query = query.order('avg_score', { ascending: false });
  else if (filters.sort === 'latest') query = query.order('updated_at', { ascending: false });
  else query = query.order('review_count', { ascending: false });

  const page = filters.page ?? 1;
  const limit = filters.limit ?? 10;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, count, error } = await query.range(from, to);
  if (error) throw error;

  return {
    items: (data ?? []).map(mapEntity),
    total: count ?? 0,
    nextPage: (count ?? 0) > to + 1 ? page + 1 : null
  };
}

export async function getEntityByIdOrSlug(idOrSlug: string) {
  if (!isSupabaseConfigured()) {
    const agency = mockAgencies.find((item) => item.id === idOrSlug || item.slug === idOrSlug);
    if (!agency) return null;
    return {
      id: agency.id,
      slug: agency.slug,
      category_id: 'cat-agency',
      display_order: agency.display_order,
      name: agency.name,
      description: agency.description,
      address: agency.headquarters_address,
      phone: agency.phone,
      website: agency.website,
      email: agency.email,
      logo_url: agency.logo_url,
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
    } satisfies Entity;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('entities')
    .select('*')
    .or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`)
    .maybeSingle();

  if (error) throw error;
  return data ? mapEntity(data) : null;
}

export async function searchEntities(queryText: string) {
  const result = await listEntities({ q: queryText, limit: 20, page: 1 });
  return result.items;
}

function normalizeEntityInput(input: EntityAdminInput) {
  return {
    slug: input.slug.trim(),
    name: input.name.trim(),
    description: input.description?.trim() || null,
    website: input.website?.trim() || null,
    phone: input.phone?.trim() || null,
    email: input.email?.trim() || null,
    logo_url: input.logo_url?.trim() || null,
    headquarters_country: input.headquarters_country?.trim() || null,
    headquarters_address: input.headquarters_address?.trim() || null,
    coverage_cities: input.coverage_cities,
    coverage_countries: input.coverage_countries,
    specialties: input.specialties,
    tags: input.tags,
    is_verified: input.is_verified,
    qeac_verified: input.qeac_verified,
    is_claimed: input.is_claimed,
    display_order: input.display_order,
    sns_links: input.sns_links ?? {},
    updated_at: new Date().toISOString()
  };
}

async function getAgencyCategoryId() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('categories').select('id').eq('slug', 'agency').single();
  if (error) throw error;
  return data.id;
}

export async function createEntity(input: EntityAdminInput) {
  if (!isSupabaseConfigured()) {
    const created = {
      id: String(Date.now()),
      ...normalizeEntityInput(input),
      category_id: 'cat-agency',
      avg_score: 0,
      review_count: 0,
      created_at: new Date().toISOString()
    };
    mockAgencies.unshift({
      id: created.id,
      slug: created.slug,
      display_order: created.display_order,
      name: created.name,
      description: created.description ?? '',
      website: created.website ?? '',
      phone: created.phone ?? '',
      email: created.email ?? '',
      logo_url: created.logo_url ?? undefined,
      headquarters_country: created.headquarters_country ?? 'AU',
      headquarters_address: created.headquarters_address ?? '',
      coverage_cities: created.coverage_cities,
      coverage_countries: created.coverage_countries,
      specialties: created.specialties,
      tags: created.tags,
      avg_score: 0,
      review_count: 0,
      is_verified: created.is_verified,
      qeac_verified: created.qeac_verified,
      is_claimed: created.is_claimed,
      sns_links: created.sns_links as NonNullable<Entity['sns_links']>
    });
    return getEntityByIdOrSlug(created.id);
  }

  const supabase = await createClient();
  const payload = normalizeEntityInput(input);
  const categoryId = await getAgencyCategoryId();
  const { data, error } = await supabase
    .from('entities')
    .insert({
      ...payload,
      category_id: categoryId,
      avg_score: 0,
      review_count: 0
    })
    .select('*')
    .single();
  if (error) throw error;
  return mapEntity(data);
}

export async function updateEntity(entityId: string, input: EntityAdminInput) {
  if (!isSupabaseConfigured()) {
    const target = mockAgencies.find((item) => item.id === entityId);
    if (!target) return null;
    const payload = normalizeEntityInput(input);
    Object.assign(target, {
      slug: payload.slug,
      display_order: payload.display_order,
      name: payload.name,
      description: payload.description ?? '',
      website: payload.website ?? '',
      phone: payload.phone ?? '',
      email: payload.email ?? '',
      logo_url: payload.logo_url ?? undefined,
      headquarters_country: payload.headquarters_country ?? 'AU',
      headquarters_address: payload.headquarters_address ?? '',
      coverage_cities: payload.coverage_cities,
      coverage_countries: payload.coverage_countries,
      specialties: payload.specialties,
      tags: payload.tags,
      is_verified: payload.is_verified,
      qeac_verified: payload.qeac_verified,
      is_claimed: payload.is_claimed,
      sns_links: payload.sns_links as NonNullable<Entity['sns_links']>
    });
    return getEntityByIdOrSlug(entityId);
  }

  const supabase = await createClient();
  const { data, error } = await supabase.from('entities').update(normalizeEntityInput(input)).eq('id', entityId).select('*').maybeSingle();
  if (error) throw error;
  return data ? mapEntity(data) : null;
}

export async function deleteEntity(entityId: string) {
  if (!isSupabaseConfigured()) {
    const index = mockAgencies.findIndex((item) => item.id === entityId);
    if (index === -1) return null;
    const [removed] = mockAgencies.splice(index, 1);
    return removed.id;
  }

  const supabase = await createClient();
  const { data, error } = await supabase.from('entities').delete().eq('id', entityId).select('id').maybeSingle();
  if (error) throw error;
  return data?.id ?? null;
}

export async function reorderEntities(orders: Array<{ id: string; display_order: number }>) {
  if (!isSupabaseConfigured()) {
    orders.forEach((item) => {
      const target = mockAgencies.find((agency) => agency.id === item.id);
      if (target) target.display_order = item.display_order;
    });
    return true;
  }

  const supabase = await createClient();
  for (const item of orders) {
    const { error } = await supabase
      .from('entities')
      .update({ display_order: item.display_order, updated_at: new Date().toISOString() })
      .eq('id', item.id);
    if (error) throw error;
  }
  return true;
}
