import type { Poster } from "@/lib/seminars";

// 메인 상단 광고 슬롯. 한 번에 보이는 광고는 최대 5곳까지 (테스트 기간 무료, 선착순 5곳)
export const MAX_AD_SLOTS = 5;

// 광고·제휴 문의 경로 (/contact는 고객센터 1:1 문의의 '광고·제휴' 유형으로 보낸다)
export const AD_CONTACT_HREF = "/contact";

export type Banner = {
  id: string;
  eyebrow: string;
  title: [string, string];
  meta: string;
  advertiser: string;
  background: string;
  poster: Poster;
  // 배너를 눌렀을 때 가는 곳 (보통 교육업체의 수강 신청 페이지)
  href: string;
  // 이 날짜(한국 날짜, YYYY-MM-DD)까지 보인다. 기본은 세미나 신청 마감일
  endsOn: string;
};

// 실제 계약된 광고만 넣는다. 비어 있거나 5곳이 다 차지 않으면 남은 자리에 "광고 모집 중" 안내가 보인다
//
// 예시:
// {
//   id: "seoul-mt-master",
//   eyebrow: "EARLY BIRD · ~11.20",
//   title: ["경추·요추 도수치료", "마스터 클래스"],
//   meta: "12월 주말 4회 · 서울 강남 · 보수교육 8점",
//   advertiser: "서울정형도수센터",
//   background: "#0E3B34",
//   poster: { label: "SEOUL MT CENTER", lines: ["MASTER", "CLASS"], subtitle: "경추·요추 도수치료", date: "12.6(일)", theme: "cream" },
//   href: "https://example.com/apply",
//   endsOn: "2026-11-20",
// },
export const ads: Banner[] = [];

function todayKst() {
  return new Date(Date.now() + 9 * 3_600_000).toISOString().slice(0, 10);
}

// 신청 마감일(endsOn)이 지나지 않은 광고만, 최대 5곳
export function activeAds(list: Banner[] = ads, today = todayKst()) {
  return list.filter((ad) => ad.endsOn >= today).slice(0, MAX_AD_SLOTS);
}
