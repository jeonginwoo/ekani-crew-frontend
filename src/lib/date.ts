import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ko';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.locale('ko');

const KST = 'Asia/Seoul';

/**
 * UTC 문자열을 한국 시간 dayjs 객체로 변환
 */
export function toKST(dateString: string): dayjs.Dayjs {
  // Z가 없으면 UTC로 간주하고 파싱
  const utcString = dateString.endsWith('Z') ? dateString : dateString + 'Z';
  return dayjs.utc(utcString).tz(KST);
}

/**
 * 상대 시간 표시 (방금, 5분 전, 2시간 전, 3일 전 등)
 */
export function formatRelativeTime(dateString: string): string {
  const date = toKST(dateString);
  const now = dayjs().tz(KST);
  const diffMin = now.diff(date, 'minute');
  const diffHour = now.diff(date, 'hour');
  const diffDay = now.diff(date, 'day');

  if (diffMin < 1) return '방금';
  if (diffMin < 60) return `${diffMin}분 전`;
  if (diffHour < 24) return `${diffHour}시간 전`;
  if (diffDay < 7) return `${diffDay}일 전`;
  return date.format('YYYY.MM.DD');
}

/**
 * 시:분 형식으로 표시 (예: 오후 3:45)
 */
export function formatTime(dateString: string): string {
  return toKST(dateString).format('A h:mm');
}

/**
 * 날짜 형식으로 표시 (예: 2025.01.03)
 */
export function formatDate(dateString: string): string {
  return toKST(dateString).format('YYYY.MM.DD');
}

/**
 * 날짜와 시간 형식으로 표시 (예: 2025.01.03 오후 3:45)
 */
export function formatDateTime(dateString: string): string {
  return toKST(dateString).format('YYYY.MM.DD A h:mm');
}

/**
 * Date 객체로 변환 (한국 시간 기준)
 */
export function toDate(dateString: string): Date {
  return toKST(dateString).toDate();
}