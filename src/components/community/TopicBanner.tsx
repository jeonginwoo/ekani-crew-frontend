'use client';

import type { Topic } from '@/lib/api';

interface TopicBannerProps {
  topic: Topic | null;
}

export default function TopicBanner({ topic }: TopicBannerProps) {
  if (!topic) return null;

  return (
    <div className="bg-gradient-to-r from-pink-400 to-purple-400 rounded-2xl p-4 text-white">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-lg">🔥</span>
        <span className="text-sm font-medium opacity-90">이주의 토픽</span>
      </div>
      <h2 className="text-lg font-bold">{topic.title}</h2>
      {topic.description && (
        <p className="text-sm opacity-90 mt-1">{topic.description}</p>
      )}
    </div>
  );
}