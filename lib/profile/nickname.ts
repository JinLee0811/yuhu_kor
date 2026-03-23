export const PENDING_NICKNAME_PREFIX = '__pending__';

export function buildPendingNickname(userId: string) {
  return `${PENDING_NICKNAME_PREFIX}${userId.slice(0, 12)}`;
}

export function isPendingNickname(nickname?: string | null) {
  return !nickname || nickname.startsWith(PENDING_NICKNAME_PREFIX);
}

// 랜덤 닉네임 앞 단어 목록 (익명성 원칙 준수 — 실명/SNS 닉네임 절대 불가)
const NICKNAME_WORDS = [
  '호주유학생', '시드니짱', '멜버른킹', '브리즈번퀸',
  '캔버라짱', '골드코스트', '퍼스코알라', '애들레이드',
  '호주코알라', '캥거루맨', '왈라비맨', '오지이민자',
  '호주드리머', '시드니러버', '멜버른러버', '호주유학러',
  '오지유학생', '코알라러버', '썬샤인유학', '오세아니아',
];

/**
 * 가입 즉시 자동 배정할 랜덤 닉네임 생성 (클라이언트/서버 모두 사용 가능)
 * 형식: 호주코알라_3847
 */
export function generateRandomNickname(): string {
  const word = NICKNAME_WORDS[Math.floor(Math.random() * NICKNAME_WORDS.length)];
  const num = 1000 + Math.floor(Math.random() * 9000);
  return `${word}_${num}`;
}

export function normalizeNicknameInput(nickname: string) {
  return nickname.trim();
}

export function validateNickname(nickname: string) {
  const value = normalizeNicknameInput(nickname);

  if (value.length < 2) {
    return '닉네임은 2자 이상이어야 해요.';
  }

  if (value.length > 12) {
    return '닉네임은 12자 이하로 맞춰줘요.';
  }

  if (isPendingNickname(value)) {
    return '이 닉네임은 사용할 수 없어요.';
  }

  if (!/^[0-9A-Za-z가-힣_]+$/.test(value)) {
    return '닉네임은 한글, 영문, 숫자, 밑줄(_)만 사용할 수 있어요.';
  }

  return null;
}
