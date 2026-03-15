import { listRecentReviews } from '@/lib/supabase/repositories/reviews';
import { ReviewsListGate } from '@/components/review/ReviewsListGate';

export default async function ReviewsAllPage() {
  const reviews = await listRecentReviews(100);

  return (
    <div className="min-h-screen bg-[#FAFAF8] pb-safe">
      <div className="mx-auto max-w-screen-lg px-5 py-6 lg:py-8">
        <section className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-[0_10px_28px_rgba(17,24,39,0.05)] lg:p-6">
          <div className="mb-5">
            <h1 className="text-[1.45rem] font-black tracking-[-0.03em] text-[#1A1A2E]">전체 후기</h1>
            <p className="mt-1 text-sm text-[#6B7280]">최신 등록 순으로 후기들을 한 번에 볼 수 있어요.</p>
          </div>

          <ReviewsListGate reviews={reviews} />
        </section>
      </div>
    </div>
  );
}
