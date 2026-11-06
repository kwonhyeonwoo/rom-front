import type { MetadataRoute } from "next";

import { getSeminarsForSitemap } from "@/lib/seminars-server";
import { siteUrl } from "@/lib/site";

// 검색 노출이 필요한 공개 페이지와, 아직 끝나지 않은 세미나 상세 페이지를 담는다.
// 커뮤니티 글은 면허 인증 회원만 볼 수 있어 넣지 않는다
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, changeFrequency: "daily", priority: 1 },
    { url: `${siteUrl}/search`, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/community`, changeFrequency: "daily", priority: 0.6 },
    { url: `${siteUrl}/reviews`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${siteUrl}/help`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${siteUrl}/terms`, changeFrequency: "yearly", priority: 0.1 },
    { url: `${siteUrl}/privacy`, changeFrequency: "yearly", priority: 0.1 },
  ];

  // 백엔드가 잠들었거나 실패해도 기본 페이지는 내보낸다
  const seminars = await getSeminarsForSitemap().catch((error) => {
    console.error("sitemap: 세미나 목록을 못 가져옴", error);
    return [];
  });

  return [
    ...pages,
    ...seminars.map((s) => ({
      url: `${siteUrl}/seminars/${s.id}`,
      lastModified: s.firstSeenAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
