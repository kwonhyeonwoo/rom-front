import type { Category, Region } from "@/types/seminar";

export const CATEGORY_LABELS: Record<Category, string> = {
  MANUAL_THERAPY: "도수치료",
  TAPING: "테이핑",
  EXERCISE: "운동치료",
  PILATES: "필라테스",
  NEURO: "신경계",
  SPORTS: "스포츠",
  PEDIATRIC: "소아",
  ETC: "기타",
};

export const REGION_LABELS: Record<Region, string> = {
  SEOUL: "서울",
  BUSAN: "부산",
  DAEGU: "대구",
  INCHEON: "인천",
  GWANGJU: "광주",
  DAEJEON: "대전",
  ULSAN: "울산",
  SEJONG: "세종",
  GYEONGGI: "경기",
  GANGWON: "강원",
  CHUNGBUK: "충북",
  CHUNGNAM: "충남",
  JEONBUK: "전북",
  JEONNAM: "전남",
  GYEONGBUK: "경북",
  GYEONGNAM: "경남",
  JEJU: "제주",
};

export const PRICE_RANGES = [
  { value: "free", label: "무료", min: 0, max: 0 },
  { value: "under10", label: "10만원 이하", min: 0, max: 100000 },
  { value: "under30", label: "10~30만원", min: 100001, max: 300000 },
  { value: "over30", label: "30만원 이상", min: 300001, max: Infinity },
] as const;

export type PriceRange = (typeof PRICE_RANGES)[number]["value"];

// 마감 임박 기준 (일)
export const DEADLINE_SOON_DAYS = 7;
