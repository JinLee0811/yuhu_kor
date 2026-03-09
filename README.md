# Yuhu MVP (유학후기)

Next.js 14 + TypeScript 기반 유후 MVP입니다.

## 실행

```bash
npm install
npm run dev
```

## 환경 변수

`.env.example`을 참고해 `.env.local`을 작성하세요.

## 현재 구현 범위

- App Router 기반 라우팅 (`/`, `/au/agency`, `/au/agency/[slug]`, `/reviews/write`, `/login`, `/mypage`)
- `app/api/v1/*` 통일 응답 포맷 (`{ data, error }`)
- 유학원 목록 필터/정렬/더보기
- 유학원 상세 SSR 메타데이터
- 리뷰 작성 3스텝 폼 + 가중 평균 계산
- 마이페이지 내 리뷰 목록/삭제
- middleware 인증 보호 (`/reviews/write`, `/mypage`)
- sitemap/robots 생성
- Supabase 초기 마이그레이션 SQL (`/supabase/migrations/202602130001_init.sql`)

## 참고

- 현재 API는 `lib/mock-db.ts` 기반 목업 데이터로 동작합니다.
- Supabase 실DB 연동 시 API route 내부를 Supabase query로 교체하면 됩니다.
