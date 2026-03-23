-- profiles 테이블에 verification_status 캐시 컬럼 추가
-- 미들웨어에서 user_verifications를 별도 조회하지 않고 profiles 1번 조회로 처리
alter table profiles
  add column if not exists verification_status text default 'none'
  check (verification_status in ('none', 'pending', 'approved', 'rejected'));

-- 기존 데이터 동기화: user_verifications → profiles.verification_status
update profiles p
set verification_status = (
  select uv.status
  from user_verifications uv
  where uv.user_id = p.id
  order by uv.submitted_at desc
  limit 1
)
where exists (
  select 1 from user_verifications uv where uv.user_id = p.id
);

-- 트리거: user_verifications INSERT/UPDATE 시 profiles.verification_status 자동 동기화
create or replace function sync_verification_status()
returns trigger
language plpgsql
security definer
as $$
begin
  update profiles
  set verification_status = new.status
  where id = new.user_id;
  return new;
end;
$$;

drop trigger if exists trg_sync_verification_status on user_verifications;
create trigger trg_sync_verification_status
  after insert or update of status on user_verifications
  for each row execute function sync_verification_status();
