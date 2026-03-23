-- 관심 유학원 즐겨찾기 테이블
create table if not exists favorites (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  entity_id  uuid not null references entities(id) on delete cascade,
  created_at timestamptz default now(),
  unique(user_id, entity_id)
);

alter table favorites enable row level security;

create policy favorites_select_own on favorites for select using (auth.uid() = user_id);
create policy favorites_insert_own on favorites for insert with check (auth.uid() = user_id);
create policy favorites_delete_own on favorites for delete using (auth.uid() = user_id);

-- 빠른 조회를 위한 인덱스
create index if not exists favorites_user_id_idx on favorites(user_id);
