import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { EntityDetailView } from '@/components/entity/EntityDetailView';
import { getEntityByIdOrSlug } from '@/lib/supabase/repositories/entities';
import { listEntityReviews } from '@/lib/supabase/repositories/reviews';
import { getTopSchoolsByAgency } from '@/lib/supabase/repositories/aggregations';

// 동적 렌더링 (Supabase 연동 후 cookies() 필요)
export const dynamic = 'force-dynamic';

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

  const description = `실제 유학생이 남긴 ${entity.name} 솔직 후기 ${entity.review_count}개. 상담·등록·사후관리 각 단계별 리뷰를 광고 없이 확인하세요.`;

  return {
    title: `${entity.name} 후기`,
    description,
    openGraph: {
      title: `${entity.name} 후기 | 유후`,
      description,
      url: `https://yuhu.kr/${params.country}/${params.category}/${params.slug}`
    }
  };
}


export default async function EntityDetailPage({ params }: { params: Params }) {
  const entity = await getEntityByIdOrSlug(params.slug);
  if (!entity) notFound();

  const [entityReviewsResult, topSchools] = await Promise.all([listEntityReviews(entity.id), getTopSchoolsByAgency(entity.id)]);

  return <EntityDetailView entity={entity} reviews={entityReviewsResult.items} topSchools={topSchools} />;
}
