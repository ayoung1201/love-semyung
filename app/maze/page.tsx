import Link from 'next/link';

export default function MazePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">미니 미로 탈출</h1>
      <p className="mb-8 text-gray-600">준비 중입니다...</p>
      <Link href="/" className="text-blue-500 hover:underline">홈으로 돌아가기</Link>
    </div>
  );
}
