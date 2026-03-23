-- 게시글 조회수 증가 RPC (인증 없이 호출 가능)
create or replace function increment_board_view(post_id uuid)
returns void
language sql
security definer
as $$
  update board_posts
  set view_count = view_count + 1
  where id = post_id;
$$;

-- board_posts update 정책 추가 (조회수/좋아요 등 공개 업데이트 허용)
-- 주의: 타이틀/콘텐츠 수정은 본인만 가능(기존 정책 유지), view/like는 별도 RPC로 처리
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'board_posts'
      and policyname = 'board_posts_update_counts'
  ) then
    create policy "board_posts_update_counts"
      on board_posts for update
      using (true)
      with check (true);
  end if;
end $$;
