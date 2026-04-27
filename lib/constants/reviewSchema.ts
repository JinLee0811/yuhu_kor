import type { ReviewType } from '@/types/review';

export interface ReviewSchemaItem {
  key: string;
  label: string;
  weight: number;
  // 별점 기준 — 1·3·5점이 어떤 경험인지 명시 (응답자 간 편차 축소)
  criteria?: {
    low: string; // 1점
    mid: string; // 3점
    high: string; // 5점
  };
}

export const REVIEW_SCHEMAS: Record<ReviewType, ReviewSchemaItem[]> = {
  consultation: [
    {
      key: 'response_speed',
      label: '상담 연락 속도',
      weight: 1,
      criteria: { low: '며칠 걸리거나 답 없음', mid: '하루~이틀 내', high: '1시간 내 즉시 답변' }
    },
    {
      key: 'consultation',
      label: '상담 퀄리티',
      weight: 1.5,
      criteria: { low: '형식적·매뉴얼 답변', mid: '무난하지만 깊이 부족', high: '내 상황 깊이 파악 + 맞춤 제안' }
    },
    {
      key: 'accuracy',
      label: '정보 정확성',
      weight: 1.5,
      criteria: { low: '잘못된 정보·번복 잦음', mid: '대체로 맞지만 일부 모름', high: '정확하고 최신 정보' }
    },
    {
      key: 'pressure',
      label: '압박 영업 없음',
      weight: 2,
      criteria: { low: '계속 결정·등록 재촉', mid: '약간 권유 있음', high: '부담 0, 내 결정 존중' }
    },
    {
      key: 'overall',
      label: '전반적 만족도',
      weight: 2,
      criteria: { low: '다시는 안 가요', mid: '무난', high: '적극 추천' }
    }
  ],
  full: [
    {
      key: 'consultation',
      label: '초기 상담',
      weight: 1,
      criteria: { low: '무성의·정보 부정확', mid: '무난', high: '깊이 있고 친절한 상담' }
    },
    {
      key: 'accuracy',
      label: '정보 정확성',
      weight: 1,
      criteria: { low: '잘못된 정보로 손해', mid: '대체로 맞음', high: '정확하고 최신' }
    },
    {
      key: 'transparency',
      label: '수수료 투명성',
      weight: 1.5,
      criteria: { low: '숨겨진 비용 많음', mid: '대체로 명확', high: '모든 비용 사전 공개' }
    },
    {
      key: 'support',
      label: '비자/서류 지원',
      weight: 1.5,
      criteria: { low: '알아서 하라는 식', mid: '안내는 해주지만 본인이 챙겨야', high: '끝까지 책임지고 처리' }
    },
    {
      key: 'overall',
      label: '전반적 만족도',
      weight: 2,
      criteria: { low: '다시는 안 가요', mid: '무난', high: '적극 추천' }
    }
  ],
  aftercare: [
    {
      key: 'contact',
      label: '연락 응답 속도',
      weight: 1.5,
      criteria: { low: '연락 안 됨', mid: '며칠 걸려야 답변', high: '즉시 응답' }
    },
    {
      key: 'support',
      label: '문제 해결 능력',
      weight: 2,
      criteria: { low: '도움 안 됨', mid: '부분 해결', high: '책임지고 해결' }
    },
    {
      key: 'promise',
      label: '약속 이행 여부',
      weight: 2,
      criteria: { low: '약속 거의 안 지킴', mid: '일부만 이행', high: '모두 이행' }
    },
    {
      key: 'management',
      label: '지속적 관리',
      weight: 1.5,
      criteria: { low: '관리 거의 없음', mid: '가끔 확인 연락', high: '정기적 케어' }
    },
    {
      key: 'overall',
      label: '전반적 만족도',
      weight: 2,
      criteria: { low: '다시는 안 가요', mid: '무난', high: '적극 추천' }
    }
  ]
};
