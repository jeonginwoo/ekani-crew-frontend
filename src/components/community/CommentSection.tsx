'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import MBTIBadge from './MBTIBadge';
import type { Comment, CreateCommentData } from '@/lib/api';

interface CommentSectionProps {
  comments: Comment[];
  onSubmit: (data: CreateCommentData) => Promise<void>;
  isLoading?: boolean;
}

function formatTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHour = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return '방금';
  if (diffMin < 60) return `${diffMin}분 전`;
  if (diffHour < 24) return `${diffHour}시간 전`;
  if (diffDay < 7) return `${diffDay}일 전`;
  return date.toLocaleDateString('ko-KR');
}

export default function CommentSection({ comments, onSubmit, isLoading = false }: CommentSectionProps) {
  const router = useRouter();
  const { isLoggedIn, user } = useAuth();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoggedIn || !user?.id) {
      router.push('/login');
      return;
    }

    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        author_id: user.id,
        content: content.trim(),
      });
      setContent('');
    } catch (error) {
      console.error('댓글 작성 실패:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-gray-800">댓글 {comments.length}개</h3>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="space-y-2">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={isLoggedIn ? '댓글을 입력하세요...' : '로그인 후 댓글을 작성할 수 있습니다'}
          disabled={!isLoggedIn || isSubmitting}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed"
          rows={3}
        />
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!isLoggedIn || !content.trim() || isSubmitting}
            className="px-4 py-2 bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-full text-sm font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? '등록 중...' : '댓글 등록'}
          </button>
        </div>
      </form>

      {/* Comments List */}
      {isLoading ? (
        <div className="py-8 text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500 mx-auto"></div>
        </div>
      ) : comments.length === 0 ? (
        <div className="py-8 text-center text-gray-400">
          아직 댓글이 없습니다. 첫 댓글을 작성해보세요!
        </div>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => (
            <div key={comment.id} className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <MBTIBadge mbti={comment.author_mbti} size="sm" />
                <span className="text-xs text-gray-400">{formatTime(comment.created_at)}</span>
              </div>
              <p className="text-gray-700 text-sm whitespace-pre-wrap">{comment.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}