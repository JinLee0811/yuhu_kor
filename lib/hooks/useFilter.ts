'use client';

import { create } from 'zustand';

interface FilterState {
  specialties: string[];
  city: string;
  minScore: number;
  sort: 'review_count' | 'score_desc' | 'latest';
  setSpecialties: (specialties: string[]) => void;
  setCity: (city: string) => void;
  setMinScore: (score: number) => void;
  setSort: (sort: 'review_count' | 'score_desc' | 'latest') => void;
}

export const useFilter = create<FilterState>((set) => ({
  specialties: [],
  city: '',
  minScore: 0,
  sort: 'review_count',
  setSpecialties: (specialties) => set({ specialties }),
  setCity: (city) => set({ city }),
  setMinScore: (minScore) => set({ minScore }),
  setSort: (sort) => set({ sort })
}));
