-- 게시글 댓글 수 증가 RPC
create or replace function increment_board_comment_count(post_id uuid)
returns void
language sql
security definer
as $$
  update board_posts
  set comment_count = comment_count + 1
  where id = post_id;
$$;
