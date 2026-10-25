export const PAGE_SIZE = 12;

// rom-back이 받는 표준 지역·분야 이름 (src/crawler/normalize/vocab.ts). 목록에 없는 값을 보내면 400이 난다.
export const regionOptions = [
  "서울",
  "경기",
  "인천",
  "대전",
  "대구",
  "부산",
  "광주",
  "울산",
  "세종",
  "강원",
  "충북",
  "충남",
  "전북",
  "전남",
  "경북",
  "경남",
  "제주",
].map((value) => ({ value, label: value }));
export const categoryOptions = [
  { value: "도수치료", label: "도수치료" },
  { value: "테이핑", label: "테이핑" },
  { value: "운동치료", label: "운동치료" },
  { value: "필라테스", label: "필라테스" },
  { value: "신경계재활", label: "신경계 재활" },
  { value: "심폐재활", label: "심장호흡" },
  { value: "보수교육", label: "보수교육" },
  { value: "기타", label: "기타" },
];
// 교육 시작일 기준
export const periodOptions = [
  { value: "2w", label: "2주 이내", days: 14 },
  { value: "1m", label: "한 달 이내", days: 31 },
] as const;
export const priceOptions = [
  { value: "free", label: "무료", min: undefined, max: 0 },
  { value: "under100k", label: "10만원 이하", min: undefined, max: 100000 },
  { value: "100k-300k", label: "10~30만원", min: 100000, max: 300000 },
  { value: "over300k", label: "30만원 이상", min: 300000, max: undefined },
] as const;
export const sortOptions = [
  { value: "deadline", label: "마감 임박순" },
  { value: "latest", label: "최신순" },
  { value: "date", label: "교육일 빠른순" },
] as const;

export type SearchFilters = {
  q: string;
  region: string | null;
  category: string | null;
  period: string | null;
  price: string | null;
  weekend: boolean;
  credit: boolean;
  // 보수교육 인정이 아닌 사설 세미나만
  privateOnly: boolean;
  // 신청이 끝난 세미나 빼기
  openOnly: boolean;
  closingSoon: boolean;
  sort: (typeof sortOptions)[number]["value"];
  page: number;
};

type RawParams = Record<string, string | string[] | undefined>;

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);
const pick = (options: readonly { value: string }[], value: string | undefined) =>
  options.find((option) => option.value === value)?.value ?? null;

export function parseFilters(params: RawParams): SearchFilters {
  const page = Number(first(params.page));
  return {
    q: first(params.q)?.trim().slice(0, 50) ?? "",
    region: pick(regionOptions, first(params.region)),
    category: pick(categoryOptions, first(params.category)),
    period: pick(periodOptions, first(params.period)),
    price: pick(priceOptions, first(params.price)),
    weekend: first(params.weekend) === "1",
    credit: first(params.credit) === "1",
    privateOnly: first(params.private) === "1",
    openOnly: first(params.open) === "1",
    closingSoon: first(params.closingSoon) === "1",
    sort: (pick(sortOptions, first(params.sort)) ?? "deadline") as SearchFilters["sort"],
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
  if (filters.privateOnly) params.set("private", "1");
  if (filters.openOnly) params.set("open", "1");
  if (filters.closingSoon) params.set("closingSoon", "1");
  if (filters.sort !== "deadline") params.set("sort", filters.sort);
  if (filters.page > 1) params.set("page", String(filters.page));
  const query = params.toString();
  return query ? `?${query}` : "";
}

// 화면 필터를 rom-back GET /seminars 쿼리로 바꾼다
export function toApiQuery(filters: SearchFilters, limit = PAGE_SIZE) {
  const params = new URLSearchParams({ sort: filters.sort, page: String(filters.page), limit: String(limit) });
  if (filters.q) params.set("q", filters.q);
  if (filters.region) params.set("region", filters.region);
  if (filters.category) params.set("category", filters.category);
  if (filters.weekend) params.set("weekend", "true");
  if (filters.credit) params.set("ceOnly", "true");
  if (filters.privateOnly) params.set("excludeCe", "true");
  if (filters.openOnly) params.set("excludeClosed", "true");
  if (filters.closingSoon) params.set("closingSoon", "true");

  const price = priceOptions.find((option) => option.value === filters.price);
  if (price?.min !== undefined) params.set("minPrice", String(price.min));
  if (price?.max !== undefined) params.set("maxPrice", String(price.max));

  const period = periodOptions.find((option) => option.value === filters.period);
  if (period) {
    params.set("from", kstDate(0));
    params.set("to", kstDate(period.days));
  }
  return params.toString();
}

// 오늘(한국 날짜)부터 days일 뒤를 YYYY-MM-DD로
function kstDate(days: number) {
  return new Date(Date.now() + 9 * 3_600_000 + days * 86_400_000).toISOString().slice(0, 10);
}

export const defaultFilters: SearchFilters = parseFilters({});
