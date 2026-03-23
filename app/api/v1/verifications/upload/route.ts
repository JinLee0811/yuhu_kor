import { NextResponse, type NextRequest } from 'next/server';
import { fail, ok } from '@/lib/api';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/env';

// 허용 MIME 타입 및 최대 파일 크기
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export async function POST(request: NextRequest) {
  try {
    // Supabase 미연동 시 mock 응답
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        ok({ documentUrl: 'https://example.com/mock-document.pdf' }),
        { status: 200 }
      );
    }

    const supabase = await createClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(fail('UNAUTHORIZED', '로그인이 필요해요.'), { status: 401 });
    }

    // multipart/form-data 파싱
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(fail('INVALID_REQUEST', '파일을 선택해주세요.'), { status: 400 });
    }

    // 파일 타입 검증
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        fail('INVALID_FILE_TYPE', 'JPG, PNG, WebP, PDF 파일만 업로드할 수 있어요.'),
        { status: 400 }
      );
    }

    // 파일 크기 검증 (5MB 이하)
    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        fail('FILE_TOO_LARGE', '파일 크기는 5MB 이하여야 해요.'),
        { status: 400 }
      );
    }

    // 파일명: {userId}/{timestamp}_{원본파일명} 형태로 구성 (경로 첫 segment = userId for RLS)
    const ext = file.name.split('.').pop() ?? 'bin';
    const timestamp = Date.now();
    const storagePath = `${user.id}/${timestamp}.${ext}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    // Supabase Storage에 업로드
    const { error: uploadError } = await supabase.storage
      .from('verifications')
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: false
      });

    if (uploadError) {
      if (process.env.NODE_ENV !== 'production') console.error('[verifications upload]', uploadError);
      return NextResponse.json(
        fail('UPLOAD_FAILED', '파일 업로드에 실패했어요. 다시 시도해주세요.'),
        { status: 500 }
      );
    }

    // Signed URL 생성 (어드민이 나중에 서류 열람 시 사용, 7일 유효)
    const { data: urlData } = await supabase.storage
      .from('verifications')
      .createSignedUrl(storagePath, 60 * 60 * 24 * 7);

    const documentUrl = urlData?.signedUrl ?? storagePath;

    return NextResponse.json(ok({ documentUrl, storagePath }), { status: 200 });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') console.error('[verifications upload error]', error);
    return NextResponse.json(
      fail('SERVER_ERROR', '파일 업로드 중 오류가 발생했어요.'),
      { status: 500 }
    );
  }
}
