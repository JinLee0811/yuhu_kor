import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SchoolDetailView } from '@/components/school/SchoolDetailView';
import { getSchoolById } from '@/lib/supabase/repositories/schools';
import { getTopAgenciesBySchool } from '@/lib/supabase/repositories/aggregations';

// 동적 렌더링 (Supabase 연동 후 cookies() 필요)
export const dynamic = 'force-dynamic';

interface Params {
  schoolId: string;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const school = await getSchoolById(params.schoolId);

  if (!school) {
    return {
      title: '학교 정보 | 유후'
    };
  }

  const description = `${school.name} 학비, IELTS 입학 요건, 분야, 입학 시기와 연결 유학원 정보를 한 번에 볼 수 있어요.`;

  return {
    title: `${school.name} 정보`,
    description,
    openGraph: {
      title: `${school.name} 정보 | 유후`,
      description
    }
  };
}

export default async function SchoolDetailPage({ params }: { params: Params }) {
  const school = await getSchoolById(params.schoolId);
  if (!school) notFound();

  const topAgencies = await getTopAgenciesBySchool(school.id);

  return <SchoolDetailView school={school} topAgencies={topAgencies} />;
}
