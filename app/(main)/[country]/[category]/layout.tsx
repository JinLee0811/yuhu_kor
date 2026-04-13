import type { Metadata } from 'next';

export function generateStaticParams() {
  return [{ country: 'au', category: 'agency' }];
}

// 카테고리/국가별 메타데이터 생성
export async function generateMetadata({
  params
}: {
  params: { country: string; category: string };
}): Promise<Metadata> {
  const categoryLabel: Record<string, string> = {
    agency: '유학원',
  };

  const countryLabel: Record<string, string> = {
    au: '호주',
  };

  const cat = categoryLabel[params.category] ?? '유학원';
  const country = countryLabel[params.country] ?? '호주';

  return {
    title: `${country} ${cat} 목록`,
    description: `실제 유학생 후기로 검증된 ${country} ${cat} 목록. 광고 없이 솔직한 리뷰를 확인하세요.`,
    openGraph: {
      title: `${country} ${cat} 목록 | 유후`,
      description: `실제 유학생 후기로 검증된 ${country} ${cat} 목록. 광고 없이 솔직한 리뷰를 확인하세요.`
    }
  };
}

export default function CategoryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
