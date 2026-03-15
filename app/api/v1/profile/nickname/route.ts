import { NextResponse, type NextRequest } from 'next/server';
import { fail, ok } from '@/lib/api';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/env';
import { isNicknameAvailable, updateMyNickname } from '@/lib/supabase/repositories/profiles';

export async function GET(request: NextRequest) {
  try {
    const nickname = request.nextUrl.searchParams.get('nickname') ?? '';

    if (!isSupabaseConfigured()) {
      const availability = await isNicknameAvailable(nickname, 'mock-user-1');
      return NextResponse.json(ok(availability));
    }

    const supabase = await createClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    const availability = await isNicknameAvailable(nickname, user?.id ?? null);
    return NextResponse.json(ok(availability));
  } catch {
    return NextResponse.json(fail('NICKNAME_CHECK_FAILED', '닉네임 중복확인에 실패했어요.'), { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { nickname?: string };
    const nickname = body.nickname?.trim() ?? '';

    if (!nickname) {
      return NextResponse.json(fail('INVALID_REQUEST', '닉네임을 입력해줘요.'), { status: 400 });
    }

    if (!isSupabaseConfigured()) {
      const profile = await updateMyNickname('mock-user-1', nickname);
      return NextResponse.json(ok(profile));
    }

    const supabase = await createClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(fail('UNAUTHORIZED', '로그인이 필요해요.'), { status: 401 });
    }

    const profile = await updateMyNickname(user.id, nickname);
    return NextResponse.json(ok(profile));
  } catch (error) {
    return NextResponse.json(
      fail('NICKNAME_UPDATE_FAILED', error instanceof Error ? error.message : '닉네임 저장에 실패했어요.'),
      { status: 400 }
    );
  }
}
