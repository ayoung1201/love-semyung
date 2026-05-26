'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

type ScoreRecord = {
  id: number;
  name: string;
  score: number;
  created_at: string;
};

export default function Home() {
  const [name, setName] = useState('');
  const [leaderboard, setLeaderboard] = useState<ScoreRecord[]>([]);
  const router = useRouter();

  const fetchLeaderboard = useCallback(async () => {
    try {
      const res = await fetch('/api/scores');
      if (res.ok) {
        const data = await res.json();
        setLeaderboard(data);
      }
    } catch (err) {
      console.error('Failed to fetch leaderboard:', err);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    router.push(`/mole?name=${encodeURIComponent(name.trim())}`);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-pink-50">
      <h1 className="text-5xl font-black mb-4 text-pink-600 tracking-tight">푸린 잡기</h1>
      <p className="mb-12 text-lg text-gray-600 text-center font-medium">
        100점 이상 달성 시 선물이! 🎁
      </p>
      
      <div className="w-full max-w-sm bg-white p-8 rounded-3xl shadow-xl border-2 border-pink-100 mb-8">
        <form onSubmit={handleStart} className="flex flex-col gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2 ml-1">
              닉네임 입력
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름을 입력해주세요"
              className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-pink-300 focus:outline-none transition-all text-lg"
              maxLength={10}
              required
            />
          </div>
          
          <button 
            type="submit"
            className="w-full py-4 bg-pink-500 hover:bg-pink-600 text-white font-bold text-xl rounded-2xl shadow-lg shadow-pink-200 transition-all active:scale-95"
          >
            게임 시작하기! 🚀
          </button>
        </form>
      </div>

      {/* 순위표 (SCORE Ranking) */}
      <div className="w-full max-w-sm bg-white p-6 rounded-3xl shadow-xl border-2 border-pink-100">
        <h2 className="text-xl font-black mb-6 flex items-center justify-center gap-2 text-gray-800">
          🏆 SCORE (RANKING)
        </h2>
        <div className="space-y-3">
          {leaderboard.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-4">아직 기록이 없습니다.</p>
          ) : (
            leaderboard.map((item, idx) => (
              <div key={item.id} className="flex justify-between items-center p-3 rounded-xl bg-gray-50">
                <div className="flex items-center gap-3">
                  <span className={`font-bold w-6 h-6 flex items-center justify-center rounded-full text-xs ${idx < 3 ? 'bg-pink-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                    {idx + 1}
                  </span>
                  <span className="font-bold text-gray-700">{item.name}</span>
                </div>
                <span className="font-black text-pink-600">{item.score}점</span>
              </div>
            ))
          )}
        </div>
      </div>

      <footer className="mt-12 text-gray-400 text-sm">
        © 2026 ahyoung. All rights reserved.
      </footer>
    </main>
  );
}
