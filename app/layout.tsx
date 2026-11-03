import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";

import { QueryProvider } from "@/components/providers/query-provider";
import { Toaster } from "@/components/ui/toaster";
import { siteDescription, siteKeywords, siteName, siteTitle, siteUrl } from "@/lib/site";
import "./globals.css";

const pretendard = localFont({
  src: "../node_modules/pretendard/dist/web/variable/woff2/PretendardVariable.woff2",
  variable: "--font-pretendard",
  weight: "45 920",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: siteTitle, template: `%s · ${siteName}` },
  description: siteDescription,
  keywords: siteKeywords,
  applicationName: siteName,
  category: "education",
  formatDetection: { telephone: false },
  // og:image·twitter:image·아이콘은 app/의 opengraph-image.png, twitter-image.png, icon.png, apple-icon.png가 자동으로 넣는다
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName,
    title: siteTitle,
    description: "학회·협회·교육업체에 흩어진 물리치료 세미나와 보수교육, 롬에서 한 번에 찾고 새 세미나 알림까지 받아보세요.",
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: "흩어진 물리치료 세미나·보수교육을 한 곳에서 찾고 알림 받기",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${pretendard.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <QueryProvider>
          {children}
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}
