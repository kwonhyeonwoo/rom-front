import type { Metadata } from "next";
import localFont from "next/font/local";

import { MobileTabBar } from "@/components/layout/mobile-tab-bar";
import { SiteFooter } from "@/components/layout/site-footer";
import "./globals.css";

const pretendard = localFont({
  src: "../node_modules/pretendard/dist/web/variable/woff2/PretendardVariable.woff2",
  variable: "--font-pretendard",
  weight: "45 920",
  display: "swap",
});

export const metadata: Metadata = {
  title: "롬 · 물리치료 세미나 통합 검색",
  description: "학회·협회·교육업체에 흩어진 물리치료 세미나와 보수교육을 매일 모아드려요",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${pretendard.variable} h-full antialiased`}>
      {/* 모바일 하단 탭바 높이만큼 아래 여백 */}
      <body className="flex min-h-full flex-col pb-[76px] md:pb-0">
        <div className="flex-1">{children}</div>
        <SiteFooter />
        <MobileTabBar />
      </body>
    </html>
  );
}
