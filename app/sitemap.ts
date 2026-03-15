import type { MetadataRoute } from 'next';
import { listEntities } from '@/lib/supabase/repositories/entities';
import { listSchools } from '@/lib/supabase/repositories/schools';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://yuhu.kr';
  const [entitiesResult, schools] = await Promise.all([listEntities({ page: 1, limit: 500 }), listSchools()]);

  const dynamic = entitiesResult.items.map((entity) => ({
    url: `${site}/au/agency/${entity.slug}`,
    lastModified: new Date(entity.updated_at)
  }));

  const schoolDynamic = schools.map((school) => ({
    url: `${site}/schools/${school.id}`,
    lastModified: new Date()
  }));

  return [
    { url: site, lastModified: new Date() },
    { url: `${site}/au/agency`, lastModified: new Date() },
    { url: `${site}/schools`, lastModified: new Date() },
    { url: `${site}/board`, lastModified: new Date() },
    { url: `${site}/verification`, lastModified: new Date() },
    { url: `${site}/reviews/write`, lastModified: new Date() },
    ...dynamic,
    ...schoolDynamic
  ];
}
