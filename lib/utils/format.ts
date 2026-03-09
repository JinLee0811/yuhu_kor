import { format } from 'date-fns';

export function formatDate(date: string | Date): string {
  return format(new Date(date), 'yyyy.MM.dd');
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('ko-KR').format(value);
}
