import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function updateSession(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // 디자인/로컬 개발 단계: Supabase 환경변수가 없으면 세션 처리를 생략한다.
  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.next({ request });
  }

  try {
    const response = NextResponse.next({ request });

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

    await supabase.auth.getUser();
    return response;
  } catch {
    // Local mock mode fallback: never block rendering if session refresh fails.
    return NextResponse.next({ request });
  }
}
