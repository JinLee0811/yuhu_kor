import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '학교생활 게시판',
  description: '호주 유학생들의 학교생활 이야기. 인증된 유학생들이 직접 남긴 진짜 경험담을 확인하세요.',
  openGraph: {
    title: '학교생활 게시판 | 유후',
    description: '호주 유학생들의 학교생활 이야기. 인증된 유학생들이 직접 남긴 진짜 경험담을 확인하세요.'
  },
  robots: {
    index: false, // 로그인 필요 콘텐츠 — 색인 제외
    follow: true
  }
};

export default function BoardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
