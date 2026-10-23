import { seminars, type Seminar } from "./seminars";

export const PAGE_SIZE = 6;

export const regionOptions = ["서울", "경기", "인천", "대전", "대구", "부산", "광주", "온라인"];
export const categoryOptions = ["도수치료", "테이핑", "운동치료", "필라테스", "신경계 재활", "보수교육"];
export const periodOptions = [
  { value: "2w", label: "2주 이내", maxDday: 14 },
  { value: "1m", label: "한 달 이내", maxDday: 31 },
] as const;
export const priceOptions = [
  { value: "free", label: "무료", min: 0, max: 0 },
  { value: "under100k", label: "10만원 이하", min: 0, max: 100000 },
  { value: "100k-300k", label: "10~30만원", min: 100000, max: 300000 },
  { value: "over300k", label: "30만원 이상", min: 300000, max: Infinity },
] as const;
export const sortOptions = [
  { value: "deadline", label: "마감 임박순" },
  { value: "latest", label: "최신순" },
  { value: "price", label: "낮은 가격순" },
] as const;

export type SearchFilters = {
  q: string;
  region: string | null;
  category: string | null;
  period: string | null;
  price: string | null;
  weekend: boolean;
  credit: boolean;
  recruiting: boolean;
  sort: (typeof sortOptions)[number]["value"];
  page: number;
};

type RawParams = Record<string, string | string[] | undefined>;

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

export function parseFilters(params: RawParams): SearchFilters {
  const sort = sortOptions.find((option) => option.value === first(params.sort))?.value ?? "deadline";
  const page = Number(first(params.page));
  return {
    q: first(params.q)?.trim() ?? "",
    region: first(params.region) || null,
    category: first(params.category) || null,
    period: first(params.period) || null,
    price: first(params.price) || null,
    weekend: first(params.weekend) === "1",
    credit: first(params.credit) === "1",
    recruiting: first(params.recruiting) === "1",
    sort,
    page: Number.isInteger(page) && page > 0 ? page : 1,
  };
}

// 필터를 URL 쿼리스트링으로. 기본값은 생략해 주소를 짧게 유지한다.
export function toQueryString(filters: SearchFilters) {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.region) params.set("region", filters.region);
  if (filters.category) params.set("category", filters.category);
  if (filters.period) params.set("period", filters.period);
  if (filters.price) params.set("price", filters.price);
  if (filters.weekend) params.set("weekend", "1");
  if (filters.credit) params.set("credit", "1");
  if (filters.recruiting) params.set("recruiting", "1");
  if (filters.sort !== "deadline") params.set("sort", filters.sort);
  if (filters.page > 1) params.set("page", String(filters.page));
  const query = params.toString();
  return query ? `?${query}` : "";
}

export function searchSeminars(filters: SearchFilters) {
  const tokens = filters.q.split(/\s+/).filter(Boolean);
  const period = periodOptions.find((option) => option.value === filters.period);
  const price = priceOptions.find((option) => option.value === filters.price);

  const matches = seminars.filter((seminar) => {
    const haystack = [seminar.title, seminar.host, seminar.category, seminar.poster.subtitle].join(" ");
    if (!tokens.every((token) => haystack.includes(token))) return false;
    if (filters.region && seminar.region !== filters.region) return false;
    if (filters.category && seminar.category !== filters.category) return false;
    if (period && seminar.dday > period.maxDday) return false;
    if (price && !inPriceRange(seminar, price.min, price.max)) return false;
    if (filters.weekend && !seminar.weekend) return false;
    if (filters.credit && !seminar.credit) return false;
    if (filters.recruiting && !seminar.recruiting) return false;
    return true;
  });

  const sorted = matches.toSorted(compareBy(filters.sort));
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const page = Math.min(filters.page, totalPages);

  return {
    total: sorted.length,
    page,
    totalPages,
    items: sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
  };
}

function inPriceRange(seminar: Seminar, min: number, max: number) {
  return max === 0 ? seminar.price === 0 : seminar.price >= min && seminar.price <= max;
}

function compareBy(sort: SearchFilters["sort"]) {
  switch (sort) {
    case "price":
      return (a: Seminar, b: Seminar) => a.price - b.price;
    case "latest":
      // 목업 데이터는 최근 등록 순서대로 배열 뒤에 추가된다고 가정
      return (a: Seminar, b: Seminar) => seminars.indexOf(b) - seminars.indexOf(a);
    default:
      return (a: Seminar, b: Seminar) => a.dday - b.dday;
  }
}
