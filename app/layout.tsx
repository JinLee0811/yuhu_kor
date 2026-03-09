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

export const metadata: Metadata = {
  title: '유후 | 광고 없음. 진짜 후기만.',
  description: '호주 한인을 위한 광고 없는 유학원 후기 플랫폼 유후'
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
