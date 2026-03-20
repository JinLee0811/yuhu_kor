import type { AdminReport } from '@/types/admin';

export const mockAdminReports: AdminReport[] = [
  {
    id: 'rpt-1',
    reporterId: 'user-r1',
    reporterNickname: '익명유학생',
    targetType: 'review',
    targetId: 'review-mock-1',
    targetPreview: '이 유학원은 정말 최고예요! 담당자분이 너무 친절하시고 학교 입학부터 비자까지 완벽하게 도와주셨어요...',
    reason: '광고성 리뷰로 의심됩니다. 지나치게 긍정적이고 구체성이 없어요.',
    status: 'pending',
    createdAt: '2026-03-20T10:15:00Z',
    reviewedAt: null,
    reviewerId: null
  },
  {
    id: 'rpt-2',
    reporterId: 'user-r2',
    reporterNickname: '신고자B',
    targetType: 'review',
    targetId: 'review-mock-3',
    targetPreview: '직원이 너무 불친절하고 비용도 터무니없이 비쌌어요. 사기당한 기분이 들었고 환불도 안 해줬어요...',
    reason: '사실과 다른 허위 정보가 포함된 것 같아요.',
    status: 'pending',
    createdAt: '2026-03-19T16:40:00Z',
    reviewedAt: null,
    reviewerId: null
  },
  {
    id: 'rpt-3',
    reporterId: 'user-r3',
    reporterNickname: '게시판유저',
    targetType: 'board_post',
    targetId: 'post-mock-5',
    targetPreview: '학교 추천 부탁드립니다. 어디가 좋을까요? 제가 알기로는 A유학원이 제일 잘 해준다고 들었는데...',
    reason: '특정 유학원 홍보성 글로 의심됩니다.',
    status: 'dismissed',
    createdAt: '2026-03-18T09:00:00Z',
    reviewedAt: '2026-03-18T14:00:00Z',
    reviewerId: 'admin-001'
  },
  {
    id: 'rpt-4',
    reporterId: 'user-r4',
    reporterNickname: '모니터링봇',
    targetType: 'review',
    targetId: 'review-mock-7',
    targetPreview: '이 유학원 절대 가지마세요. 담당자가 개인정보를 팔았고 연락도 안 되고 환불도 안 해줘요...',
    reason: '개인 비방 및 명예훼손 우려',
    status: 'actioned',
    createdAt: '2026-03-17T13:00:00Z',
    reviewedAt: '2026-03-17T16:00:00Z',
    reviewerId: 'admin-001'
  },
  {
    id: 'rpt-5',
    reporterId: 'user-r5',
    reporterNickname: '제보자C',
    targetType: 'board_post',
    targetId: 'post-mock-9',
    targetPreview: '취업비자 받는 방법 공유합니다. 제가 직접 써봤는데 이렇게 하면 확실히 됩니다...',
    reason: '불법 행위를 조장하는 내용이 포함된 것 같아요.',
    status: 'pending',
    createdAt: '2026-03-20T07:30:00Z',
    reviewedAt: null,
    reviewerId: null
  }
];
