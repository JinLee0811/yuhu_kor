import { LandingPageClient } from '@/components/landing/LandingPageClient';
import { listRecentReviews } from '@/lib/supabase/repositories/reviews';

export default async function HomePage() {
  const recentReviews = await listRecentReviews(3);
  return <LandingPageClient reviews={recentReviews} embedded />;
}
