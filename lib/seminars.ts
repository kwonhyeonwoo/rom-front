// 크롤링 API가 붙기 전까지 화면에 쓰는 세미나 데이터 (공개 페이지에서 직접 수집)

export type PosterTheme = "cream" | "navy" | "sky" | "red" | "black" | "forest";

export type Poster = {
  label: string;
  lines: [string, string];
  subtitle: string;
  date: string;
  theme: PosterTheme;
};

export type Seminar = {
  id: string;
  host: string;
  title: string;
  schedule: string;
  region: string;
  city: string;
  category: string;
  // 원문에 금액이 없으면 null (가격 문의)
  price: number | null;
  credit: number | null;
  // 모집 마감일까지 남은 일수. 마감일이 공지되지 않았으면 교육 시작일 기준
  dday: number;
  weekend: boolean;
  online: boolean;
  recruiting: boolean;
  poster: Poster;
  sourceUrl: string;
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

// 2026-10-23 공개 페이지에서 수집한 실제 세미나 (robots.txt 허용 페이지만, 페이지당 1회 요청).
// 원문에 없는 값은 지어내지 않고 null 또는 false로 둔다.
type CrawledSeminar = Omit<Seminar, "dday"> & { deadline: string };

const crawled: CrawledSeminar[] = [
  {
    id: "kspta-49th-2026",
    host: "서울특별시 물리치료사회",
    title: "제49차 서울특별시 물리치료사회 보수교육",
    schedule: "11.8(일)",
    region: "서울",
    city: "서울",
    category: "보수교육",
    price: null,
    credit: 8,
    deadline: "2026-11-08",
    weekend: true,
    online: false,
    recruiting: true,
    poster: { label: "KSPTA", lines: ["제49차", "보수교육"], subtitle: "서울특별시 물리치료사회", date: "11.8(일)", theme: "cream" },
    sourceUrl: "https://www.kspta.or.kr/bbs/board.php?bo_table=07_01&wr_id=5542",
  },
  {
    id: "knspt-pnf-17th-seoul",
    host: "대한중추신경계물리치료학회",
    title: "PNF 17차 집담회: Ready to walk, sitting to gait",
    schedule: "10.30(금)",
    region: "서울",
    city: "서울 강남",
    category: "신경계 재활",
    price: 10000,
    credit: null,
    deadline: "2026-10-30",
    weekend: false,
    online: false,
    recruiting: true,
    poster: { label: "KNSPT PNF", lines: ["READY", "TO WALK"], subtitle: "17차 집담회", date: "10.30(금)", theme: "black" },
    sourceUrl: "https://e-ptedu.com/offline-course-detail/81",
  },
  {
    id: "kacrpt-advanced6-respiratory",
    host: "대한심장호흡물리치료학회",
    title: "고급6 과정 (호흡)",
    schedule: "10.24(토)~25(일)",
    region: "인천",
    city: "인천 계양",
    category: "심장호흡",
    price: null,
    credit: null,
    deadline: "2026-10-24",
    weekend: true,
    online: false,
    recruiting: false,
    poster: { label: "KACRPT", lines: ["ADVANCED", "RESPIRA"], subtitle: "고급6 호흡", date: "10.24(토)~25(일)", theme: "sky" },
    sourceUrl: "https://kacrpt.org/program/schedule",
  },
  {
    id: "kacrpt-specialist-cardiac-2",
    host: "대한심장호흡물리치료학회",
    title: "전문심화과정 (심장) 2차",
    schedule: "10.26(월)~29(목)",
    region: "울산",
    city: "울산 동구",
    category: "심장호흡",
    price: null,
    credit: null,
    deadline: "2026-10-26",
    weekend: false,
    online: false,
    recruiting: false,
    poster: { label: "KACRPT", lines: ["CARDIAC", "EXPERT"], subtitle: "전문심화 2차", date: "10.26(월)~29(목)", theme: "red" },
    sourceUrl: "https://kacrpt.org/program/schedule",
  },
  {
    id: "kacrpt-advanced6-cardiac",
    host: "대한심장호흡물리치료학회",
    title: "고급6 과정 (심장)",
    schedule: "10.31(토)~11.1(일)",
    region: "인천",
    city: "인천 계양",
    category: "심장호흡",
    price: null,
    credit: null,
    deadline: "2026-10-31",
    weekend: true,
    online: false,
    recruiting: false,
    poster: { label: "KACRPT", lines: ["ADVANCED", "CARDIAC"], subtitle: "고급6 심장", date: "10.31(토)~11.1(일)", theme: "red" },
    sourceUrl: "https://kacrpt.org/program/schedule",
  },
  {
    id: "kacrpt-intermediate8-respiratory",
    host: "대한심장호흡물리치료학회",
    title: "중급8 과정 (호흡)",
    schedule: "10.31(토)~11.1(일)",
    region: "부산",
    city: "부산 사상",
    category: "심장호흡",
    price: null,
    credit: null,
    deadline: "2026-10-31",
    weekend: true,
    online: false,
    recruiting: false,
    poster: { label: "KACRPT", lines: ["INTERMED", "RESPIRA"], subtitle: "중급8 호흡", date: "10.31(토)~11.1(일)", theme: "sky" },
    sourceUrl: "https://kacrpt.org/program/schedule",
  },
  {
    id: "kacrpt-intermediate8-cardiac",
    host: "대한심장호흡물리치료학회",
    title: "중급8 과정 (심장)",
    schedule: "11.7(토)~8(일)",
    region: "부산",
    city: "부산 사상",
    category: "심장호흡",
    price: null,
    credit: null,
    deadline: "2026-11-07",
    weekend: true,
    online: false,
    recruiting: false,
    poster: { label: "KACRPT", lines: ["INTERMED", "CARDIAC"], subtitle: "중급8 심장", date: "11.7(토)~8(일)", theme: "navy" },
    sourceUrl: "https://kacrpt.org/program/schedule",
  },
  {
    id: "kacrpt-basic8-online",
    host: "대한심장호흡물리치료학회",
    title: "초급8 과정",
    schedule: "11.7(토)~8(일)",
    region: "온라인",
    city: "온라인",
    category: "심장호흡",
    price: null,
    credit: null,
    deadline: "2026-11-07",
    weekend: true,
    online: true,
    recruiting: false,
    poster: { label: "KACRPT ONLINE", lines: ["BASIC", "COURSE"], subtitle: "초급8", date: "11.7(토)~8(일)", theme: "forest" },
    sourceUrl: "https://kacrpt.org/program/schedule",
  },
  {
    id: "reborn-pilates-daejeon-tuthu",
    host: "리본 에듀케이션",
    title: "재활필라테스 지도자 과정 (대전 화목반)",
    schedule: "11.17(화) 개강",
    region: "대전",
    city: "대전",
    category: "필라테스",
    price: null,
    credit: null,
    // 온라인 이론 수업이 시작되는 날
    deadline: "2026-11-01",
    weekend: false,
    online: false,
    recruiting: true,
    poster: { label: "REBORN EDU", lines: ["REHAB", "PILATES"], subtitle: "대전 화목반", date: "11.17(화)", theme: "forest" },
    sourceUrl: "https://www.rebornpilates-edu.co.kr/schedule.html",
  },
  {
    id: "reborn-pilates-seoul-monwed",
    host: "리본 에듀케이션",
    title: "재활필라테스 지도자 과정 (서울 월수반)",
    schedule: "11.18(수) 개강",
    region: "서울",
    city: "서울 마포",
    category: "필라테스",
    price: null,
    credit: null,
    deadline: "2026-11-01",
    weekend: false,
    online: false,
    recruiting: true,
    poster: { label: "REBORN EDU", lines: ["REHAB", "PILATES"], subtitle: "서울 월수반", date: "11.18(수)", theme: "cream" },
    sourceUrl: "https://www.rebornpilates-edu.co.kr/schedule.html",
  },
  {
    id: "reborn-pilates-seoul-weekend",
    host: "리본 에듀케이션",
    title: "재활필라테스 지도자 과정 (서울 토일반)",
    schedule: "11.21(토) 개강",
    region: "서울",
    city: "서울 마포",
    category: "필라테스",
    price: null,
    credit: null,
    deadline: "2026-11-01",
    weekend: true,
    online: false,
    recruiting: true,
    poster: { label: "REBORN EDU", lines: ["REHAB", "PILATES"], subtitle: "서울 토일반", date: "11.21(토)", theme: "forest" },
    sourceUrl: "https://www.rebornpilates-edu.co.kr/schedule.html",
  },
  {
    id: "kspnf-gwangju-level12-2nd",
    host: "국제PNF한국학회 광주시회",
    title: "PNF Level 1 & 2 국제 코스 (10일 과정)",
    schedule: "12.5(토)~14(월)",
    region: "광주",
    city: "광주 동구",
    category: "신경계 재활",
    price: 1590000,
    credit: null,
    // 대상자 선정이 끝나 대기자 신청만 받는 마감일
    deadline: "2026-10-23",
    weekend: false,
    online: false,
    recruiting: false,
    poster: { label: "KSPNF GWANGJU", lines: ["PNF", "LEVEL 1&2"], subtitle: "국제 코스 10일", date: "12.5(토)~14(월)", theme: "black" },
    sourceUrl: "https://gwangjupnf.wordpress.com/",
  },
];

export const seminars: Seminar[] = crawled.map(({ deadline, ...seminar }) => ({
  ...seminar,
  dday: daysUntil(deadline),
}));

// 서버 시간대와 상관없이 한국 날짜 기준으로 계산
function daysUntil(date: string) {
  const today = new Date(Date.now() + 9 * 3_600_000);
  const start = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  const [y, m, d] = date.split("-").map(Number);
  return Math.round((Date.UTC(y, m - 1, d) - start) / 86_400_000);
}

const upcoming = seminars.filter((s) => s.dday >= 0);
export const deadlineSoon = upcoming.toSorted((a, b) => a.dday - b.dday).slice(0, 4);
// 배열 뒤쪽이 최근 수집분
export const newlyAdded = upcoming.slice(-4).reverse();

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

export function isDeadlineSoon(dday: number) {
  return dday <= 7;
}
