# Yuhu — CLAUDE.md

## 프로젝트 개요
**"광고 없음. 진짜 후기만."**
호주 유학원 리얼 리뷰 플랫폼. 호주 유학을 준비하는 한국인 20대 타겟.
1인 개발 (정진 / Jin Lee), 무료 티어 기반 운영 목표.

## 기술 스택
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS, Pretendard 폰트
- **Backend:** Supabase (PostgreSQL + Auth + Storage)
- **상태관리:** Zustand (클라이언트), React Query (서버)
- **모니터링:** Sentry, PostHog, Vercel Analytics
- **배포:** Vercel

## 프로젝트 구조
```
app/
  (auth)/         # 로그인, 회원가입, 닉네임, 마이페이지
  (main)/         # 홈, 유학원 목록/상세, 게시판, 학교, 검색
    admin/        # 어드민 대시보드 (layout + 4개 섹션)
  api/v1/         # REST API (entities, reviews, schools, search, admin...)
  auth/callback/  # Supabase OAuth 콜백
  landing/        # 랜딩 페이지
  reviews/write/  # 리뷰 작성

components/
  common/         # Header, Footer, BottomNav, SearchBar
  entity/         # 유학원 카드/상세/필터
  review/         # 리뷰 카드/목록/폼(3스텝)
  board/          # 게시판
  school/         # 학교
  landing/        # 랜딩

lib/
  supabase/
    repositories/ # entities, reviews, profiles, schools, board, verifications
                  # + admin-verifications, admin-reports, admin-stats
  hooks/          # useAuth, useReviews, useEntities, useFilter
  store/          # auth (Zustand)
  mock/           # Supabase 미연동 시 fallback 데이터
  constants/      # reviewSchema, categories, regions

types/            # entity, review, school, board, verification, supabase, admin
supabase/
  migrations/     # DB 마이그레이션 SQL
```

## API 응답 포맷 (통일)
```typescript
{ data: T | null, error: { code: string, message: string } | null }
```

## 현재 상태 (2026-03-20)
- ✅ 프론트엔드 대부분 구현 완료
- ✅ Mock 데이터로 전체 UI 동작 중
- ✅ 유학원 10개 mock 데이터 실제 정보로 업데이트 (`lib/mock/agencies.ts`)
- ✅ **어드민 페이지 완성** — 대시보드, 인증관리, 유학원관리, 학교관리, 신고관리
- ⏳ **다음: Supabase 백엔드 연동** (mock → 실제 DB)
- ⏳ RLS 정책 설계 필요
- ⏳ Storage 연동 (인증 서류 업로드)
- ⏳ 랜딩 페이지 + SEO 최적화
- ⏳ PostHog 이벤트 설계 (리뷰 작성 funnel)

## 다음 작업 순서
1. user_verifications 테이블에 컬럼 추가 마이그레이션
   → `rejection_reason`, `reviewer_id`, `reviewed_at`, `email_address`, `email_verified_at`
2. Supabase Storage 버킷 생성 (verifications — 비공개)
3. 인증 서류 파일 업로드 UI + API 구현
4. mock → 실제 Supabase repository 연동 (admin-verifications, admin-reports, admin-stats)
5. Supabase Auth (Google/Kakao/Email) 연동 확인
6. RLS 정책 작성 (reviews, entities, profiles, user_verifications)
7. 랜딩 페이지 카피 + SEO 메타데이터 최적화
8. PostHog funnel 이벤트 추가

## 어드민 페이지 구조
`profiles.role = 'admin'` 계정만 접근 가능. 비어드민 → `/mypage` 리다이렉트.

```
/admin                    — 대시보드 (통계 카드: 대기중 인증, 신고, 리뷰수, 회원수 등)
/admin/verifications      — 인증 요청 목록 (탭: 대기중/승인/반려/전체)
/admin/verifications/[id] — 서류 열람 + 승인/반려 처리
/admin/agencies           — 유학원 CRUD + 노출 순서 조정
/admin/schools            — 학교 CRUD (IELTS/QS순위/장학금 포함)
/admin/reports            — 신고 처리 (무시 / 콘텐츠 숨김)
```

관련 파일:
- `types/admin.ts` — AdminStats, AdminVerification, AdminReport
- `lib/mock/admin-*.ts` — mock 데이터 (인증 6건, 신고 5건, 통계)
- `lib/supabase/repositories/admin-*.ts` — repository (Supabase 연동 TODO 포함)
- `app/api/v1/admin/verifications/`, `reports/`, `schools/`, `stats/` — API 라우트

## 사용자 인증(verification) 정책
리뷰 작성 전 학교 재학 인증 필요. 어드민이 수동 검토 후 승인/반려.

- **서류 종류:** COE / 수업료 영수증 / 재학증명서 / 유학원 대화내역
- **처리 흐름:** 사용자 제출(pending) → 어드민 서류 열람 → 승인/반려(사유 포함)
- **개인정보:** 서류 원본은 검토 후 삭제 예정 (Storage 연동 시 구현)
- **배지:** 인증 완료 사용자 리뷰에 ✅ COE 인증 / 📧 이메일 인증 배지 표시

## 주요 비즈니스 로직
- **리뷰 타입:** consultation(상담) / full(등록+재학) / aftercare(사후관리)
- **평점:** 리뷰 타입별 가중치 적용 평균 (`lib/utils/score.ts`)
- **리뷰 신뢰도:** is_verified_review, is_social_verified 기반 배지 표시
- **열람 권한:** 비회원 → 미리보기만 / 로그인 회원 → 전체 열람 / 인증 완료 → 리뷰 작성 가능

## 코드 컨벤션
- 한국어 주석 사용
- API route: `app/api/v1/` 하위, 통일된 응답 포맷 필수
- Repository 패턴: `lib/supabase/repositories/` 에서 DB 접근
- Supabase env 없으면 mock fallback으로 동작하도록 유지
- 컴포넌트는 용도별 폴더로 분리 (common / entity / review / board / school)
- `typedRoutes: true` 활성화 → Link href는 `Route` 타입 또는 `as Route` 캐스팅 필요

## 개발자 메모
- 혼자 개발하는 1인 프로젝트, 과도한 추상화 지양
- 무료 티어 기준으로 아키텍처 결정 (Supabase free, Vercel hobby)
- 한국어 UI, 한국인 사용자 대상
- mock 모드: `isSupabaseConfigured()` false → 모든 repository가 mock 데이터 반환
