'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import {
  getCurrentTopic,
  createPost,
  type Topic,
  type PostType,
} from '@/lib/api';

export default function NewPostClient() {
  const router = useRouter();
  const { isLoggedIn, user, loading: authLoading } = useAuth();

  const [topic, setTopic] = useState<Topic | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [postType, setPostType] = useState<PostType>('free');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      router.push('/login');
    }
  }, [authLoading, isLoggedIn, router]);

  useEffect(() => {
    const loadTopic = async () => {
      const topicData = await getCurrentTopic();
      setTopic(topicData);
    };
    void loadTopic();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id) {
      router.push('/login');
      return;
    }

    if (!title.trim() || !content.trim()) {
      setError('제목과 내용을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const post = await createPost({
        author_id: user.id,
        title: title.trim(),
        content: content.trim(),
        post_type: postType,
        topic_id: postType === 'topic' && topic ? topic.id : null,
      });

      router.push(`/community/posts/${post.id}`);
    } catch (err) {
      console.error('Failed to create post:', err);
      setError('게시글 작성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Back Link */}
      <Link
        href="/community/posts"
        className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-700 transition"
      >
        <span>←</span>
        <span className="text-sm">목록으로</span>
      </Link>

      {/* Form */}
      <div className="bg-white rounded-3xl shadow-lg p-6">
        <h1 className="text-xl font-bold text-gray-800 mb-6">새 글 작성</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Post Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              글 종류
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setPostType('free')}
                className={`flex-1 py-3 rounded-xl font-medium transition ${
                  postType === 'free'
                    ? 'bg-gray-800 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                자유글
              </button>
              <button
                type="button"
                onClick={() => setPostType('topic')}
                disabled={!topic}
                className={`flex-1 py-3 rounded-xl font-medium transition ${
                  postType === 'topic'
                    ? 'bg-gradient-to-r from-pink-400 to-purple-400 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                토픽글
                {topic && <span className="block text-xs opacity-80 mt-0.5">{topic.title}</span>}
              </button>
            </div>
            {!topic && (
              <p className="text-xs text-gray-400 mt-2">현재 진행 중인 토픽이 없습니다.</p>
            )}
          </div>

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              제목
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력하세요"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
              maxLength={100}
            />
          </div>

          {/* Content */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              내용
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="내용을 입력하세요"
              rows={10}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm text-center">
              {error}
            </div>
          )}

          {/* Submit */}
          <div className="flex gap-3">
            <Link
              href="/community/posts"
              className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-full font-medium text-center hover:bg-gray-200 transition"
            >
              취소
            </Link>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim() || !content.trim()}
              className="flex-1 py-3 bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-full font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? '등록 중...' : '글 등록'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}