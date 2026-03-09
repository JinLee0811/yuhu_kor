export function generateAnonymousNickname(): string {
  const digits = String(Math.floor(1000 + Math.random() * 9000));
  return `호주유학생_${digits}`;
}
