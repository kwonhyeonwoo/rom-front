import type { Metadata } from "next";
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
import "./globals.css";

import { Header } from "@/components/layout/header";

export const metadata: Metadata = {
  title: "롬 | 물리치료 세미나·보수교육 한곳에서",
  description:
    "학회·협회·교육업체에 흩어진 물리치료 세미나와 보수교육을 분야, 지역, 주말 여부로 찾아보세요.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-muted/30">
        <Header />
        <main className="flex flex-1 flex-col">{children}</main>
      </body>
    </html>
  );
}
