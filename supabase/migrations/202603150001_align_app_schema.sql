alter table entities add column if not exists logo_url text;
alter table entities add column if not exists headquarters_address text;
alter table entities add column if not exists qeac_verified boolean default false;
alter table entities add column if not exists display_order integer default 0;

alter table reviews add column if not exists review_type text;
alter table reviews add column if not exists nickname text;
alter table reviews add column if not exists is_verified_review boolean default false;
alter table reviews add column if not exists is_social_verified boolean default false;
alter table reviews add column if not exists status text default 'published';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'reviews_review_type_check'
  ) then
    alter table reviews
      add constraint reviews_review_type_check
      check (review_type in ('consultation', 'full', 'aftercare'));
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'reviews_status_check'
  ) then
    alter table reviews
      add constraint reviews_status_check
      check (status in ('published', 'hidden'));
  end if;
end $$;

alter table profiles add column if not exists updated_at timestamptz default now();
alter table profiles add column if not exists role text default 'user';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'profiles_role_check'
  ) then
    alter table profiles
      add constraint profiles_role_check
      check (role in ('user', 'admin'));
  end if;
end $$;

alter table schools add column if not exists slug text;
alter table schools add column if not exists programs text[] default '{}';
alter table schools add column if not exists feature_tags text[] default '{}';
alter table schools add column if not exists logo_text text;
alter table schools add column if not exists updated_at timestamptz default now();

create unique index if not exists schools_slug_key on schools(slug);
create index if not exists entities_display_order_idx on entities(display_order);
