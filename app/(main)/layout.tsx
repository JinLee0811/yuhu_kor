import { Header } from '@/components/common/Header';
import { BottomNav } from '@/components/common/BottomNav';
import { Footer } from '@/components/common/Footer';

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
