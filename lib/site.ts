// 메타데이터·OG 태그·sitemap에서 공통으로 쓰는 사이트 정보
// og:image·twitter:image·sitemap은 절대 URL이어야 카카오톡·슬랙 등이 미리보기 이미지를 가져갈 수 있다.
// NEXT_PUBLIC_SITE_URL(실제 도메인)이 우선이고, 없으면 Vercel이 넣어주는 배포 주소를 쓴다.
// 둘 다 없을 때만 localhost로 떨어지는데, 이 상태로 배포하면 og:image가 localhost를 가리켜 미리보기 이미지가 빠진다.
function resolveSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit;
  const vercelHost =
    process.env.VERCEL_ENV === "production"
      ? process.env.VERCEL_PROJECT_PRODUCTION_URL
      : (process.env.VERCEL_BRANCH_URL ?? process.env.VERCEL_URL);
  if (vercelHost) return `https://${vercelHost}`;
  return "http://localhost:3000";
}

export const siteUrl = resolveSiteUrl().replace(/\/$/, "");

// 구글 "사이트 이름"은 WebSite 구조화 데이터·og:site_name·<title>이 서로 같을 때 잘 잡힌다
export const siteName = "ROM(롬)";

// 사람들이 검색창에 치는 다른 이름들. 구조화 데이터 alternateName에 들어간다
export const siteAlternateNames = ["롬", "ROM", "롬 물리치료", "rom-pt"];

export const siteTitle = "ROM(롬) | 물리치료사 보수교육·세미나 검색과 커뮤니티";

export const siteDescription =
  "ROM(롬)은 물리치료사를 위한 보수교육·세미나 검색과 커뮤니티예요. 학회·협회·교육업체에 흩어진 물리치료 세미나와 보수교육을 매일 모아드려요. 분야·지역·주말·가격으로 찾고, 원하는 조건의 새 세미나가 올라오면 알림을 받아보세요. 면허 인증 물리치료사 커뮤니티와 수강 후기도 함께 있어요.";

export const siteKeywords = [
  "물리치료 세미나",
  "물리치료사 보수교육",
  "보수교육",
  "물리치료 보수교육",
  "도수치료 세미나",
  "테이핑 세미나",
  "운동치료 세미나",
  "필라테스 세미나",
  "신경계 재활",
  "물리치료사 커뮤니티",
  "세미나 후기",
  "롬",
  "ROM",
  "ROM(롬)",
  "롬 물리치료",
];
