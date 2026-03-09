import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { schools } from '@/lib/mock-db';
import { getTopAgenciesBySchool } from '@/lib/mock/schoolAggregations';
import { SchoolDetailView } from '@/components/school/SchoolDetailView';

interface Params {
  schoolId: string;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const school = schools.find((item) => item.id === params.schoolId);

  if (!school) {
    return {
      title: '학교 정보 | 유후'
    };
  }

  return {
    title: `${school.name} 정보 | 유후`,
    description: `${school.name} 학비, 분야, 입학 시기와 연결 유학원 정보를 한 번에 볼 수 있어요.`
  };
}

export function generateStaticParams() {
  return schools.map((school) => ({ schoolId: school.id }));
}

export default function SchoolDetailPage({ params }: { params: Params }) {
  const school = schools.find((item) => item.id === params.schoolId);
  if (!school) notFound();

  const topAgencies = getTopAgenciesBySchool(school.id);

  return <SchoolDetailView school={school} topAgencies={topAgencies} />;
}
