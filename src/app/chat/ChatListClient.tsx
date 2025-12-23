'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

// 더미 데이터 (API 연동 전까지 사용)
interface ChatRoom {
  id: string;
  partnerMbti: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

const DUMMY_CHAT_ROOMS: ChatRoom[] = [
  {
    id: 'room_1',
    partnerMbti: 'ENFP',
    lastMessage: '안녕하세요! 반가워요 😊',
    lastMessageTime: '방금',
    unreadCount: 2,
  },
  {
    id: 'room_2',
    partnerMbti: 'INTJ',
    lastMessage: '오늘 날씨가 좋네요',
    lastMessageTime: '5분 전',
    unreadCount: 0,
  },
  {
    id: 'room_3',
    partnerMbti: 'INFP',
    lastMessage: '그 책 정말 재미있었어요!',
    lastMessageTime: '1시간 전',
    unreadCount: 0,
  },
];

export default function ChatListClient() {
  const router = useRouter();
  const { isLoggedIn, loading } = useAuth();

  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 로그인 체크
  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.push('/login');
    }
  }, [loading, isLoggedIn, router]);

  // 채팅방 목록 로드 (더미 데이터)
  useEffect(() => {
    if (isLoggedIn) {
      // TODO: API 연동 시 실제 데이터로 교체
      setTimeout(() => {
        setChatRooms(DUMMY_CHAT_ROOMS);
        setIsLoading(false);
      }, 500);
    }
  }, [isLoggedIn]);

  const handleRoomClick = (roomId: string) => {
    router.push(`/chat/${roomId}`);
  };

  if (loading || isLoading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
        {/* 타이틀 */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-800">채팅</h1>
            <button
              onClick={() => router.push('/matching')}
              className="px-4 py-2 bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-full text-sm font-medium hover:opacity-90 transition"
            >
              새 매칭
            </button>
          </div>

          {/* 채팅방 목록 */}
          {chatRooms.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-5xl mb-4">💬</p>
              <p className="text-gray-500 mb-4">아직 채팅방이 없어요</p>
              <button
                onClick={() => router.push('/matching')}
                className="px-6 py-3 bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-full font-medium hover:opacity-90 transition"
              >
                매칭 시작하기
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {chatRooms.map((room) => (
                <button
                  key={room.id}
                  onClick={() => handleRoomClick(room.id)}
                  className="w-full px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition text-left"
                >
                  {/* MBTI 아바타 */}
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {room.partnerMbti.slice(0, 2)}
                  </div>

                  {/* 채팅 정보 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-800">
                        {room.partnerMbti}
                      </span>
                      <span className="text-xs text-gray-400">
                        {room.lastMessageTime}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 truncate">
                      {room.lastMessage}
                    </p>
                  </div>

                  {/* 안 읽은 메시지 */}
                  {room.unreadCount > 0 && (
                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-medium shrink-0">
                      {room.unreadCount}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

      {/* 안내 문구 */}
      <div className="mt-6 text-center text-gray-400 text-sm">
        <p>채팅방 목록은 더미 데이터입니다.</p>
        <p>실제 API 연동 후 실제 데이터로 교체됩니다.</p>
      </div>
    </div>
  );
}
