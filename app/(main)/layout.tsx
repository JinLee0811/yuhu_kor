import dynamic from 'next/dynamic';
import { Footer } from '@/components/common/Footer';

const Header = dynamic(() => import('@/components/common/Header').then((mod) => mod.Header), {
  ssr: false,
  loading: () => (
    <header className="sticky top-0 z-40 border-b border-border bg-card">
      <div className="mx-auto max-w-screen-lg px-5">
        <div className="hidden h-[68px] items-center justify-between md:flex">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-primary" />
            <div className="h-5 w-20 rounded bg-muted" />
          </div>
          <div className="h-9 w-44 rounded bg-muted" />
        </div>
        <div className="flex h-14 items-center justify-between md:hidden">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary" />
            <div className="h-5 w-16 rounded bg-muted" />
          </div>
          <div className="h-8 w-16 rounded bg-muted" />
        </div>
      </div>
    </header>
  )
});

const BottomNav = dynamic(() => import('@/components/common/BottomNav').then((mod) => mod.BottomNav), {
  ssr: false,
  loading: () => (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card md:hidden">
        <div className="flex h-[calc(56px+env(safe-area-inset-bottom))] items-start justify-around pb-safe pt-1" />
      </nav>
      <div className="h-14 md:hidden" />
    </>
  )
});

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>{children}</main>
      <Footer />
      <BottomNav />
    </div>
  );
}
