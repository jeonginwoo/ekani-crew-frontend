'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import TopicBanner from '@/components/community/TopicBanner';
import {
  getCurrentTopic,
  getPosts,
  type Topic,
  type Post,
  type PostType,
} from '@/lib/api';
import { formatRelativeTime } from '@/lib/date';

type FilterType = 'all' | 'topic' | 'free';

export default function PostsClient() {
  const { isLoggedIn } = useAuth();

  const [topic, setTopic] = useState<Topic | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Load topic
      const topicData = await getCurrentTopic();
      setTopic(topicData);

      // Load posts
      const postType: PostType | undefined = filter === 'all' ? undefined : filter;
      const postsData = await getPosts(postType, page, 10);
      setPosts(postsData.items);
      setTotalPages(Math.ceil(postsData.total / postsData.size) || 1);
    } catch (err) {
      console.error('Failed to load posts:', err);
    } finally {
      setIsLoading(false);
    }
  }, [filter, page]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const handleFilterChange = (newFilter: FilterType) => {
    setFilter(newFilter);
    setPage(1);
  };

  const FILTER_OPTIONS: { value: FilterType; label: string }[] = [
    { value: 'all', label: '전체' },
    { value: 'topic', label: '토픽글' },
    { value: 'free', label: '자유글' },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Topic Banner */}
      <TopicBanner topic={topic} />

      {/* Posts Card */}
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
        {/* Header with Filter */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold text-gray-800">게시판</h1>
            {isLoggedIn && (
              <Link
                href="/community/posts/new"
                className="px-4 py-2 bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-full text-sm font-medium hover:opacity-90 transition"
              >
                글쓰기
              </Link>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mt-4">
            {FILTER_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => handleFilterChange(option.value)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                  filter === option.value
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Posts List */}
        {isLoading ? (
          <div className="py-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-4xl mb-3">📝</p>
            <p className="text-gray-500">아직 게시글이 없어요</p>
            {isLoggedIn && (
              <p className="text-gray-400 text-sm mt-1">첫 번째 글을 작성해보세요!</p>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/community/posts/${post.id}`}
                className="block px-6 py-4 hover:bg-gray-50 transition"
              >
                <div className="flex items-start gap-3">
                  {/* Post Type Badge */}
                  <span
                    className={`shrink-0 px-2 py-0.5 rounded text-xs font-medium ${
                      post.post_type === 'topic'
                        ? 'bg-pink-100 text-pink-600'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {post.post_type === 'topic' ? '토픽' : '자유'}
                  </span>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-800 truncate">{post.title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2 mt-1">{post.content}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                      <span>{formatRelativeTime(post.created_at)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 flex justify-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 rounded-lg bg-gray-100 text-gray-600 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition"
            >
              이전
            </button>
            <span className="px-3 py-1 text-sm text-gray-600">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 rounded-lg bg-gray-100 text-gray-600 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition"
            >
              다음
            </button>
          </div>
        )}
      </div>
    </div>
  );
}