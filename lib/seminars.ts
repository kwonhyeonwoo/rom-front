// rom-back GET /seminars 응답과 화면용 세미나 모델

export type PosterTheme = "cream" | "navy" | "sky" | "red" | "black" | "forest";

export type Poster = {
  label: string;
  lines: [string, string];
  subtitle: string;
  date: string;
  theme: PosterTheme;
};

// rom-back이 주는 세미나 한 건. 날짜는 YYYY-MM-DD, 원문에 없는 값은 null
export type ApiSeminar = {
  id: string;
  source: string;
  sourceUrl: string;
  title: string;
  host: string | null;
  instructors: string[];
  categories: string[];
  startDate: string | null;
  endDate: string | null;
  isWeekend: boolean | null;
  region: string | null;
  venue: string | null;
  price: number | null;
  ceRecognized: boolean | null;
  ceCredits: number | null;
  applyStart: string | null;
  applyDeadline: string | null;
  applyUrl: string | null;
  firstSeenAt: string;
  deadlineDaysLeft: number | null;
  closingSoon: boolean;
};

export type SeminarPage = {
  items: ApiSeminar[];
  total: number;
  page: number;
  limit: number;
};

export type Seminar = {
  id: string;
  host: string;
  title: string;
  schedule: string;
  city: string;
  // 원문에 금액이 없으면 null (가격 문의)
  price: number | null;
  ceRecognized: boolean;
  credit: number | null;
  // 모집 마감까지 남은 일수. 마감일이 없으면 교육 시작일 기준, 둘 다 없으면 null
  dday: number | null;
  // 마감 임박 여부. 마감일이 있으면 서버가 계산해 준 값을 그대로 쓴다
  closingSoon: boolean;
  poster: Poster;
  url: string;
};

export const posterThemes: Record<
  PosterTheme,
  { bg: string; fg: string; accent: string }
> = {
  cream: { bg: "#EFE9DD", fg: "#1B1B1B", accent: "#C8553D" },
  navy: { bg: "#14213D", fg: "#FFFFFF", accent: "#FCA311" },
  sky: { bg: "#D9E6F5", fg: "#10264A", accent: "#2F6FEB" },
  red: { bg: "#B3261E", fg: "#FFFFFF", accent: "#FFD9D6" },
  black: { bg: "#121212", fg: "#FFFFFF", accent: "#7CE0B2" },
  forest: { bg: "#1F4D3F", fg: "#F4F1E8", accent: "#E3B04B" },
};

const categoryPosters: Record<string, { lines: [string, string]; theme: PosterTheme }> = {
  도수치료: { lines: ["MANUAL", "THERAPY"], theme: "cream" },
  테이핑: { lines: ["TAPING", "CLASS"], theme: "sky" },
  운동치료: { lines: ["EXERCISE", "THERAPY"], theme: "navy" },
  필라테스: { lines: ["REHAB", "PILATES"], theme: "forest" },
  신경계재활: { lines: ["NEURO", "REHAB"], theme: "black" },
  심폐재활: { lines: ["CARDIO", "PULMO"], theme: "red" },
  보수교육: { lines: ["CE", "COURSE"], theme: "cream" },
  기타: { lines: ["SEMINAR", "COURSE"], theme: "navy" },
};

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

// "2026-10-24" ~ "2026-10-25" → "10.24(토)~25(일)"
export function formatSchedule(start: string | null, end: string | null) {
  if (!start) return "일정 미정";
  const [, sm, sd] = start.split("-").map(Number);
  const day = (date: string) => WEEKDAYS[new Date(`${date}T00:00:00Z`).getUTCDay()];
  const head = `${sm}.${sd}(${day(start)})`;
  if (!end || end === start) return head;
  const [, em, ed] = end.split("-").map(Number);
  return `${head}~${em === sm ? ed : `${em}.${ed}`}(${day(end)})`;
}

// 서버 시간대와 상관없이 한국 날짜 기준으로 계산
function daysUntil(date: string) {
  const today = new Date(Date.now() + 9 * 3_600_000);
  const start = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  const [y, m, d] = date.split("-").map(Number);
  return Math.round((Date.UTC(y, m - 1, d) - start) / 86_400_000);
}

const truncate = (text: string, max: number) => (text.length > max ? `${text.slice(0, max)}…` : text);

export function toSeminar(api: ApiSeminar): Seminar {
  const category = api.categories[0] ?? "기타";
  const poster = categoryPosters[category] ?? categoryPosters.기타;
  const schedule = formatSchedule(api.startDate, api.endDate);
  const startsIn = api.startDate ? daysUntil(api.startDate) : null;
  return {
    id: api.id,
    host: api.host ?? api.source,
    title: api.title,
    schedule,
    city: api.region ?? "지역 미정",
    price: api.price,
    ceRecognized: !!api.ceRecognized,
    credit: api.ceCredits,
    dday: api.deadlineDaysLeft ?? startsIn,
    // 마감일이 공지되지 않은 글은 교육 시작일이 7일 안에 있으면 임박으로 본다
    closingSoon: api.deadlineDaysLeft === null && startsIn !== null ? startsIn >= 0 && startsIn <= 7 : api.closingSoon,
    poster: {
      label: truncate(api.host ?? api.source, 16),
      lines: poster.lines,
      subtitle: truncate(api.title, 12),
      date: schedule,
      theme: poster.theme,
    },
    url: api.applyUrl ?? api.sourceUrl,
  };
}

export type Banner = {
  id: string;
  eyebrow: string;
  title: [string, string];
  meta: string;
  advertiser: string;
  background: string;
  poster: Poster;
};

export const banners: Banner[] = [
  {
    id: "seoul-mt-master",
    eyebrow: "EARLY BIRD · ~11.20",
    title: ["경추·요추 도수치료", "마스터 클래스"],
    meta: "12월 주말 4회 · 서울 강남 · 보수교육 8점",
    advertiser: "서울정형도수센터",
    background: "#0E3B34",
    poster: { label: "SEOUL MT CENTER", lines: ["MASTER", "CLASS"], subtitle: "경추·요추 도수치료", date: "12.6(일)", theme: "cream" },
  },
  {
    id: "neuro-rehab-camp",
    eyebrow: "WINTER CAMP · ~12.01",
    title: ["뇌졸중 환자", "보행 재활 집중 과정"],
    meta: "1월 주말 2회 · 경기 성남 · 보수교육 8점",
    advertiser: "신경재활아카데미",
    background: "#1B2F5B",
    poster: { label: "NEURO ACADEMY", lines: ["GAIT", "REHAB"], subtitle: "보행 재활 집중", date: "1.10(토)", theme: "sky" },
  },
  {
    id: "pilates-instructor",
    eyebrow: "NEW CLASS · ~11.30",
    title: ["임상 필라테스", "지도자 자격 과정"],
    meta: "12월 주말 6회 · 부산 해운대",
    advertiser: "임상재활필라테스연구회",
    background: "#3A2A1E",
    poster: { label: "CLINICAL PILATES", lines: ["PILATES", "MASTER"], subtitle: "지도자 자격 과정", date: "12.12(토)", theme: "forest" },
  },
];

export function formatPrice(price: number | null) {
  if (price === null) return "가격 문의";
  return price === 0 ? "무료" : `${price.toLocaleString("ko-KR")}원`;
}
