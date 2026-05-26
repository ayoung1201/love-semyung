import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. 보안을 위한 임시 비밀번호 설정 (원하는 대로 바꿔!)
  const SECRET_PASSWORD = 'love-semyeong-2026';

  // 2. 주소창 URL에 ?key=비밀번호 가 있는지 검사
  const urlParams = new URL(request.url).searchParams;
  const providedKey = urlParams.get('key');

  // 3. 만약 키가 없거나, 틀리면 접속 거부! (안내 페이지로 보내거나 에러 메시지 띄움)
  if (providedKey !== SECRET_PASSWORD) {
    return new NextResponse('공사 중입니다. 접근 권한이 없습니다.', { status: 401 });
  }

  // 4. 비밀번호가 맞으면 무사 통과!
  return NextResponse.next();
}

// 5. 이 검사소를 어디에 설치할지 설정 (기본적으로 모든 페이지)
export const config = {
  matcher: '/:path*', // / 하위의 모든 경로에 적용
};