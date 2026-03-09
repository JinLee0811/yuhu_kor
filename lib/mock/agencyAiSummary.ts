import { reviews } from '@/lib/mock-db';

const POSITIVE_TAG_COPY: Record<string, string> = {
  '연락/응답이 빨랐어요': '응답이 빠르다는 얘기가 많고',
  '압박 없이 편하게 상담했어요': '상담이 편하다는 평이 많고',
  '입학 서류 준비를 체계적으로 도와줬어요': '서류 진행이 체계적이라는 말이 많고',
  '학교 오리엔테이션 전까지 꼼꼼히 챙겨줬어요': '등록 전 챙김이 꼼꼼하다는 후기가 많고',
  '비자 연장 시기를 미리 알려줬어요': '비자 일정 안내가 꼼꼼하다는 얘기가 있고',
  '비용을 투명하게 설명해줬어요': '비용 설명이 깔끔하다는 평이 많고',
  '문제가 생겼을 때 빠르게 해결해줬어요': '이슈 대응이 빠르다는 얘기가 많고'
};

const NEGATIVE_TAG_COPY: Record<string, string> = {
  '비용 설명이 불명확했어요': '비용 설명은 더 또렷했으면 좋겠다는 말이 보여요.',
  '등록하고 나서 연락이 뜸해졌어요': '등록 후 연락 속도는 아쉽다는 후기가 보여요.',
  '사후 관리가 거의 없었어요': '사후 관리는 약하다는 얘기가 보여요.',
  '연락이 잘 안 됐어요': '응답 템포는 들쭉날쭉하다는 말이 있어요.',
  '학교 문제 생겼을 때 도움을 못 받았어요': '문제 상황 대응은 아쉽다는 후기가 보여요.'
};

function getTopTag(tags: string[]) {
  const counts = new Map<string, number>();
  tags.forEach((tag) => counts.set(tag, (counts.get(tag) ?? 0) + 1));
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
}

export function getAgencyAiSummary(entityId: string): string | null {
  const entityReviews = reviews.filter((review) => review.entity_id === entityId);
  if (entityReviews.length === 0) return null;

  const prosTags = entityReviews.flatMap((review) => review.meta.pros_tags ?? []);
  const consTags = entityReviews.flatMap((review) => review.meta.cons_tags ?? []);
  const avgScore = entityReviews.reduce((sum, review) => sum + review.score_total, 0) / entityReviews.length;

  const topPros = getTopTag(prosTags);
  const topCons = getTopTag(consTags);

  const positiveCopy =
    (topPros && POSITIVE_TAG_COPY[topPros]) || (avgScore >= 4.2 ? '전반 만족도는 높은 편이고' : avgScore >= 3.6 ? '전반 평가는 무난한 편이고' : null);
  const negativeCopy =
    (topCons && NEGATIVE_TAG_COPY[topCons]) || (avgScore < 3.4 ? '호불호가 꽤 갈리는 편이에요.' : entityReviews.length >= 3 ? '세부 경험 차이는 조금 있는 편이에요.' : null);

  if (positiveCopy && negativeCopy) return `${positiveCopy} ${negativeCopy}`;
  if (positiveCopy) return `${positiveCopy} 대체로 안정적이라는 후기가 보여요.`;
  if (negativeCopy) return negativeCopy;
  return '후기 기준으로 보면 전반 경험은 무난한 편이라는 얘기가 보여요.';
}
