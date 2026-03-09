export const mockUser = {
  id: 'mock-user-1',
  email: 'test@test.com',
  nickname: '시드니유학생_0000',
  trust_score: 10,
  review_count: 2,
  verified_at: null as string | null
};

let isLoggedIn = true;

export function getMockAuth() {
  return { user: mockUser, isLoggedIn };
}

export function toggleMockAuth(next?: boolean) {
  isLoggedIn = typeof next === 'boolean' ? next : !isLoggedIn;
  return getMockAuth();
}
