import type { Category } from '@/types/category';

export const categories: Category[] = [
  {
    id: 'cat-agency',
    slug: 'agency',
    name: '유학원',
    sort_order: 1,
    is_active: true,
    review_schema: [
      { key: 'consultation', label: '초기 상담', weight: 1 },
      { key: 'accuracy', label: '정보 정확성', weight: 1 },
      { key: 'transparency', label: '수수료 투명성', weight: 1.5 },
      { key: 'aftercare', label: '사후 관리', weight: 1.5 },
      { key: 'overall', label: '전반적 만족도', weight: 2 }
    ]
  },
  {
    id: 'cat-school',
    slug: 'school',
    name: '학교',
    sort_order: 2,
    is_active: true,
    review_schema: [
      { key: 'quality', label: '수업 퀄리티', weight: 1.5 },
      { key: 'environment', label: '학습 환경', weight: 1 },
      { key: 'staff', label: '교직원 친절도', weight: 1 },
      { key: 'value', label: '학비 대비 만족도', weight: 1.5 },
      { key: 'overall', label: '전반적 만족도', weight: 2 }
    ]
  },
  {
    id: 'cat-part-time',
    slug: 'part-time',
    name: '알바',
    sort_order: 3,
    is_active: true,
    review_schema: [
      { key: 'wage', label: '급여 정확성', weight: 2 },
      { key: 'environment', label: '근무 환경', weight: 1.5 },
      { key: 'management', label: '사장/매니저 태도', weight: 1.5 },
      { key: 'overall', label: '전반적 만족도', weight: 2 }
    ]
  }
];
