import type { ReviewType } from '@/types/review';

export interface ReviewSchemaItem {
  key: string;
  label: string;
  weight: number;
}

export const REVIEW_SCHEMAS: Record<ReviewType, ReviewSchemaItem[]> = {
  consultation: [
    { key: 'response_speed', label: '상담 연락 속도', weight: 1 },
    { key: 'consultation', label: '상담 퀄리티', weight: 1.5 },
    { key: 'accuracy', label: '정보 정확성', weight: 1.5 },
    { key: 'pressure', label: '압박 영업 없음', weight: 2 },
    { key: 'overall', label: '전반적 만족도', weight: 2 }
  ],
  full: [
    { key: 'consultation', label: '초기 상담', weight: 1 },
    { key: 'accuracy', label: '정보 정확성', weight: 1 },
    { key: 'transparency', label: '수수료 투명성', weight: 1.5 },
    { key: 'support', label: '비자/서류 지원', weight: 1.5 },
    { key: 'overall', label: '전반적 만족도', weight: 2 }
  ],
  aftercare: [
    { key: 'contact', label: '연락 응답 속도', weight: 1.5 },
    { key: 'support', label: '문제 해결 능력', weight: 2 },
    { key: 'promise', label: '약속 이행 여부', weight: 2 },
    { key: 'management', label: '지속적 관리', weight: 1.5 },
    { key: 'overall', label: '전반적 만족도', weight: 2 }
  ]
};
