import { NextResponse, type NextRequest } from 'next/server';
import { fail, ok } from '@/lib/api';
import { requireAdmin } from '@/lib/supabase/repositories/profiles';
import { getAdminVerification, approveVerification, rejectVerification } from '@/lib/supabase/repositories/admin-verifications';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await requireAdmin();
    const { id } = await params;
    const item = await getAdminVerification(id);
    if (!item) {
      return NextResponse.json(fail('NOT_FOUND', '인증 요청을 찾을 수 없어요.'), { status: 404 });
    }
    void admin;
    return NextResponse.json(ok(item));
  } catch (error) {
    if (error instanceof Error && error.message === 'ADMIN_ONLY') {
      return NextResponse.json(fail('FORBIDDEN', '어드민만 접근할 수 있어요.'), { status: 403 });
    }
    return NextResponse.json(fail('VERIFICATION_LOAD_FAILED', '인증 요청을 불러오지 못했어요.'), { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await requireAdmin();
    const { id } = await params;
    const body = (await request.json()) as { action: 'approve' | 'reject'; rejectionReason?: string };

    if (!body.action || !['approve', 'reject'].includes(body.action)) {
      return NextResponse.json(fail('INVALID_REQUEST', 'action은 approve 또는 reject여야 해요.'), { status: 400 });
    }
    if (body.action === 'reject' && !body.rejectionReason?.trim()) {
      return NextResponse.json(fail('INVALID_REQUEST', '반려 사유를 입력해 주세요.'), { status: 400 });
    }

    const reviewerId = admin.userId ?? 'admin';
    const updated =
      body.action === 'approve'
        ? await approveVerification(id, reviewerId)
        : await rejectVerification(id, reviewerId, body.rejectionReason!);

    if (!updated) {
      return NextResponse.json(fail('NOT_FOUND', '인증 요청을 찾을 수 없어요.'), { status: 404 });
    }

    return NextResponse.json(ok(updated));
  } catch (error) {
    if (error instanceof Error && error.message === 'ADMIN_ONLY') {
      return NextResponse.json(fail('FORBIDDEN', '어드민만 접근할 수 있어요.'), { status: 403 });
    }
    return NextResponse.json(fail('VERIFICATION_UPDATE_FAILED', '인증 처리에 실패했어요.'), { status: 500 });
  }
}
