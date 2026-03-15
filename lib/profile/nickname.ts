export const PENDING_NICKNAME_PREFIX = '__pending__';

export function buildPendingNickname(userId: string) {
  return `${PENDING_NICKNAME_PREFIX}${userId.slice(0, 12)}`;
}

export function isPendingNickname(nickname?: string | null) {
  return !nickname || nickname.startsWith(PENDING_NICKNAME_PREFIX);
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
