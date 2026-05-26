'use client';

export default function CouponModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl transform transition-all">
        <h2 className="text-3xl font-bold text-pink-500 mb-4 animate-bounce">🎉 성공! 🎉</h2>
        <p className="text-gray-700 mb-6 font-medium">오늘도 화이팅! ☕️</p>
        
        {/* 쿠폰 이미지 */}
        <div className="w-full mb-8 rounded-2xl border-2 border-pink-100 shadow-sm bg-pink-50/30 overflow-hidden flex items-center justify-center min-h-[150px]">
          <img 
            src="/쿠폰.PNG" 
            alt="커피 쿠폰" 
            className="w-full h-full object-contain max-h-[400px]"
          />
        </div>

        <button 
          onClick={onClose}
          className="bg-gray-100 text-gray-600 px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition-colors active:scale-95"
        >
          닫기
        </button>
      </div>
    </div>
  );
}