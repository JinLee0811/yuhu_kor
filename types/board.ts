export interface BoardPost {
  id: string;
  authorNickname: string;
  schoolVerification: {
    isVerified: boolean;
    schoolName: string | null;
  };
  isAnonymous: boolean;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
  viewCount: number;
  createdAt: string;
  schoolId?: string | null;
}
