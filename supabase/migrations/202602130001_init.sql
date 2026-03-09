-- Yuhu MVP schema
create extension if not exists pgcrypto;

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
  created_at timestamptz default now(),
  updated_at timestamptz default now()
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
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nickname text unique not null,
  avatar_url text,
  current_region_id uuid references regions(id),
  verified_at timestamptz,
  created_at timestamptz default now()
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

alter table profiles enable row level security;
alter table reviews enable row level security;
alter table review_helpful enable row level security;
alter table reports enable row level security;

create policy if not exists profiles_select_all on profiles for select using (true);
create policy if not exists profiles_insert_own on profiles for insert with check (auth.uid() = id);
create policy if not exists profiles_update_own on profiles for update using (auth.uid() = id);

create policy if not exists reviews_select_visible on reviews for select using (is_hidden = false);
create policy if not exists reviews_insert_auth on reviews for insert with check (auth.uid() = user_id);
create policy if not exists reviews_update_own on reviews for update using (auth.uid() = user_id);
create policy if not exists reviews_delete_own on reviews for delete using (auth.uid() = user_id);

create policy if not exists helpful_select_all on review_helpful for select using (true);
create policy if not exists helpful_insert_auth on review_helpful for insert with check (auth.uid() = user_id);
create policy if not exists helpful_delete_own on review_helpful for delete using (auth.uid() = user_id);

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

insert into categories (slug, name, sort_order, review_schema)
values
('agency', '유학원', 1, '[{"key":"consultation","label":"초기 상담","weight":1},{"key":"accuracy","label":"정보 정확성","weight":1},{"key":"transparency","label":"수수료 투명성","weight":1.5},{"key":"aftercare","label":"사후 관리","weight":1.5},{"key":"overall","label":"전반적 만족도","weight":2}]'::jsonb),
('school', '학교', 2, '[{"key":"quality","label":"수업 퀄리티","weight":1.5},{"key":"environment","label":"학습 환경","weight":1},{"key":"staff","label":"교직원 친절도","weight":1},{"key":"value","label":"학비 대비 만족도","weight":1.5},{"key":"overall","label":"전반적 만족도","weight":2}]'::jsonb),
('part-time', '알바', 3, '[{"key":"wage","label":"급여 정확성","weight":2},{"key":"environment","label":"근무 환경","weight":1.5},{"key":"management","label":"사장/매니저 태도","weight":1.5},{"key":"overall","label":"전반적 만족도","weight":2}]'::jsonb)
on conflict (slug) do nothing;

insert into regions (slug, name, country_code, timezone)
values ('au', '호주', 'AU', 'Australia/Sydney')
on conflict (slug) do nothing;
