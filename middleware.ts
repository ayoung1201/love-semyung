import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const SECRET_PASSWORD = 'love-semyung-2026';

  // 1. 주소창의 쿼리 파라미터(일회용 열쇠) 확인
  const urlParams = new URL(request.url).searchParams;
  const providedKey = urlParams.get('key');

  // 2. 브라우저에 저장된 쿠키(자유이용권 띠지) 확인
  const hasCookie = request.cookies.has('unlocked');

  // 3. 올바른 열쇠를 들고 왔다면? -> 출입증(쿠키)을 쾅 찍어주고 통과!
  if (providedKey === SECRET_PASSWORD) {
    const response = NextResponse.next();
    // 'unlocked'라는 이름의 출입증을 브라우저 닫을 때까지 유지
    response.cookies.set('unlocked', 'true', { path: '/' });
    return response;
  }

  // 4. 열쇠도 없고, 출입증(쿠키)도 없다면? -> 가차 없이 접속 거부!
  if (!hasCookie) {
    return new NextResponse('공사 중입니다. 접근 권한이 없습니다.', { status: 401 });
  }

  // 5. 출입증(쿠키)이 있으면 무사 통과!
  return NextResponse.next();
}

// 6. 이미지나 폰트, 기본 파일들은 검사소에서 제외 (쿠폰 이미지 엑스박스 방지!)
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|PNG|jpg|jpeg|gif|webp)$).*)'],
};