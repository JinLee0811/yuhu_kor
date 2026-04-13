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

## 현재 상태 (2026-03-23 최종)
- ✅ 프론트엔드 대부분 구현 완료 (빌드 통과, **44페이지**)
- ✅ 어드민 페이지 완성 — 대시보드, 인증관리, 유학원관리, 학교관리, 신고관리
- ✅ **Supabase 백엔드 연동 완료**
  - Project URL: `https://wbltdukxcwmnqdtvvtzz.supabase.co` (Seoul 리전)
  - 전체 DB 스키마 + RLS + 트리거 적용
  - 유학원 10개 / 학교 13개 / 임시 리뷰 16개 DB 삽입 완료
- ✅ **admin-verifications / admin-reports / admin-stats → Supabase 실연동 완료**
- ✅ **리뷰 신고 기능 완성** — ReportModal + API + 중복방지
- ✅ **보안 감사 완료** — 4개 취약점 수정, DB FK 2개 추가
- ✅ **신규 가입 자동 랜덤 닉네임 트리거** — `202603230001_random_nickname_trigger.sql` 적용
- ✅ **Google OAuth 연동 완료**
- ✅ **Kakao OAuth 연동** — 개발 모드(팀원만 로그인 가능), 서비스 오픈 시 심사 필요
- ✅ **관심 유학원 구현** — favorites 테이블 + RLS + API + Hook + 하트 버튼 + 마이페이지 목록 (`202603230002_favorites.sql` 적용)
- ✅ **마이페이지 전면 개선** — 닉네임 변경(익명성 주의사항), 인증 섹션, 관심 유학원, 설정/로그아웃
- ✅ **인증(verification) 확장** — 실명/학과/학생상태/학생증 (`202603230003_verification_extended.sql` 적용)
  - 게시판 배지: 학교·학과·재학생/입학예정/졸업생 표시
  - 어드민 인증 상세: 실명·학과·학생상태 표시
- ✅ **인증 기반 접근 제한** — `/reviews/write`, `/board/**` → 인증 완료 유저만 (middleware)
- ✅ **schools 타입 확장** — `rto` / `foundation` 추가 (마이그레이션 + 전체 UI 반영)
- ✅ **Storage 버킷 생성** — `verifications` 버킷 (비공개) + 서류 업로드 API + 파일 첨부 UI
- ✅ **SEO 메타데이터 정비** — 루트 OG/Twitter 설정 + 주요 페이지별 metadata 추가
- ⏳ **Kakao OAuth 서비스 심사** (MAU 충분 시 진행)
- ⏳ **학교생활(board) 페이지 정리** — API 연동, mock → Supabase 전환
- ⏳ PostHog 이벤트 설계 (리뷰 작성 funnel)

## 다음 작업 순서
1. **학교생활(board) 페이지 Supabase 연동** — board_posts 테이블 + RLS + API
2. PostHog funnel 이벤트 추가
3. Rate Limiting (Upstash Redis — MAU 500+ 이후)
4. **Kakao OAuth 서비스 심사** (준비 시 진행)

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
- `lib/supabase/repositories/admin-*.ts` — repository (Supabase 실연동 완료)
- `app/api/v1/admin/verifications/`, `reports/`, `schools/`, `stats/` — API 라우트

## 사용자 인증(verification) 정책
리뷰 작성 전 학교 재학 인증 필요. 어드민이 수동 검토 후 승인/반려.

- **서류 종류:** COE / 학생증 / 재학증명서 / 수업료 영수증 / 유학원 대화내역
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
