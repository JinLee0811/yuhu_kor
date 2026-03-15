import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { isPendingNickname } from '@/lib/profile/nickname';

const PROTECTED_PATHS = ['/mypage', '/reviews/write', '/verification', '/nickname', '/admin'];

export async function updateSession(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // 디자인/로컬 개발 단계: Supabase 환경변수가 없으면 세션 처리를 생략한다.
  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.next({ request });
  }

  try {
    const response = NextResponse.next({ request });
    const isDevelopment = process.env.NODE_ENV !== 'production';

    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet: Array<{ name: string; value: string; options?: Record<string, unknown> }>) {
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options as Parameters<typeof response.cookies.set>[2])
            );
          }
        }
      }
    );

    const {
      data: { user }
    } = await supabase.auth.getUser();

    const pathname = request.nextUrl.pathname;
    const needsAuth = PROTECTED_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
    const needsSignupForContent =
      pathname === '/reviews' ||
      pathname.startsWith('/reviews/') ||
      (pathname.startsWith('/au/agency/') && pathname !== '/au/agency');

    if (needsAuth && !user) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('next', `${pathname}${request.nextUrl.search}`);
      return NextResponse.redirect(loginUrl);
    }

    if (needsSignupForContent && !user && !isDevelopment) {
      const signupUrl = new URL('/signup', request.url);
      signupUrl.searchParams.set('next', `${pathname}${request.nextUrl.search}`);
      return NextResponse.redirect(signupUrl);
    }

    if (user && (pathname === '/reviews/write' || pathname.startsWith('/reviews/write'))) {
      const { data: profile } = await supabase.from('profiles').select('nickname').eq('id', user.id).maybeSingle();
      if (!profile || isPendingNickname(profile.nickname)) {
        const nicknameUrl = new URL('/nickname', request.url);
        nicknameUrl.searchParams.set('next', `${pathname}${request.nextUrl.search}`);
        return NextResponse.redirect(nicknameUrl);
      }
    }

    if (user && (pathname === '/admin' || pathname.startsWith('/admin/'))) {
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle();
      if (profile?.role !== 'admin') {
        return NextResponse.redirect(new URL('/mypage', request.url));
      }
    }

    return response;
  } catch {
    // Local mock mode fallback: never block rendering if session refresh fails.
    return NextResponse.next({ request });
  }
}
