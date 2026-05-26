'use client';

import { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import CouponModal from '@/components/CouponModal';

type ScoreRecord = {
  id: number;
  name: string;
  score: number;
  created_at: string;
};

function MoleGameContent() {
  const searchParams = useSearchParams();
  const nameFromUrl = searchParams.get('name') || '익명';

  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [isActive, setIsActive] = useState(false);
  const [moleIndex, setMoleIndex] = useState<number | null>(null);
  const [leaderboard, setLeaderboard] = useState<ScoreRecord[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const moleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

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

  const saveScore = useCallback(async (finalScore: number) => {
    if (finalScore === 0) return;
    setIsSaving(true);
    try {
      const res = await fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: nameFromUrl, score: finalScore }),
      });
      if (res.ok) {
        fetchLeaderboard();
      } else {
        const errData = await res.json();
        console.error('Save score API error:', errData);
      }
    } catch (err) {
      console.error('Failed to save score:', err);
    } finally {
      setIsSaving(false);
    }
  }, [nameFromUrl, fetchLeaderboard]);

  const endGame = useCallback(() => {
    setIsActive(false);
    setMoleIndex(null);
    setGameEnded(true);
    if (timerRef.current) clearInterval(timerRef.current);
    if (moleTimerRef.current) clearTimeout(moleTimerRef.current);

    saveScore(score);

    if (score >= 100) {
      setIsModalOpen(true);
    }
  }, [score, saveScore]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(20);
    setGameEnded(false);
    setMoleIndex(null);
    startTimeRef.current = Date.now();
    setIsActive(true);
  };

  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        const remaining = 20 - elapsed;
        
        if (remaining <= 0) {
          setTimeLeft(0);
          endGame();
        } else {
          setTimeLeft(remaining);
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isActive, endGame]);

  useEffect(() => {
    if (isActive) {
      const spawnMole = () => {
        const nextIndex = Math.floor(Math.random() * 25);
        setMoleIndex(nextIndex);
        
        // 밸런스 조정: 시작은 느리게(1000ms), 점수당 가속을 완화(-4ms), 최소 속도를 450ms로 상향
        const delay = Math.max(450, 1000 - (score * 4)); 
        moleTimerRef.current = setTimeout(spawnMole, delay);
      };
      
      spawnMole();
    }
    return () => {
      if (moleTimerRef.current) clearTimeout(moleTimerRef.current);
    };
  }, [isActive, score]);

  const handleMoleClick = (index: number) => {
    if (index === moleIndex && isActive) {
      setScore(prev => prev + 5);
      setMoleIndex(null);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-pink-50 font-sans">
      <p className="mb-6 text-gray-600 text-center font-medium">
        안녕하세요, <span className="text-pink-600 font-bold">{nameFromUrl}</span>님!<br/>
        <span className="text-sm">푸린을 잡아 100점을 넘겨보세요! 🍮</span>
      </p>

      <div className="flex justify-between w-full max-w-sm mb-4 text-xl font-black px-2">
        <div className="text-pink-600 bg-white px-4 py-1 rounded-full shadow-sm">SCORE: {score}</div>
        <div className={`px-4 py-1 rounded-full shadow-sm bg-white ${timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-gray-700'}`}>
          TIME: {timeLeft}s
        </div>
      </div>

      {!isActive && (
        <button
          onClick={startGame}
          className="mb-8 px-12 py-4 bg-pink-500 text-white rounded-2xl font-bold text-xl shadow-lg hover:bg-pink-600 active:scale-95 transition-all z-10"
        >
          {gameEnded ? '다시 도전하기' : '게임 시작!'}
        </button>
      )}

      {/* 게임 그리드 - 5x5 */}
      <div className="grid grid-cols-5 gap-2 mb-10 w-full max-w-sm aspect-square bg-pink-100 p-3 rounded-3xl shadow-inner border-4 border-pink-200">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            onClick={() => handleMoleClick(i)}
            className="relative bg-pink-200/50 rounded-xl overflow-hidden cursor-pointer flex items-center justify-center aspect-square transition-colors hover:bg-pink-200"
          >
            <div className="w-full h-full flex items-center justify-center p-1">
              {moleIndex === i && (
                <img 
                  src="/푸린.png" 
                  alt="푸린" 
                  className="w-full h-full object-contain animate-bounce select-none pointer-events-none"
                />
              )}
            </div>
            <div className="absolute bottom-0 w-full h-2 bg-pink-300/30"></div>
          </div>
        ))}
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
              <div key={item.id} className={`flex justify-between items-center p-3 rounded-xl ${item.name === nameFromUrl ? 'bg-pink-50 border-2 border-pink-200' : 'bg-gray-50'}`}>
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

      <Link href="/" className="mt-10 text-gray-400 hover:text-pink-500 hover:underline font-medium transition-colors">
        ← 이름 변경하기 (처음으로)
      </Link>

      <CouponModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      
      {isSaving && (
        <div className="fixed top-4 right-4 bg-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-fade-in">
          기록 저장 중...
        </div>
      )}
    </div>
  );
}

export default function MolePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <MoleGameContent />
    </Suspense>
  );
}
