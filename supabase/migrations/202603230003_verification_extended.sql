-- 인증 확장: 이름·학과·학생 상태·학생증 추가

-- user_verifications 컬럼 추가
alter table user_verifications add column if not exists real_name   text;
alter table user_verifications add column if not exists department  text;
alter table user_verifications add column if not exists school_status text;

-- document_type CHECK 확장 (student_id 추가)
alter table user_verifications drop constraint if exists user_verifications_document_type_check;
alter table user_verifications
  add constraint user_verifications_document_type_check
  check (document_type in ('coe','tuition_receipt','enrollment','agency','student_id'));

-- school_status CHECK 추가
alter table user_verifications drop constraint if exists user_verifications_school_status_check;
alter table user_verifications
  add constraint user_verifications_school_status_check
  check (school_status in ('prospective','enrolled','graduated'));

-- profiles 컬럼 추가 (인증 승인 후 프로필에 반영)
alter table profiles add column if not exists department    text;
alter table profiles add column if not exists school_status text;

alter table profiles drop constraint if exists profiles_school_status_check;
alter table profiles
  add constraint profiles_school_status_check
  check (school_status in ('prospective','enrolled','graduated'));
