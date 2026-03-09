import type { UserVerification } from '@/types/verification';

export const mockUserVerifications: UserVerification[] = [
  {
    id: 'ver-1',
    userId: 'mock-user-1',
    status: 'approved',
    documentType: 'coe',
    schoolName: 'UNSW',
    submittedAt: '2026-02-20T09:00:00Z',
    approvedAt: '2026-02-21T03:30:00Z',
    documentUrl: '/mock/verification/coe-unsw.pdf'
  },
  {
    id: 'ver-2',
    userId: 'mock-user-pending',
    status: 'pending',
    documentType: 'enrollment',
    schoolName: 'UTS',
    submittedAt: '2026-03-05T12:00:00Z',
    approvedAt: null,
    documentUrl: '/mock/verification/enrollment-uts.pdf'
  }
];
