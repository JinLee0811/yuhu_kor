-- ============================================================
-- Yuhu 전체 스키마 + 시드 데이터 (Supabase 직접 적용용)
-- ============================================================

-- ─────────────────────────────────────────
-- 1. Extensions
-- ─────────────────────────────────────────
create extension if not exists pgcrypto;

-- ─────────────────────────────────────────
-- 2. 테이블 생성
-- ─────────────────────────────────────────
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  parent_id uuid references categories(id),
  icon text,
  description text,
  review_schema jsonb,
  is_active boolean default true,
  sort_order int default 0,
  created_at timestamptz default now()
);

create table if not exists regions (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  parent_id uuid references regions(id),
  country_code char(2),
  timezone text,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table if not exists entities (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  category_id uuid not null references categories(id),
  region_id uuid references regions(id),
  name text not null,
  description text,
  address text,
  phone text,
  website text,
  email text,
  sns_links jsonb default '{}',
  business_hours jsonb default '{}',
  headquarters_country char(2),
  coverage_countries text[] default '{}',
  coverage_cities text[] default '{}',
  specialties text[] default '{}',
  tags text[] default '{}',
  is_verified boolean default false,
  is_claimed boolean default false,
  avg_score decimal(3,2) default 0,
  review_count int default 0,
  logo_url text,
  headquarters_address text,
  qeac_verified boolean default false,
  display_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nickname text unique not null,
  avatar_url text,
  current_region_id uuid references regions(id),
  verified_at timestamptz,
  updated_at timestamptz default now(),
  role text default 'user',
  created_at timestamptz default now()
);

create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  entity_id uuid not null references entities(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  scores jsonb not null,
  score_total decimal(3,2) not null,
  pros text not null,
  cons text not null,
  summary varchar(100),
  meta jsonb default '{}',
  helpful_count int default 0,
  is_anonymous boolean default true,
  is_hidden boolean default false,
  report_count int default 0,
  review_type text,
  nickname text,
  is_verified_review boolean default false,
  is_social_verified boolean default false,
  status text default 'published',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists review_helpful (
  id uuid primary key default gen_random_uuid(),
  review_id uuid not null references reviews(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz default now(),
  unique(review_id, user_id)
);

create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  review_id uuid not null references reviews(id) on delete cascade,
  reporter_id uuid not null references auth.users(id) on delete cascade,
  reason text not null,
  created_at timestamptz default now(),
  unique(review_id, reporter_id)
);

create table if not exists schools (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null check (type in ('university', 'tafe', 'language', 'college')),
  city text not null,
  description text not null,
  fields text[] default '{}',
  address text not null,
  website text not null,
  tuition_range text not null,
  intake_periods text[] default '{}',
  cricos_code text,
  slug text,
  programs text[] default '{}',
  feature_tags text[] default '{}',
  logo_text text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists board_posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references auth.users(id) on delete cascade,
  school_id uuid references schools(id) on delete set null,
  title varchar(100) not null,
  content varchar(2000) not null,
  is_anonymous boolean default false,
  like_count int default 0,
  comment_count int default 0,
  view_count int default 0,
  created_at timestamptz default now()
);

create table if not exists user_verifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null check (status in ('pending', 'approved', 'rejected')),
  document_type text not null check (document_type in ('coe', 'tuition_receipt', 'enrollment', 'agency')),
  document_url text,
  school_name text not null,
  submitted_at timestamptz default now(),
  approved_at timestamptz,
  rejection_reason text,
  reviewer_id uuid references auth.users(id),
  reviewed_at timestamptz,
  email_address text,
  email_verified_at timestamptz,
  unique(user_id, school_name, document_type)
);

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

-- ─────────────────────────────────────────
-- 3. 인덱스
-- ─────────────────────────────────────────
create unique index if not exists schools_slug_key on schools(slug) where slug is not null;
create index if not exists entities_display_order_idx on entities(display_order);

-- ─────────────────────────────────────────
-- 4. 컨스트레인트 (idempotent)
-- ─────────────────────────────────────────
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'reviews_review_type_check') then
    alter table reviews add constraint reviews_review_type_check
      check (review_type in ('consultation', 'full', 'aftercare'));
  end if;

  if not exists (select 1 from pg_constraint where conname = 'reviews_status_check') then
    alter table reviews add constraint reviews_status_check
      check (status in ('published', 'hidden'));
  end if;

  if not exists (select 1 from pg_constraint where conname = 'profiles_role_check') then
    alter table profiles add constraint profiles_role_check
      check (role in ('user', 'admin'));
  end if;
end $$;

-- ─────────────────────────────────────────
-- 5. RLS 활성화
-- ─────────────────────────────────────────
alter table profiles enable row level security;
alter table reviews enable row level security;
alter table review_helpful enable row level security;
alter table reports enable row level security;
alter table schools enable row level security;
alter table board_posts enable row level security;
alter table user_verifications enable row level security;
alter table entities enable row level security;
alter table review_comments enable row level security;
alter table board_comments enable row level security;

-- ─────────────────────────────────────────
-- 6. RLS 정책 (DO 블록으로 idempotent)
-- ─────────────────────────────────────────
do $$
begin
  -- profiles
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='profiles' and policyname='profiles_select_all') then
    create policy profiles_select_all on profiles for select using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='profiles' and policyname='profiles_insert_own') then
    create policy profiles_insert_own on profiles for insert with check (auth.uid() = id);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='profiles' and policyname='profiles_update_own') then
    create policy profiles_update_own on profiles for update using (auth.uid() = id);
  end if;

  -- reviews
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='reviews' and policyname='reviews_select_visible') then
    create policy reviews_select_visible on reviews for select using (is_hidden = false);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='reviews' and policyname='reviews_insert_auth') then
    create policy reviews_insert_auth on reviews for insert with check (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='reviews' and policyname='reviews_update_own') then
    create policy reviews_update_own on reviews for update using (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='reviews' and policyname='reviews_delete_own') then
    create policy reviews_delete_own on reviews for delete using (auth.uid() = user_id);
  end if;

  -- review_helpful
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='review_helpful' and policyname='helpful_select_all') then
    create policy helpful_select_all on review_helpful for select using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='review_helpful' and policyname='helpful_insert_auth') then
    create policy helpful_insert_auth on review_helpful for insert with check (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='review_helpful' and policyname='helpful_delete_own') then
    create policy helpful_delete_own on review_helpful for delete using (auth.uid() = user_id);
  end if;

  -- schools
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='schools' and policyname='schools_select_all') then
    create policy schools_select_all on schools for select using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='schools' and policyname='schools_admin_insert') then
    create policy schools_admin_insert on schools for insert with check (
      exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin')
    );
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='schools' and policyname='schools_admin_update') then
    create policy schools_admin_update on schools for update using (
      exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin')
    );
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='schools' and policyname='schools_admin_delete') then
    create policy schools_admin_delete on schools for delete using (
      exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin')
    );
  end if;

  -- board_posts
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='board_posts' and policyname='board_posts_select_all') then
    create policy board_posts_select_all on board_posts for select using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='board_posts' and policyname='board_posts_insert_auth') then
    create policy board_posts_insert_auth on board_posts for insert with check (auth.uid() = author_id);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='board_posts' and policyname='board_posts_update_own') then
    create policy board_posts_update_own on board_posts for update using (auth.uid() = author_id);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='board_posts' and policyname='board_posts_delete_own') then
    create policy board_posts_delete_own on board_posts for delete using (auth.uid() = author_id);
  end if;

  -- user_verifications
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='user_verifications' and policyname='user_verifications_select_own') then
    create policy user_verifications_select_own on user_verifications for select using (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='user_verifications' and policyname='user_verifications_insert_own') then
    create policy user_verifications_insert_own on user_verifications for insert with check (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='user_verifications' and policyname='user_verifications_update_own') then
    create policy user_verifications_update_own on user_verifications for update using (auth.uid() = user_id);
  end if;
  -- 어드민도 user_verifications 조회/수정 가능
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='user_verifications' and policyname='user_verifications_admin_all') then
    create policy user_verifications_admin_all on user_verifications for all using (
      exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin')
    );
  end if;

  -- entities
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='entities' and policyname='entities_select_all') then
    create policy entities_select_all on entities for select using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='entities' and policyname='entities_admin_insert') then
    create policy entities_admin_insert on entities for insert with check (
      exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin')
    );
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='entities' and policyname='entities_admin_update') then
    create policy entities_admin_update on entities for update
      using (exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin'))
      with check (exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin'));
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='entities' and policyname='entities_admin_delete') then
    create policy entities_admin_delete on entities for delete using (
      exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin')
    );
  end if;

  -- review_comments
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='review_comments' and policyname='review comments read all') then
    create policy "review comments read all" on review_comments for select using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='review_comments' and policyname='review comments insert own') then
    create policy "review comments insert own" on review_comments for insert with check (auth.uid() = author_id);
  end if;

  -- board_comments
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='board_comments' and policyname='board comments read all') then
    create policy "board comments read all" on board_comments for select using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='board_comments' and policyname='board comments insert own') then
    create policy "board comments insert own" on board_comments for insert with check (auth.uid() = author_id);
  end if;
end $$;

-- ─────────────────────────────────────────
-- 7. 트리거 (avg_score 자동 업데이트)
-- ─────────────────────────────────────────
create or replace function update_entity_score()
returns trigger as $$
begin
  update entities
  set
    avg_score = (
      select coalesce(avg(score_total), 0)
      from reviews
      where entity_id = coalesce(new.entity_id, old.entity_id)
      and is_hidden = false
    ),
    review_count = (
      select count(*)
      from reviews
      where entity_id = coalesce(new.entity_id, old.entity_id)
      and is_hidden = false
    ),
    updated_at = now()
  where id = coalesce(new.entity_id, old.entity_id);
  return new;
end;
$$ language plpgsql;

drop trigger if exists trigger_update_entity_score on reviews;
create trigger trigger_update_entity_score
after insert or update or delete on reviews
for each row execute function update_entity_score();

-- ─────────────────────────────────────────
-- 8. 기본 데이터 (categories, regions)
-- ─────────────────────────────────────────
insert into categories (slug, name, sort_order, review_schema)
values
  ('agency', '유학원', 1, '[{"key":"consultation","label":"초기 상담","weight":1},{"key":"accuracy","label":"정보 정확성","weight":1},{"key":"transparency","label":"수수료 투명성","weight":1.5},{"key":"aftercare","label":"사후 관리","weight":1.5},{"key":"overall","label":"전반적 만족도","weight":2}]'::jsonb),
  ('school', '학교', 2, '[{"key":"quality","label":"수업 퀄리티","weight":1.5},{"key":"environment","label":"학습 환경","weight":1},{"key":"staff","label":"교직원 친절도","weight":1},{"key":"value","label":"학비 대비 만족도","weight":1.5},{"key":"overall","label":"전반적 만족도","weight":2}]'::jsonb),
  ('part-time', '알바', 3, '[{"key":"wage","label":"급여 정확성","weight":2},{"key":"environment","label":"근무 환경","weight":1.5},{"key":"management","label":"사장/매니저 태도","weight":1.5},{"key":"overall","label":"전반적 만족도","weight":2}]'::jsonb)
on conflict (slug) do nothing;

insert into regions (slug, name, country_code, timezone)
values ('au', '호주', 'AU', 'Australia/Sydney')
on conflict (slug) do nothing;
