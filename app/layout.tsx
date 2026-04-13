import localFont from 'next/font/local';
import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import { Providers } from '@/lib/query/providers';
import { AnalyticsProvider } from '@/components/common/AnalyticsProvider';
import './globals.css';

const pretendard = localFont({
  src: [
    {
      path: '../node_modules/pretendard/dist/web/variable/woff2/PretendardVariable.woff2',
      style: 'normal'
    }
  ],
  variable: '--font-pretendard',
  display: 'swap'
});

// 기본 메타데이터 (페이지별 override 가능)
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://yuhu.kr'
  ),
  title: {
    default: '유후 | 광고 없음. 진짜 후기만.',
    template: '%s | 유후'
  },
  description:
    '호주 유학원 진짜 후기 플랫폼. 광고 없는 QEAC 유학원 솔직 리뷰, 호주 대학 · 어학원 · TAFE 정보까지.',
  keywords: [
    '호주 유학원 후기',
    '호주 유학 정보',
    '유학원 추천',
    '호주 어학연수',
    '호주 대학 정보',
    'QEAC 유학원',
    '호주 TAFE',
    '유후',
    'Yuhu'
  ],
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://yuhu.kr',
    siteName: '유후',
    title: '유후 | 광고 없음. 진짜 후기만.',
    description:
      '호주 유학원 진짜 후기 플랫폼. 광고 없는 QEAC 유학원 솔직 리뷰, 호주 대학 · 어학원 · TAFE 정보까지.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: '유후 — 호주 유학원 진짜 후기 플랫폼'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: '유후 | 광고 없음. 진짜 후기만.',
    description:
      '호주 유학원 진짜 후기 플랫폼. 광고 없는 QEAC 유학원 솔직 리뷰, 호주 대학 · 어학원 · TAFE 정보까지.',
    images: ['/og-image.png']
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large'
    }
  },
  icons: {
    icon: '/favicon.ico'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={pretendard.variable}>
      <body className="font-sans">
        <Providers>
          <AnalyticsProvider />
          {children}
          <Toaster richColors position="top-center" />
        </Providers>
      </body>
    </html>
  );
}
