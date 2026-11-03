import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/site";

// 검색 노출이 필요한 공개 페이지만 담는다 (세미나·게시글 상세는 API 연동 후 추가)
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${siteUrl}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${siteUrl}/search`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/community`, lastModified: now, changeFrequency: "daily", priority: 0.7 },
    { url: `${siteUrl}/reviews`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${siteUrl}/help`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${siteUrl}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.1 },
    { url: `${siteUrl}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.1 },
  ];
}
