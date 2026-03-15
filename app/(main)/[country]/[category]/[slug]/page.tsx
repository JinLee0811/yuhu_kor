import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { EntityDetailView } from '@/components/entity/EntityDetailView';
import { getEntityByIdOrSlug, listEntities } from '@/lib/supabase/repositories/entities';
import { listEntityReviews } from '@/lib/supabase/repositories/reviews';
import { getTopSchoolsByAgency } from '@/lib/supabase/repositories/aggregations';

interface Params {
  country: string;
  category: string;
  slug: string;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const entity = await getEntityByIdOrSlug(params.slug);

  if (!entity) {
    return {
      title: '유학원 후기 | 유후'
    };
  }

  return {
    title: `${entity.name} 후기 | 유후`,
    description: `실제 유학생이 남긴 ${entity.name} 솔직 후기 ${entity.review_count}개. 광고 없는 진짜 후기.`,
    openGraph: {
      title: `${entity.name} 후기 | 유후`,
      description: `실제 유학생이 남긴 ${entity.name} 솔직 후기 ${entity.review_count}개. 광고 없는 진짜 후기.`,
      images: ['/images/og-default.svg']
    }
  };
}

export async function generateStaticParams() {
  const result = await listEntities({ page: 1, limit: 200 });
  return result.items.map((entity) => ({ country: 'au', category: 'agency', slug: entity.slug }));
}

export default async function EntityDetailPage({ params }: { params: Params }) {
  const entity = await getEntityByIdOrSlug(params.slug);
  if (!entity) notFound();

  const [entityReviewsResult, topSchools] = await Promise.all([listEntityReviews(entity.id), getTopSchoolsByAgency(entity.id)]);

  return <EntityDetailView entity={entity} reviews={entityReviewsResult.items} topSchools={topSchools} />;
}
