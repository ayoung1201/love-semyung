import type { Metadata } from "next";
import { Jua } from "next/font/google";
import "./globals.css";

const jua = Jua({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "푸린 잡기",
  description: "남자친구를 위한 특별한 미니게임 이벤트",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${jua.className} min-h-screen flex flex-col antialiased`}>
        {children}
      </body>
    </html>
  );
}
