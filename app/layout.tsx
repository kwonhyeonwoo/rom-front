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
    description: "흩어진 물리치료 세미나와 보수교육을 롬에서 한 번에 찾고, 새 세미나 알림도 받아보세요. 면허 인증 물리치료사 커뮤니티에서 수강 후기와 정보도 나눠요.",
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: "물리치료 세미나·보수교육을 한 곳에서 찾고, 물리치료사 커뮤니티에서 후기와 정보까지",
  },
  robots: { index: true, follow: true },
  // 구글 서치 콘솔·네이버 서치어드바이저 소유 확인용 HTML 태그. Vercel 환경 변수에 값만 넣으면 <meta>가 붙는다
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION
      ? { "naver-site-verification": process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION }
      : undefined,
  },
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
