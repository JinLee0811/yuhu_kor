import { NextResponse, type NextRequest } from 'next/server';
import { fail, ok } from '@/lib/api';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/env';
import { getLatestVerification, submitVerification } from '@/lib/supabase/repositories/verifications';

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(fail('UNAUTHORIZED', '로그인이 필요해요.'), { status: 401 });
    }

    const verification = await getLatestVerification(user.id);
    return NextResponse.json(ok(verification));
  } catch {
    return NextResponse.json(fail('VERIFICATION_LOAD_FAILED', '인증 상태를 불러오지 못했어요.'), { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { schoolName, documentType } = body as {
      schoolName?: string;
      documentType?: 'coe' | 'tuition_receipt' | 'enrollment' | 'agency';
    };

    if (!schoolName?.trim() || !documentType) {
      return NextResponse.json(fail('INVALID_REQUEST', '학교명과 문서 종류를 확인해줘요.'), { status: 400 });
    }

    if (!isSupabaseConfigured()) {
      const created = await submitVerification('mock-user-1', {
        schoolName: schoolName.trim(),
        documentType
      });
      return NextResponse.json(ok(created), { status: 201 });
    }

    const supabase = await createClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(fail('UNAUTHORIZED', '로그인이 필요해요.'), { status: 401 });
    }

    const created = await submitVerification(user.id, {
      schoolName: schoolName.trim(),
      documentType
    });

    return NextResponse.json(ok(created), { status: 201 });
  } catch {
    return NextResponse.json(fail('VERIFICATION_CREATE_FAILED', '인증 신청 중 오류가 발생했어요.'), { status: 500 });
  }
}
