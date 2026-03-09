import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { entities, reviews } from '@/lib/mock-db';
import { EntityDetailView } from '@/components/entity/EntityDetailView';

interface Params {
  country: string;
  category: string;
  slug: string;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const entity = entities.find((item) => item.slug === params.slug);

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

export function generateStaticParams() {
  return entities.map((entity) => ({ country: 'au', category: 'agency', slug: entity.slug }));
}

export default function EntityDetailPage({ params }: { params: Params }) {
  const entity = entities.find((item) => item.slug === params.slug);
  if (!entity) notFound();

  const entityReviews = reviews.filter((review) => review.entity_id === entity.id);

  return <EntityDetailView entity={entity} reviews={entityReviews} />;
}
