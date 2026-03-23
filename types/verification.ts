export type DocumentType = 'coe' | 'tuition_receipt' | 'enrollment' | 'agency' | 'student_id';
export type SchoolStatus = 'prospective' | 'enrolled' | 'graduated';

export const SCHOOL_STATUS_LABEL: Record<SchoolStatus, string> = {
  prospective: '입학 예정',
  enrolled: '재학생',
  graduated: '졸업생'
};

export const DOCUMENT_TYPE_LABEL: Record<DocumentType, string> = {
  coe: 'COE (Confirmation of Enrolment)',
  tuition_receipt: '등록금 납부 영수증',
  enrollment: '재학증명서',
  student_id: '학생증',
  agency: '유학원 등록 증빙 서류'
};

export interface UserVerification {
  id: string;
  userId: string;
  status: 'pending' | 'approved' | 'rejected';
  documentType: DocumentType;
  schoolName: string;
  realName?: string | null;
  department?: string | null;
  schoolStatus?: SchoolStatus | null;
  submittedAt: string;
  approvedAt: string | null;
  documentUrl?: string;
}
