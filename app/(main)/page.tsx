import type { Metadata } from 'next';
import { LandingPageClient } from '@/components/landing/LandingPageClient';
import { listRecentReviews } from '@/lib/supabase/repositories/reviews';

export const metadata: Metadata = {
  title: '유후 | 광고 없음. 진짜 후기만.',
  description:
    '호주 유학을 준비하는 한국인을 위한 광고 없는 유학원 솔직 후기 플랫폼. 실제 유학생들의 상담·등록·사후관리 리뷰를 확인하세요.',
  openGraph: {
    title: '유후 | 광고 없음. 진짜 후기만.',
    description:
      '호주 유학을 준비하는 한국인을 위한 광고 없는 유학원 솔직 후기 플랫폼. 실제 유학생들의 상담·등록·사후관리 리뷰를 확인하세요.',
    url: 'https://yuhu.kr'
  }
};

export default async function HomePage() {
  const recentReviews = await listRecentReviews(3);
  return <LandingPageClient reviews={recentReviews} embedded />;
}
