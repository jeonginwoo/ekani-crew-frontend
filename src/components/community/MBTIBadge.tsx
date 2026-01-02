'use client';

interface MBTIBadgeProps {
  mbti: string | null;
  size?: 'sm' | 'md' | 'lg';
}

const MBTI_COLORS: Record<string, { bg: string; text: string }> = {
  // Analysts (NT)
  INTJ: { bg: 'bg-purple-100', text: 'text-purple-700' },
  INTP: { bg: 'bg-purple-100', text: 'text-purple-700' },
  ENTJ: { bg: 'bg-purple-100', text: 'text-purple-700' },
  ENTP: { bg: 'bg-purple-100', text: 'text-purple-700' },
  // Diplomats (NF)
  INFJ: { bg: 'bg-green-100', text: 'text-green-700' },
  INFP: { bg: 'bg-green-100', text: 'text-green-700' },
  ENFJ: { bg: 'bg-green-100', text: 'text-green-700' },
  ENFP: { bg: 'bg-green-100', text: 'text-green-700' },
  // Sentinels (SJ)
  ISTJ: { bg: 'bg-blue-100', text: 'text-blue-700' },
  ISFJ: { bg: 'bg-blue-100', text: 'text-blue-700' },
  ESTJ: { bg: 'bg-blue-100', text: 'text-blue-700' },
  ESFJ: { bg: 'bg-blue-100', text: 'text-blue-700' },
  // Explorers (SP)
  ISTP: { bg: 'bg-amber-100', text: 'text-amber-700' },
  ISFP: { bg: 'bg-amber-100', text: 'text-amber-700' },
  ESTP: { bg: 'bg-amber-100', text: 'text-amber-700' },
  ESFP: { bg: 'bg-amber-100', text: 'text-amber-700' },
};

const SIZE_CLASSES = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
};

export default function MBTIBadge({ mbti, size = 'sm' }: MBTIBadgeProps) {
  if (!mbti) {
    return (
      <span className={`${SIZE_CLASSES[size]} rounded-full bg-gray-100 text-gray-500 font-medium`}>
        ???
      </span>
    );
  }

  const colors = MBTI_COLORS[mbti.toUpperCase()] || { bg: 'bg-gray-100', text: 'text-gray-700' };

  return (
    <span className={`${SIZE_CLASSES[size]} rounded-full ${colors.bg} ${colors.text} font-medium`}>
      {mbti.toUpperCase()}
    </span>
  );
}