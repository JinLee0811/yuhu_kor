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
  unique(user_id, school_name, document_type)
);

alter table schools enable row level security;
alter table board_posts enable row level security;
alter table user_verifications enable row level security;

create policy if not exists schools_select_all on schools for select using (true);

create policy if not exists board_posts_select_all on board_posts for select using (true);
create policy if not exists board_posts_insert_auth on board_posts for insert with check (auth.uid() = author_id);
create policy if not exists board_posts_update_own on board_posts for update using (auth.uid() = author_id);
create policy if not exists board_posts_delete_own on board_posts for delete using (auth.uid() = author_id);

create policy if not exists user_verifications_select_own on user_verifications for select using (auth.uid() = user_id);
create policy if not exists user_verifications_insert_own on user_verifications for insert with check (auth.uid() = user_id);
create policy if not exists user_verifications_update_own on user_verifications for update using (auth.uid() = user_id);
