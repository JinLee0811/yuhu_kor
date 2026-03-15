'use client';

import { create } from 'zustand';

interface AuthState {
  isReady: boolean;
  isLoggedIn: boolean;
  userId: string | null;
  email: string | null;
  nickname: string;
  hasNickname: boolean;
  role: 'user' | 'admin';
  verificationStatus: 'none' | 'pending' | 'approved' | 'rejected';
  verifiedSchoolName: string | null;
  setAuth: (payload: {
    isLoggedIn: boolean;
    userId: string | null;
    email: string | null;
    nickname: string;
    hasNickname: boolean;
    role: 'user' | 'admin';
    verificationStatus: 'none' | 'pending' | 'approved' | 'rejected';
    verifiedSchoolName: string | null;
  }) => void;
  markReady: () => void;
  clearAuth: () => void;
  setVerificationStatus: (status: 'none' | 'pending' | 'approved' | 'rejected', schoolName?: string | null) => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  isReady: false,
  isLoggedIn: false,
  userId: null,
  email: null,
  nickname: '유학생A',
  hasNickname: false,
  role: 'user',
  verificationStatus: 'none',
  verifiedSchoolName: null,
  setAuth: (payload) =>
    set({
      isReady: true,
      ...payload
    }),
  markReady: () => set({ isReady: true }),
  clearAuth: () =>
    set({
      isReady: true,
      isLoggedIn: false,
      userId: null,
      email: null,
      nickname: '유학생A',
      hasNickname: false,
      role: 'user',
      verificationStatus: 'none',
      verifiedSchoolName: null
    }),
  setVerificationStatus: (status, schoolName) =>
    set({
      verificationStatus: status,
      verifiedSchoolName: schoolName ?? null
    })
}));
