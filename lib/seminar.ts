import { DEADLINE_SOON_DAYS, PRICE_RANGES } from "@/lib/constants/seminar";
import type { Category, Region, Seminar } from "@/types/seminar";

const DAY_MS = 24 * 60 * 60 * 1000;
const KST_OFFSET_MS = 9 * 60 * 60 * 1000;
const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

export type SeminarFilters = {
  q?: string;
  category?: Category;
  region?: Region;
  weekend?: boolean;
  credits?: boolean;
  price?: string;
};

export function parseFilters(
  params: Record<string, string | string[] | undefined>
): SeminarFilters {
  const get = (key: string) => {
    const value = params[key];
    return Array.isArray(value) ? value[0] : value;
  };

  return {
    q: get("q") || undefined,
    category: (get("category") as Category) || undefined,
    region: (get("region") as Region) || undefined,
    weekend: get("weekend") === "1",
    credits: get("credits") === "1",
    price: get("price") || undefined,
  };
}

export function filterSeminars(seminars: Seminar[], filters: SeminarFilters) {
  const range = PRICE_RANGES.find((r) => r.value === filters.price);
  const keyword = filters.q?.trim().toLowerCase();

  return seminars.filter((s) => {
    if (keyword) {
      const haystack = [s.title, s.provider, ...s.instructors]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(keyword)) return false;
    }
    if (filters.category && s.category !== filters.category) return false;
    if (filters.region && s.region !== filters.region) return false;
    if (filters.weekend && !s.isWeekend) return false;
    if (filters.credits && !s.kptaCredits) return false;
    if (range) {
      if (s.price === null) return false;
      if (s.price < range.min || s.price > range.max) return false;
    }
    return true;
  });
}

// 서버 시간대와 상관없이 한국 시간 기준으로 계산하기 위한 값
function toKst(date: Date) {
  return new Date(date.getTime() + KST_OFFSET_MS);
}

function kstDayNumber(date: Date) {
  return Math.floor(toKst(date).getTime() / DAY_MS);
}

// 신청 마감까지 남은 일수 (마감이 지났으면 음수)
export function daysUntil(date: string, now = new Date()) {
  return kstDayNumber(new Date(date)) - kstDayNumber(now);
}

export function isDeadlineSoon(seminar: Seminar, now = new Date()) {
  if (!seminar.applyDeadline) return false;
  const days = daysUntil(seminar.applyDeadline, now);
  return days >= 0 && days <= DEADLINE_SOON_DAYS;
}

export function formatSeminarDate(startAt: string, endAt: string) {
  const start = toKst(new Date(startAt));
  const end = toKst(new Date(endAt));
  const format = (d: Date) =>
    `${d.getUTCMonth() + 1}.${d.getUTCDate()}(${WEEKDAYS[d.getUTCDay()]})`;

  if (kstDayNumber(new Date(startAt)) === kstDayNumber(new Date(endAt))) {
    return format(start);
  }
  return `${format(start)} ~ ${format(end)}`;
}

export function formatPrice(price: number | null) {
  if (price === null) return "가격 문의";
  if (price === 0) return "무료";
  return `${price.toLocaleString("ko-KR")}원`;
}
