-- schools 테이블 확장: IELTS 요건, QS 순위, 장학금 JSONB 컬럼 추가
alter table schools add column if not exists ielts_requirement jsonb default null;
alter table schools add column if not exists qs_ranking       jsonb default null;
alter table schools add column if not exists scholarships     jsonb default '[]'::jsonb;
