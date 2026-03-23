import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

const PROTECTED_PATHS = ['/mypage', '/reviews/write', '/verification', '/nickname', '/admin'];

export async function updateSession(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.next({ request });
  }

  try {
    const response = NextResponse.next({ request });
    const isDevelopment = process.env.NODE_ENV !== 'production';

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
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
    });

    const { data: { user } } = await supabase.auth.getUser();

    const pathname = request.nextUrl.pathname;

    // ── 1. 로그인 필요 경로 ────────────────────────────────────────
    const needsAuth = PROTECTED_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
    if (needsAuth && !user) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('next', `${pathname}${request.nextUrl.search}`);
      return NextResponse.redirect(loginUrl);
    }

    // 회원가입 유도 (리뷰 상세 등)
    const needsSignupForContent =
      pathname === '/reviews' ||
      pathname.startsWith('/reviews/') ||
      (pathname.startsWith('/au/agency/') && pathname !== '/au/agency');
    if (needsSignupForContent && !user && !isDevelopment) {
      const signupUrl = new URL('/signup', request.url);
      signupUrl.searchParams.set('next', `${pathname}${request.nextUrl.search}`);
      return NextResponse.redirect(signupUrl);
    }

    // ── 2. role/verification 체크가 필요한 경로 ───────────────────
    const needsVerification =
      pathname === '/reviews/write' ||
      pathname.startsWith('/reviews/write/') ||
      pathname === '/board' ||
      pathname.startsWith('/board/');

    const needsAdminCheck = pathname === '/admin' || pathname.startsWith('/admin/');
    const needsProfileCheck = user && (needsVerification || needsAdminCheck);

    if (needsProfileCheck) {
      // profiles 단일 쿼리로 role + verification_status 동시 조회 (이전: 2번 → 1번)
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, verification_status')
        .eq('id', user.id)
        .maybeSingle();

      const userRole = profile?.role ?? 'user';
      const verificationStatus = profile?.verification_status ?? 'none';

      // 어드민 접근 제한
      if (needsAdminCheck && userRole !== 'admin') {
        return NextResponse.redirect(new URL('/mypage', request.url));
      }

      // verification 필요 경로: 어드민은 패스, 일반 유저는 승인 필요
      if (needsVerification && userRole !== 'admin' && verificationStatus !== 'approved') {
        const verifyUrl = new URL('/verification', request.url);
        verifyUrl.searchParams.set('next', `${pathname}${request.nextUrl.search}`);
        verifyUrl.searchParams.set('reason', 'need_verification');
        return NextResponse.redirect(verifyUrl);
      }
    }

    return response;
  } catch {
    const pathname = request.nextUrl.pathname;
    const isProtected = PROTECTED_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
    if (isProtected) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next({ request });
  }
}
