# Supabase 전환 안내

## 현재 상태

- Auth: `Google`, `Kakao`, `이메일/비밀번호` 로그인 UI와 callback 라우트가 Supabase Auth 기준으로 연결되어 있습니다.
- Session: `useAuthStore`는 local mock auth가 아니라 `/api/v1/me/auth`를 통해 Supabase 세션을 미러링합니다.
- Admin: `profiles.role = 'admin'`인 사용자만 유학원 관리 페이지와 유학원 CRUD/정렬 API를 사용할 수 있습니다.
- Nickname: 회원가입 직후엔 닉네임 없이 들어오고, 후기 작성 전 `/nickname`에서 직접 닉네임을 정하도록 되어 있습니다.
- Protected routes: `/mypage`, `/reviews/write`, `/verification`는 미들웨어에서 실제 세션 기준으로 보호됩니다.
- Data layer: `entities`, `reviews`, `schools`, `profiles`, `user_verifications`용 Supabase repository/DAL이 추가되었습니다.
- API: `entities`, `reviews`, `me/reviews`, `search`, `schools`, `verifications`가 Supabase DAL 기반으로 동작합니다.
- Review flow: 후기 작성, 내 후기 조회/삭제, 후기 상세 본문 조회, helpful/report API가 실제 DB 기준으로 바뀌었습니다.
- Fallback: env가 비어 있으면 mock fallback으로 동작해서 로컬 빌드/디자인 작업은 계속 가능합니다.

## 아직 2차로 남긴 것

- 학교생활 게시판 본문/댓글 전체 서버 전환
- 리뷰 댓글 서버 전환
- 학교 인증 관리자 승인 UI
- 게시판/댓글 좋아요, 신고, moderation 고도화

현재 2차 준비용으로 아래 초안을 추가해 두었습니다.

- `lib/supabase/repositories/board.ts`
- `supabase/migrations/202603150002_board_phase2_prep.sql`

## 사용자 체크리스트

1. Supabase 프로젝트를 생성합니다.
2. `Authentication > Providers`에서 `Google`, `Kakao`, `Email`을 활성화합니다.
3. Google Cloud Console에서 OAuth client를 만들고 redirect URL을 등록합니다.
4. Kakao Developers에서 앱 생성 후 로그인 Redirect URI와 동의항목을 설정합니다.
5. Supabase Auth provider 설정에 Google/Kakao client id, secret을 입력합니다.
6. 아래 redirect URL을 등록합니다.
7. `.env.local`에 필요한 값을 채웁니다.
8. migration을 적용합니다.
9. 초기 `entities`, `schools` 데이터를 seed 또는 CSV import로 넣습니다.

## Redirect URL 예시

- local: `http://localhost:3000/auth/callback`
- production: `https://your-domain.com/auth/callback`

`/login?next=/reviews/write` 같은 흐름은 callback 이후 원래 페이지로 돌아가도록 구현되어 있습니다.

## 필요한 환경 변수

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 권장 적용 순서

1. `.env.local` 작성
2. Auth provider 설정
3. `supabase/migrations/*` 적용
4. `entities`, `schools` 초기 데이터 입력
5. 로컬에서 `npm run build`로 검증

## 확인 포인트

- 로그인 후 헤더가 로그인 상태로 바뀌는지
- 닉네임이 없는 계정이 `/reviews/write`로 가면 `/nickname`으로 이동하는지
- `/nickname`에서 중복확인 후 저장하면 다시 원래 쓰려던 페이지로 돌아가는지
- `/reviews/write` 진입 시 비로그인 유저가 `/login`으로 이동하는지
- 후기 작성 후 해당 유학원 상세로 돌아가는지
- `/mypage`에서 내 후기 목록이 보이는지
- `/mypage` 또는 헤더에서 어드민 링크가 `admin` 계정에만 보이는지
- `/admin/agencies`에서 유학원 추가/수정/삭제/순서 저장이 되는지
- `/verification`에서 인증 신청 후 `인증 심사 중이에요` 상태가 반영되는지

## Admin 권한 부여

처음 한 명을 어드민으로 만들 때는 Supabase SQL Editor에서 아래처럼 `profiles.role`을 바꿔주세요.

```sql
update profiles
set role = 'admin'
where id = '<AUTH_USER_UUID>';
```

리뷰는 기존처럼 `작성자 본인만 수정/삭제 가능`하고, 어드민도 다른 사용자의 리뷰는 수정/삭제할 수 없게 유지했습니다.
