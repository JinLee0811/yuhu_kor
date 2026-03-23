import 'server-only';

import type { School } from '@/types/school';
import type { Database, Json } from '@/types/supabase';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/env';
import { mockSchools } from '@/lib/mock/schools';

type SchoolRow = Database['public']['Tables']['schools']['Row'];

function mapSchool(row: SchoolRow): School {
  const ielts = row.ielts_requirement as Record<string, unknown> | null;
  const qs = row.qs_ranking as Record<string, unknown> | null;
  const scholarships = row.scholarships as Array<{ name: string; amount: string; condition: string }> | null;

  return {
    id: row.id,
    name: row.name,
    type: row.type as School['type'],
    city: row.city,
    description: row.description,
    fields: row.fields ?? [],
    address: row.address,
    website: row.website,
    tuitionRange: row.tuition_range,
    intakePeriods: row.intake_periods ?? [],
    cricosCode: row.cricos_code,
    topAgencies: [],
    programs: row.programs ?? [],
    featureTags: row.feature_tags ?? [],
    logoText: row.logo_text ?? undefined,
    ieltsRequirement: ielts
      ? {
          undergraduate: typeof ielts.undergraduate === 'number' ? ielts.undergraduate : undefined,
          postgraduate: typeof ielts.postgraduate === 'number' ? ielts.postgraduate : undefined,
          diploma: typeof ielts.diploma === 'number' ? ielts.diploma : undefined,
          note: typeof ielts.note === 'string' ? ielts.note : undefined
        }
      : undefined,
    qsRanking: qs
      ? {
          world: typeof qs.world === 'number' ? qs.world : undefined,
          australia: typeof qs.australia === 'number' ? qs.australia : undefined
        }
      : undefined,
    scholarships: scholarships ?? []
  };
}

// 이름 → slug 자동 생성
function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 60);
}

export async function listSchools() {
  if (!isSupabaseConfigured()) {
    return mockSchools;
  }

  const supabase = await createClient();
  const { data, error } = await supabase.from('schools').select('*').order('name', { ascending: true });
  if (error) throw error;
  return (data ?? []).map(mapSchool);
}

export async function getSchoolById(id: string) {
  if (!isSupabaseConfigured()) {
    return mockSchools.find((school) => school.id === id) ?? null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase.from('schools').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data ? mapSchool(data) : null;
}

export interface SchoolInput {
  name: string;
  type: School['type'];
  city: string;
  description: string;
  fields: string[];
  address: string;
  website: string;
  tuitionRange: string;
  intakePeriods: string[];
  cricosCode?: string | null;
  programs?: string[];
  featureTags?: string[];
  logoText?: string;
  ieltsRequirement?: School['ieltsRequirement'];
  qsRanking?: School['qsRanking'];
  scholarships?: School['scholarships'];
}

export async function createSchool(input: SchoolInput): Promise<School> {
  if (!isSupabaseConfigured()) {
    const mock: School = {
      id: `s-${Date.now()}`,
      topAgencies: [],
      ...input,
      cricosCode: input.cricosCode ?? null
    };
    mockSchools.unshift(mock);
    return mock;
  }

  const supabase = await createClient();

  // slug 중복 방지: 기본 slug + 충돌 시 숫자 suffix
  const baseSlug = toSlug(input.name);
  let slug = baseSlug;
  const { data: existing } = await supabase.from('schools').select('slug').like('slug', `${baseSlug}%`);
  if (existing && existing.length > 0) {
    slug = `${baseSlug}-${existing.length + 1}`;
  }

  const { data, error } = await supabase
    .from('schools')
    .insert({
      slug,
      name: input.name,
      type: input.type,
      city: input.city,
      description: input.description,
      fields: input.fields,
      address: input.address,
      website: input.website,
      tuition_range: input.tuitionRange,
      intake_periods: input.intakePeriods,
      cricos_code: input.cricosCode ?? null,
      programs: input.programs ?? [],
      feature_tags: input.featureTags ?? [],
      logo_text: input.logoText ?? null,
      ielts_requirement: (input.ieltsRequirement ?? null) as Json,
      qs_ranking: (input.qsRanking ?? null) as Json,
      scholarships: (input.scholarships ?? []) as Json
    })
    .select('*')
    .single();

  if (error) throw error;
  return mapSchool(data);
}

export async function updateSchool(id: string, input: Partial<SchoolInput>): Promise<School> {
  if (!isSupabaseConfigured()) {
    const idx = mockSchools.findIndex((s) => s.id === id);
    if (idx === -1) throw new Error('NOT_FOUND');
    const updated: School = {
      ...mockSchools[idx],
      ...input,
      id,
      topAgencies: mockSchools[idx].topAgencies
    };
    mockSchools[idx] = updated;
    return updated;
  }

  const supabase = await createClient();

  // camelCase → snake_case 변환 후 업데이트
  const patch: Record<string, unknown> = {};
  if (input.name !== undefined) patch.name = input.name;
  if (input.type !== undefined) patch.type = input.type;
  if (input.city !== undefined) patch.city = input.city;
  if (input.description !== undefined) patch.description = input.description;
  if (input.fields !== undefined) patch.fields = input.fields;
  if (input.address !== undefined) patch.address = input.address;
  if (input.website !== undefined) patch.website = input.website;
  if (input.tuitionRange !== undefined) patch.tuition_range = input.tuitionRange;
  if (input.intakePeriods !== undefined) patch.intake_periods = input.intakePeriods;
  if ('cricosCode' in input) patch.cricos_code = input.cricosCode ?? null;
  if (input.programs !== undefined) patch.programs = input.programs;
  if (input.featureTags !== undefined) patch.feature_tags = input.featureTags;
  if ('logoText' in input) patch.logo_text = input.logoText ?? null;
  if ('ieltsRequirement' in input) patch.ielts_requirement = (input.ieltsRequirement ?? null) as Json;
  if ('qsRanking' in input) patch.qs_ranking = (input.qsRanking ?? null) as Json;
  if (input.scholarships !== undefined) patch.scholarships = input.scholarships as Json;
  patch.updated_at = new Date().toISOString();

  const { data, error } = await supabase.from('schools').update(patch).eq('id', id).select('*').single();
  if (error) throw error;
  return mapSchool(data);
}

export async function deleteSchool(id: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    const idx = mockSchools.findIndex((s) => s.id === id);
    if (idx === -1) throw new Error('NOT_FOUND');
    mockSchools.splice(idx, 1);
    return;
  }

  const supabase = await createClient();
  const { error } = await supabase.from('schools').delete().eq('id', id);
  if (error) throw error;
}
