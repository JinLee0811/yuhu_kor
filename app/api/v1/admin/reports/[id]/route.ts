import { NextResponse, type NextRequest } from 'next/server';
import { fail, ok } from '@/lib/api';
import { requireAdmin } from '@/lib/supabase/repositories/profiles';
import { dismissReport, actionReport } from '@/lib/supabase/repositories/admin-reports';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await requireAdmin();
    const { id } = await params;
    const body = (await request.json()) as { action: 'dismiss' | 'hide_content' };

    if (!body.action || !['dismiss', 'hide_content'].includes(body.action)) {
      return NextResponse.json(fail('INVALID_REQUEST', 'action은 dismiss 또는 hide_content여야 해요.'), { status: 400 });
    }

    const reviewerId = admin.userId ?? 'admin';
    const updated =
      body.action === 'dismiss'
        ? await dismissReport(id, reviewerId)
        : await actionReport(id, reviewerId);

    if (!updated) {
      return NextResponse.json(fail('NOT_FOUND', '신고를 찾을 수 없어요.'), { status: 404 });
    }

    return NextResponse.json(ok(updated));
  } catch (error) {
    if (error instanceof Error && error.message === 'ADMIN_ONLY') {
      return NextResponse.json(fail('FORBIDDEN', '어드민만 접근할 수 있어요.'), { status: 403 });
    }
    return NextResponse.json(fail('REPORT_UPDATE_FAILED', '신고 처리에 실패했어요.'), { status: 500 });
  }
}
