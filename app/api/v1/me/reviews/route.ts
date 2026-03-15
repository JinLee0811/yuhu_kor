import { NextResponse } from 'next/server';
import { fail, ok } from '@/lib/api';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/env';
import { listMyReviews } from '@/lib/supabase/repositories/reviews';

export async function GET() {
  if (!isSupabaseConfigured()) {
    const result = await listMyReviews('mock-user-1');
    return NextResponse.json(ok(result));
  }

  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(fail('UNAUTHORIZED', '로그인이 필요해요.'), { status: 401 });
  }

  const result = await listMyReviews(user.id);
  return NextResponse.json(ok(result));
}
