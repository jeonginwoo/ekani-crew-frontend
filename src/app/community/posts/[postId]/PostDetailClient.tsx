'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import CommentSection from '@/components/community/CommentSection';
import {
  getPost,
  getPostComments,
  createPostComment,
  type Post,
  type Comment,
  type CreateCommentData,
} from '@/lib/api';

function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function PostDetailClient() {
  const params = useParams();
  const router = useRouter();
  const postId = params.postId as string;

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!postId) return;

    setIsLoading(true);
    setError(null);

    try {
      const postData = await getPost(postId);
      setPost(postData);

      setIsLoadingComments(true);
      const commentsData = await getPostComments(postId);
      setComments(commentsData.items);
      setIsLoadingComments(false);
    } catch (err: any) {
      console.error('Failed to load post:', err);
      const message = err?.message || '';
      if (message.includes('404')) {
        setError('게시글을 찾을 수 없습니다.');
      } else {
        setError('게시글을 불러오는데 실패했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const handleCommentSubmit = async (data: CreateCommentData) => {
    if (!postId) return;

    const newComment = await createPostComment(postId, data);
    setComments((prev) => [...prev, newComment]);
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
          <p className="text-4xl mb-4">😢</p>
          <p className="text-gray-500 mb-4">{error || '게시글을 찾을 수 없습니다.'}</p>
          <button
            onClick={() => router.push('/community/posts')}
            className="px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm font-medium hover:bg-gray-200 transition"
          >
            목록으로 돌아가기
          </button>
        </div>
      </div>
    );
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

      {/* Post Content */}
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start gap-3 mb-4">
            <span
              className={`shrink-0 px-2 py-0.5 rounded text-xs font-medium ${
                post.post_type === 'topic'
                  ? 'bg-pink-100 text-pink-600'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {post.post_type === 'topic' ? '토픽' : '자유'}
            </span>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-800">{post.title}</h1>
              <p className="text-sm text-gray-400 mt-1">{formatTime(post.created_at)}</p>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="bg-white rounded-3xl shadow-lg p-6">
        <CommentSection
          comments={comments}
          onSubmit={handleCommentSubmit}
          isLoading={isLoadingComments}
        />
      </div>
    </div>
  );
}