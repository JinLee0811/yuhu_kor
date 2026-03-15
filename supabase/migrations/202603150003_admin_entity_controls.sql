alter table entities enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'entities' and policyname = 'entities_select_all'
  ) then
    create policy entities_select_all
      on entities for select
      using (true);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'entities' and policyname = 'entities_admin_insert'
  ) then
    create policy entities_admin_insert
      on entities for insert
      with check (
        exists (
          select 1
          from profiles
          where profiles.id = auth.uid()
            and profiles.role = 'admin'
        )
      );
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'entities' and policyname = 'entities_admin_update'
  ) then
    create policy entities_admin_update
      on entities for update
      using (
        exists (
          select 1
          from profiles
          where profiles.id = auth.uid()
            and profiles.role = 'admin'
        )
      )
      with check (
        exists (
          select 1
          from profiles
          where profiles.id = auth.uid()
            and profiles.role = 'admin'
        )
      );
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'entities' and policyname = 'entities_admin_delete'
  ) then
    create policy entities_admin_delete
      on entities for delete
      using (
        exists (
          select 1
          from profiles
          where profiles.id = auth.uid()
            and profiles.role = 'admin'
        )
      );
  end if;
end $$;
