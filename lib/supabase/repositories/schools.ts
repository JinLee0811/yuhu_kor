import 'server-only';

import type { School } from '@/types/school';
import type { Database } from '@/types/supabase';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/env';
import { mockSchools } from '@/lib/mock/schools';

function mapSchool(row: Database['public']['Tables']['schools']['Row']): School {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
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
    logoText: row.logo_text ?? undefined
  };
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
