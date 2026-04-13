/**
 * 텍스트 입력에서 school_id를 추론하는 유틸
 * mock 의존성 없이 동일 로직을 유지
 * (추후 DB schools 테이블의 name/aliases 필드로 대체 가능)
 */

const SCHOOL_ALIASES: Record<string, string[]> = {
  's-unsw': ['unsw'],
  's-uts': ['uts', 'university of technology sydney'],
  's-tafe-nsw': ['tafe nsw'],
  's-rmit': ['rmit'],
  's-usyd': ['university of sydney', 'sydney university', 'usyd'],
  's-mq': ['macquarie university', 'macquarie']
};

export function findSchoolIdByText(source?: string | null): string | null {
  if (!source) return null;
  const normalized = source.toLowerCase();
  const matched = Object.entries(SCHOOL_ALIASES).find(([, aliases]) =>
    aliases.some((alias) => normalized.includes(alias))
  );
  return matched?.[0] ?? null;
}
