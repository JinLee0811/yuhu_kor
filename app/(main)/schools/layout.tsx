import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '호주 학교 정보',
  description:
    '호주 대학교, 어학원, TAFE, RTO, 파운데이션 학교 정보를 한눈에. IELTS 요건, 장학금, 학비, 입학 시기까지 확인하세요.',
  keywords: [
    '호주 대학교',
    '호주 어학원',
    '호주 TAFE',
    '호주 RTO',
    '호주 파운데이션',
    '호주 유학 학교',
    '호주 대학 입학 요건',
    'IELTS 요건'
  ],
  openGraph: {
    title: '호주 학교 정보 | 유후',
    description:
      '호주 대학교, 어학원, TAFE, RTO, 파운데이션 학교 정보를 한눈에. IELTS 요건, 장학금, 학비, 입학 시기까지 확인하세요.'
  }
};

export default function SchoolsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
