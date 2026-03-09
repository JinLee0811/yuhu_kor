import type { MetadataRoute } from 'next';
import { entities, schools } from '@/lib/mock-db';

export default function sitemap(): MetadataRoute.Sitemap {
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://yuhu.kr';

  const dynamic = entities.map((entity) => ({
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
