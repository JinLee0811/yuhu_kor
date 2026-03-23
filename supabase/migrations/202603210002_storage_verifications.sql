-- ─────────────────────────────────────────────────────────────
-- Storage: verifications 버킷 생성 (비공개)
-- ─────────────────────────────────────────────────────────────

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'verifications',
  'verifications',
  false,
  5242880, -- 5MB 제한
  array['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
)
on conflict (id) do nothing;

-- ─────────────────────────────────────────────────────────────
-- Storage RLS 정책
-- ─────────────────────────────────────────────────────────────

-- 본인만 업로드 가능 (경로: verifications/{userId}/파일명)
do $$
begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'objects'
      and schemaname = 'storage'
      and policyname = 'verifications_insert_own'
  ) then
    create policy "verifications_insert_own"
      on storage.objects
      for insert
      with check (
        bucket_id = 'verifications'
        and auth.uid()::text = (storage.foldername(name))[1]
      );
  end if;
end $$;

-- 본인 또는 어드민만 열람 가능
do $$
begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'objects'
      and schemaname = 'storage'
      and policyname = 'verifications_select_own_or_admin'
  ) then
    create policy "verifications_select_own_or_admin"
      on storage.objects
      for select
      using (
        bucket_id = 'verifications'
        and (
          auth.uid()::text = (storage.foldername(name))[1]
          or exists (
            select 1 from public.profiles
            where id = auth.uid() and role = 'admin'
          )
        )
      );
  end if;
end $$;

-- 본인 또는 어드민만 삭제 가능 (검토 완료 후 서류 삭제 목적)
do $$
begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'objects'
      and schemaname = 'storage'
      and policyname = 'verifications_delete_own_or_admin'
  ) then
    create policy "verifications_delete_own_or_admin"
      on storage.objects
      for delete
      using (
        bucket_id = 'verifications'
        and (
          auth.uid()::text = (storage.foldername(name))[1]
          or exists (
            select 1 from public.profiles
            where id = auth.uid() and role = 'admin'
          )
        )
      );
  end if;
end $$;

-- ─────────────────────────────────────────────────────────────
-- user_verifications: document_url 컬럼 추가
-- ─────────────────────────────────────────────────────────────

alter table user_verifications
  add column if not exists document_url text;
