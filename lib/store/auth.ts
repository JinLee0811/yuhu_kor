'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mockUserVerifications } from '@/lib/mock/verifications';

interface AuthState {
  isLoggedIn: boolean;
  userId: string | null;
  nickname: string;
  verificationStatus: 'none' | 'pending' | 'approved' | 'rejected';
  verifiedSchoolName: string | null;
  login: (nickname?: string) => void;
  logout: () => void;
  submitVerification: (schoolName: string) => void;
  setVerificationStatus: (status: 'none' | 'pending' | 'approved' | 'rejected', schoolName?: string | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      userId: null,
      nickname: '유학생A',
      verificationStatus: 'none',
      verifiedSchoolName: null,
      login: (nickname) => {
        const userId = 'mock-user-1';
        const matchedVerification = mockUserVerifications.find((item) => item.userId === userId && item.status === 'approved');

        set({
          isLoggedIn: true,
          userId,
          nickname: nickname || '유학생A',
          verificationStatus: matchedVerification ? 'approved' : 'none',
          verifiedSchoolName: matchedVerification?.schoolName ?? null
        });
      },
      logout: () =>
        set({
          isLoggedIn: false,
          userId: null,
          verificationStatus: 'none',
          verifiedSchoolName: null
        }),
      submitVerification: (schoolName) =>
        set({
          verificationStatus: 'pending',
          verifiedSchoolName: schoolName
        }),
      setVerificationStatus: (status, schoolName) =>
        set({
          verificationStatus: status,
          verifiedSchoolName: schoolName ?? null
        })
    }),
    {
      name: 'yuhu-auth'
    }
  )
);
