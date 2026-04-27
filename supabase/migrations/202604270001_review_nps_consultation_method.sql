-- 2026-04-27: 리뷰 NPS · 상담 형태 컬럼 추가 + 중복 작성 방지 unique 제약
--
-- 변경 요약
-- 1. reviews.nps (smallint 0~10) 추가
--    - "이 유학원을 친구에게 추천할래?" 척도 (Net Promoter Score)
--    - 평점 평균과 별도 신뢰도 시그널
-- 2. reviews.consultation_method (text) 추가
--    - 상담 형태: visit / video / kakao / email / etc
--    - consultation review_type에서만 사용
-- 3. (user_id, entity_id, review_type) UNIQUE 제약
--    - 한 사용자가 같은 유학원에 같은 단계 후기 중복 작성 방지
--    - 다른 유학원 / 다른 단계는 허용

alter table reviews
  add column if not exists nps smallint check (nps is null or (nps >= 0 and nps <= 10)),
  add column if not exists consultation_method text check (
    consultation_method is null
    or consultation_method in ('visit', 'video', 'kakao', 'email', 'etc')
  );

-- 중복 작성 방지 (자동 분리: full + aftercare 두 리뷰는 review_type 다르므로 OK)
create unique index if not exists reviews_unique_user_entity_type
  on reviews (user_id, entity_id, review_type);

comment on column reviews.nps is '추천 의향 0~10 (NPS)';
comment on column reviews.consultation_method is '상담 형태: visit/video/kakao/email/etc — consultation 전용';
