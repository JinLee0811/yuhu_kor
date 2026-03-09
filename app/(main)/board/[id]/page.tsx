import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getBoardPost } from '@/lib/mock/board';
import { BoardPostDetail } from '@/components/board/BoardPostDetail';

interface Params {
  id: string;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const post = await getBoardPost(params.id);
  if (!post) {
    return {
      title: '게시판 | 유후'
    };
  }

  return {
    title: `${post.title} | 학교생활 게시판 | 유후`,
    description: '인증된 유학생들이 남긴 학교생활 이야기를 확인해보세요.'
  };
}

export default async function BoardDetailPage({ params }: { params: Params }) {
  const post = await getBoardPost(params.id);
  if (!post) notFound();

  return <BoardPostDetail post={post} />;
}
