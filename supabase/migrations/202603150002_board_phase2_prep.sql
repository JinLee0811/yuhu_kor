create table if not exists review_comments (
  id uuid primary key default gen_random_uuid(),
  review_id uuid not null references reviews(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  parent_id uuid references review_comments(id) on delete cascade,
  mention_nickname text,
  content text not null check (char_length(trim(content)) > 0),
  like_count integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists board_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references board_posts(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  parent_id uuid references board_comments(id) on delete cascade,
  mention_nickname text,
  content text not null check (char_length(trim(content)) > 0),
  like_count integer not null default 0,
  created_at timestamptz not null default now()
);

alter table review_comments enable row level security;
alter table board_comments enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'review_comments' and policyname = 'review comments read all'
  ) then
    create policy "review comments read all"
      on review_comments for select
      using (true);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'review_comments' and policyname = 'review comments insert own'
  ) then
    create policy "review comments insert own"
      on review_comments for insert
      with check (auth.uid() = author_id);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'board_comments' and policyname = 'board comments read all'
  ) then
    create policy "board comments read all"
      on board_comments for select
      using (true);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'board_comments' and policyname = 'board comments insert own'
  ) then
    create policy "board comments insert own"
      on board_comments for insert
      with check (auth.uid() = author_id);
  end if;
end $$;
