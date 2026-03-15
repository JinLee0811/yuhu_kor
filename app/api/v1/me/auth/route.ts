import { NextResponse } from 'next/server';
import { fail, ok } from '@/lib/api';
import { getCurrentAuthState } from '@/lib/supabase/repositories/profiles';

export async function GET() {
  try {
    const state = await getCurrentAuthState();
    return NextResponse.json(ok(state));
  } catch {
    return NextResponse.json(fail('AUTH_STATE_ERROR', '로그인 상태를 확인하지 못했어요.'), { status: 500 });
  }
}
