import { NextResponse, type NextRequest } from 'next/server';
import { ok, fail } from '@/lib/api';
import { createClient } from '@/lib/supabase/server';
import { listMyFavorites, addFavorite, removeFavorite } from '@/lib/supabase/repositories/favorites';

/** GET /api/v1/me/favorites — 내 즐겨찾기 목록 */
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json(fail('UNAUTHORIZED', '로그인이 필요해요.'), { status: 401 });

    const items = await listMyFavorites(user.id);
    return NextResponse.json(ok({ items, total: items.length }));
  } catch {
    return NextResponse.json(fail('FETCH_FAILED', '즐겨찾기 목록을 불러오지 못했어요.'), { status: 500 });
  }
}

/** POST /api/v1/me/favorites — 즐겨찾기 토글 (추가/제거) */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { entityId?: string; action?: 'add' | 'remove' };
    const { entityId, action } = body;

    if (!entityId) return NextResponse.json(fail('INVALID_REQUEST', 'entityId가 필요해요.'), { status: 400 });

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json(fail('UNAUTHORIZED', '로그인이 필요해요.'), { status: 401 });

    if (action === 'remove') {
      await removeFavorite(user.id, entityId);
      return NextResponse.json(ok({ favorited: false }));
    } else {
      await addFavorite(user.id, entityId);
      return NextResponse.json(ok({ favorited: true }));
    }
  } catch {
    return NextResponse.json(fail('TOGGLE_FAILED', '즐겨찾기 처리에 실패했어요.'), { status: 500 });
  }
}
