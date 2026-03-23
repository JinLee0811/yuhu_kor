-- 어드민이 게시글 삭제 가능하도록 RLS 정책 추가

-- 어드민 role 확인 헬퍼 함수
create or replace function is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from profiles
    where id = auth.uid()
    and role = 'admin'
  );
$$;

-- board_posts 어드민 삭제 정책
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'board_posts'
      and policyname = 'board_posts_delete_admin'
  ) then
    create policy "board_posts_delete_admin"
      on board_posts for delete
      using (is_admin());
  end if;
end $$;

-- board_comments 어드민 삭제 정책
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'board_comments'
      and policyname = 'board_comments_delete_admin'
  ) then
    create policy "board_comments_delete_admin"
      on board_comments for delete
      using (is_admin());
  end if;
end $$;
