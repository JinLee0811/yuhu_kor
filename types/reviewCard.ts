import type { ReviewType } from './review';

export type ReviewCardType = 'consultation' | 'enrollment' | 'aftercare';

export interface ReviewCardData {
  id: string;
  reviewType: ReviewCardType;
  isVerified: boolean;
  isDirectlyConfirmed: boolean;
  authorNickname: string;
  year: number;
  purpose: string;
  agencyName: string;
  agencySlug?: string | null;
  rating: number;
  prosTags: string[];
  consTags: string[];
  prosText: string | null;
  consText: string | null;
  extraCost: {
    exists: boolean;
    types: string[];
    amount: number | null;
    currency: 'AUD' | 'KRW' | null;
    isPublic: boolean;
  };
  summary: string;
  likeCount: number;
  commentCount: number;
  createdAt: string;
}

export interface Comment {
  id: string;
  reviewId: string;
  parentId: string | null;
  authorNickname: string;
  mentionNickname?: string | null;
  content: string;
  likeCount: number;
  createdAt: string;
  replies?: Comment[];
}

