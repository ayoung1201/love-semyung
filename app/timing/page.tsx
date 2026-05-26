'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import CouponModal from '@/components/CouponModal';

export default function TimingPage() {
  const [position, setPosition] = useState(0); // 0부터 100까지 위치
  const [direction, setDirection] = useState(1); // 1: 오른쪽, -1: 왼쪽
  const [isPlaying, setIsPlaying] = useState(false);
  const [message, setMessage] = useState('START 버튼을 눌러 시작하세요!');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // setInterval 안에서 최신 값을 사용하기 위한 마법(useRef)
  const positionRef = useRef(position);
  const directionRef = useRef(direction);

  useEffect(() => {
    positionRef.current = position;
    directionRef.current = direction;
  }, [position, direction]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isPlaying) {
      // 20ms 마다 막대기를 조금씩 움직입니다.
      interval = setInterval(() => {
        // speed 값을 조절해서 난이도를 바꿀 수 있어요! (현재 2)
        let nextPos = positionRef.current + (directionRef.current * 2); 
        let nextDir = directionRef.current;

        // 양 끝에 닿으면 방향 바꾸기
        if (nextPos >= 100) {
          nextPos = 100;
          nextDir = -1;
        } else if (nextPos <= 0) {
          nextPos = 0;
          nextDir = 1;
        }

        setPosition(nextPos);
        setDirection(nextDir);
      }, 20); 
    }

    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleStartStop = () => {
    if (isPlaying) {
      // 멈췄을 때!
      setIsPlaying(false);
      
      // 초록색 영역(45% ~ 55%)에 있는지 확인
      if (position >= 45 && position <= 55) {
        setMessage('대박! 완벽한 타이밍이에요! 🥳');
        setIsModalOpen(true); // 쿠폰 모달 띄우기
      } else {
        setMessage('아쉽네요! 다시 도전해보세요! 🥲');
      }
    } else {
      // 시작할 때!
      setPosition(0);
      setDirection(1);
      setMessage('초록색 칸에 막대가 왔을 때 멈추세요!');
      setIsPlaying(true);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-blue-50">
      <h1 className="text-3xl font-bold mb-2 text-blue-600">타이밍 게임</h1>
      <p className="mb-12 text-gray-600 text-center">초록색 칸에 막대가 왔을 때 멈춰주세요!</p>

      {/* 게임 화면 영역 */}
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-lg mb-8">
        
        {/* 막대기 전체 배경 */}
        <div className="relative w-full h-12 bg-gray-100 rounded-full overflow-hidden border-2 border-gray-200 shadow-inner">
          {/* 성공 영역 (가운데 45% ~ 55%) */}
          <div className="absolute top-0 bottom-0 left-[45%] w-[10%] bg-green-400 opacity-60"></div>
          
          {/* 움직이는 빨간 점 */}
          <div 
            className="absolute top-1 bottom-1 w-4 bg-red-500 rounded-full shadow-md transition-none"
            style={{ left: `calc(${position}% - 8px)` }}
          ></div>
        </div>

        {/* 안내 메시지 */}
        <div className="text-center mt-8 min-h-[2rem] font-semibold text-lg text-gray-700">
          {message}
        </div>

        {/* 버튼 */}
        <div className="mt-8 flex justify-center">
          <button 
            onClick={handleStartStop}
            className={`px-12 py-4 rounded-full font-bold text-xl text-white shadow-lg transition-transform active:scale-95 ${
              isPlaying ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {isPlaying ? 'STOP !' : 'START'}
          </button>
        </div>
      </div>

      <Link href="/" className="text-gray-500 hover:text-blue-500 hover:underline font-medium">
        ← 메인으로 돌아가기
      </Link>

      {/* 성공 시 나오는 쿠폰 모달 */}
      <CouponModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}