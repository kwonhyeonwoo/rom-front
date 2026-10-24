import type { Metadata } from "next";
import localFont from "next/font/local";

import { QueryProvider } from "@/components/providers/query-provider";
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
      <body className="flex min-h-full flex-col">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
