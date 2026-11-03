// 메타데이터·OG 태그·sitemap에서 공통으로 쓰는 사이트 정보
// 배포 시 NEXT_PUBLIC_SITE_URL에 실제 도메인을 넣어야 og:image 같은 절대 URL이 올바르게 나간다
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export const siteName = "롬";

export const siteTitle = "롬 · 물리치료 세미나·보수교육 통합 검색";

export const siteDescription =
  "학회·협회·교육업체에 흩어진 물리치료 세미나와 보수교육을 매일 모아드려요. 분야·지역·주말·가격으로 찾고, 원하는 조건의 새 세미나가 올라오면 알림을 받아보세요. 면허 인증 물리치료사 커뮤니티와 수강 후기도 함께 있어요.";

export const siteKeywords = [
  "물리치료 세미나",
  "물리치료사 보수교육",
  "보수교육",
  "도수치료 세미나",
  "테이핑 세미나",
  "운동치료 세미나",
  "필라테스 세미나",
  "신경계 재활",
  "물리치료사 커뮤니티",
  "세미나 후기",
];
