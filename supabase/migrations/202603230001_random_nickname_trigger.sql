-- 신규 가입 시 랜덤 닉네임 자동 배정 트리거
-- 기존 __pending__ 방식 대체. 익명성 원칙 준수 (SNS/카카오 실명 닉네임 절대 불가)

create or replace function handle_new_user()
returns trigger as $$
declare
  -- 익명 닉네임 앞 단어 목록
  words text[] := array[
    '호주유학생', '시드니짱', '멜버른킹', '브리즈번퀸',
    '캔버라짱', '골드코스트', '퍼스코알라', '애들레이드',
    '호주코알라', '캥거루맨', '왈라비맨', '오지이민자',
    '호주드리머', '시드니러버', '멜버른러버', '호주유학러',
    '오지유학생', '코알라러버', '썬샤인유학', '오세아니아'
  ];
  chosen_word text;
  rand_num    int;
  new_nickname text;
  attempt     int := 0;
begin
  -- 랜덤 닉네임 생성 (충돌 시 최대 10회 재시도)
  loop
    chosen_word  := words[1 + floor(random() * array_length(words, 1))::int];
    rand_num     := 1000 + floor(random() * 9000)::int;
    new_nickname := chosen_word || '_' || rand_num::text;

    exit when not exists (select 1 from public.profiles where nickname = new_nickname);
    attempt := attempt + 1;
    exit when attempt >= 10;
  end loop;

  -- 10회 재시도 후에도 중복이면 uuid 앞 8자로 fallback
  if exists (select 1 from public.profiles where nickname = new_nickname) then
    new_nickname := '유학생_' || substring(new.id::text, 1, 8);
  end if;

  insert into public.profiles (id, nickname, role)
  values (new.id, new_nickname, 'user')
  on conflict (id) do nothing;

  return new;
end;
$$ language plpgsql security definer;

-- 트리거 재등록 (기존 트리거가 있으면 교체)
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
