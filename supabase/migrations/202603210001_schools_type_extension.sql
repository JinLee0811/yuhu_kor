-- schools 테이블 type 컬럼 CHECK constraint 확장
-- 기존: university | tafe | language | college
-- 추가: rto (사립 직업학교), foundation (파운데이션/패스웨이)

do $$
begin
  -- 기존 CHECK constraint 제거 (이름이 자동 생성된 경우 포함)
  if exists (
    select 1 from information_schema.table_constraints
    where table_name = 'schools'
      and constraint_type = 'CHECK'
      and constraint_name = 'schools_type_check'
  ) then
    alter table schools drop constraint schools_type_check;
  end if;
end $$;

-- 확장된 type 목록으로 새 CHECK constraint 추가
alter table schools
  add constraint schools_type_check
  check (type in ('university', 'tafe', 'language', 'college', 'rto', 'foundation'));
