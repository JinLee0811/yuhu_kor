import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '학교 인증',
  description:
    'COE, 등록금 영수증, 재학증명서로 호주 유학생 인증을 신청하세요. 인증 완료 후 게시판 전체 열람과 리뷰 작성이 가능해요.',
  robots: {
    index: false, // 인증 전용 페이지 — 색인 불필요
    follow: false
  }
};

export default function VerificationLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
