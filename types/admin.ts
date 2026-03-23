// 어드민 전용 타입 정의

export interface AdminStats {
  pendingVerifications: number;
  totalReviews: number;
  totalEntities: number;
  totalUsers: number;
  pendingReports: number;
  reviewsThisWeek: number;
  newUsersThisWeek: number;
}

export interface AdminVerification {
  id: string;
  userId: string;
  userNickname: string;
  userEmail: string;
  status: 'pending' | 'approved' | 'rejected';
  documentType: 'coe' | 'tuition_receipt' | 'enrollment' | 'agency' | 'student_id';
  schoolName: string;
  realName: string | null;
  department: string | null;
  schoolStatus: 'prospective' | 'enrolled' | 'graduated' | null;
  documentUrl: string | null;
  submittedAt: string;
  approvedAt: string | null;
  rejectionReason: string | null;
  reviewerId: string | null;
  reviewedAt: string | null;
}

export interface AdminReport {
  id: string;
  reporterId: string;
  reporterNickname: string;
  targetType: 'review' | 'board_post';
  targetId: string;
  targetPreview: string;
  reason: string;
  status: 'pending' | 'dismissed' | 'actioned';
  createdAt: string;
  reviewedAt: string | null;
  reviewerId: string | null;
}
