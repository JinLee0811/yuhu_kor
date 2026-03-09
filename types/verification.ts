export interface UserVerification {
  id: string;
  userId: string;
  status: 'pending' | 'approved' | 'rejected';
  documentType: 'coe' | 'tuition_receipt' | 'enrollment' | 'agency';
  schoolName: string;
  submittedAt: string;
  approvedAt: string | null;
  documentUrl?: string;
}
