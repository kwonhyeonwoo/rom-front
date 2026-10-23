// 크롤링 API가 붙기 전까지 화면에 쓰는 세미나 목업 데이터

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
  price: number;
  credit: number | null;
  dday: number;
  weekend: boolean;
  online: boolean;
  recruiting: boolean;
  poster: Poster;
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

export const seminars: Seminar[] = [
  {
    id: "kinesio-taping",
    host: "근골격발란스테이핑학회",
    title: "키네지오 테이핑 기초와 임상 적용",
    schedule: "11.15(일)",
    region: "서울",
    city: "서울 서초",
    category: "테이핑",
    price: 90000,
    credit: 4,
    dday: 2,
    weekend: true,
    online: false,
    recruiting: true,
    poster: { label: "BALANCE TAPING", lines: ["KINESIO", "TAPING"], subtitle: "테이핑 기초와 임상", date: "11.15(일)", theme: "cream" },
  },
  {
    id: "lumbar-manual-daegu",
    host: "대한정형도수물리치료학회",
    title: "요추 도수치료 실전: 평가부터 모빌리제이션까지",
    schedule: "11.8(일)",
    region: "대구",
    city: "대구 중구",
    category: "도수치료",
    price: 150000,
    credit: 8,
    dday: 4,
    weekend: true,
    online: false,
    recruiting: true,
    poster: { label: "KAMOMPT", lines: ["LUMBAR", "MANUAL"], subtitle: "요추 도수치료 실전", date: "11.8(일)", theme: "navy" },
  },
  {
    id: "pediatric-vojta",
    host: "대한소아청소년물리치료학회",
    title: "소아 발달 평가와 보이타 치료 입문",
    schedule: "11.11(수)",
    region: "광주",
    city: "광주 동구",
    category: "신경계 재활",
    price: 50000,
    credit: 3,
    dday: 6,
    weekend: false,
    online: false,
    recruiting: true,
    poster: { label: "KSPPT", lines: ["PEDIATRIC", "VOJTA"], subtitle: "보이타 치료 입문", date: "11.11(수)", theme: "sky" },
  },
  {
    id: "shoulder-rehab",
    host: "대한운동재활물리치료학회",
    title: "어깨 충돌증후군 운동치료 프로토콜",
    schedule: "11.4(수)",
    region: "온라인",
    city: "온라인",
    category: "운동치료",
    price: 30000,
    credit: 2,
    dday: 11,
    weekend: false,
    online: true,
    recruiting: true,
    poster: { label: "ONLINE LIVE", lines: ["SHOULDER", "REHAB"], subtitle: "운동치료 프로토콜", date: "11.4(수)", theme: "red" },
  },
  {
    id: "pnf-level-1",
    host: "대한중추신경계물리치료학회",
    title: "PNF Level 1 코스 (4일 과정)",
    schedule: "11.21(토)~29(일)",
    region: "서울",
    city: "서울 강남",
    category: "신경계 재활",
    price: 680000,
    credit: 8,
    dday: 18,
    weekend: true,
    online: false,
    recruiting: true,
    poster: { label: "KNSPT", lines: ["PNF", "LEVEL 1"], subtitle: "4일 집중 과정", date: "11.21(토)~29(일)", theme: "black" },
  },
  {
    id: "return-to-play",
    host: "대한스포츠물리치료학회",
    title: "스포츠 손상 현장 대응과 리턴 투 플레이",
    schedule: "12.5(토)~6(일)",
    region: "대전",
    city: "대전 유성",
    category: "운동치료",
    price: 280000,
    credit: 8,
    dday: 36,
    weekend: true,
    online: false,
    recruiting: true,
    poster: { label: "KSSPT", lines: ["RETURN", "TO PLAY"], subtitle: "스포츠 손상 대응", date: "12.5(토)~6(일)", theme: "navy" },
  },
  {
    id: "rehab-pilates",
    host: "임상재활필라테스연구회",
    title: "재활 필라테스 지도자 과정: 척추 질환 편",
    schedule: "11.14(토)",
    region: "부산",
    city: "부산 해운대",
    category: "필라테스",
    price: 220000,
    credit: null,
    dday: 15,
    weekend: true,
    online: false,
    recruiting: true,
    poster: { label: "CLINICAL PILATES", lines: ["REHAB", "PILATES"], subtitle: "척추 질환 편", date: "11.14(토)", theme: "forest" },
  },
  {
    id: "kpta-gyeonggi-2026",
    host: "대한물리치료사협회 경기도회",
    title: "2026 하반기 경기도회 보수교육",
    schedule: "11.22(일)",
    region: "경기",
    city: "경기 수원",
    category: "보수교육",
    price: 0,
    credit: 8,
    dday: 23,
    weekend: true,
    online: false,
    recruiting: true,
    poster: { label: "KPTA GYEONGGI", lines: ["2026", "보수교육"], subtitle: "경기도회", date: "11.22(일)", theme: "cream" },
  },
  {
    id: "lumbar-manual-seoul",
    host: "대한정형도수물리치료학회",
    title: "요추 도수치료 실전: 평가부터 모빌리제이션까지",
    schedule: "11.8(일)",
    region: "서울",
    city: "서울 강남",
    category: "도수치료",
    price: 150000,
    credit: 8,
    dday: 4,
    weekend: true,
    online: false,
    recruiting: true,
    poster: { label: "KAMOMPT", lines: ["LUMBAR", "MANUAL"], subtitle: "요추 도수치료 실전", date: "11.8(일)", theme: "navy" },
  },
  {
    id: "lumbar-pelvis-weekend",
    host: "대한척추교정물리치료학회",
    title: "요추·골반 통합 도수치료 주말 집중반",
    schedule: "11.14(토)~15(일)",
    region: "서울",
    city: "서울 서초",
    category: "도수치료",
    price: 320000,
    credit: 8,
    dday: 6,
    weekend: true,
    online: false,
    recruiting: true,
    poster: { label: "KASMPT", lines: ["LUMBAR", "PELVIS"], subtitle: "주말 집중반", date: "11.14(토)~15(일)", theme: "black" },
  },
  {
    id: "maitland-lumbar-1",
    host: "메이틀랜드정형도수물리치료학회",
    title: "메이틀랜드 요추 Level 1",
    schedule: "11.21(토)",
    region: "서울",
    city: "서울 송파",
    category: "도수치료",
    price: 180000,
    credit: 8,
    dday: 12,
    weekend: true,
    online: false,
    recruiting: true,
    poster: { label: "MAITLAND KOREA", lines: ["MAITLAND", "LUMBAR"], subtitle: "Level 1", date: "11.21(토)", theme: "sky" },
  },
  {
    id: "myofascial-lumbar-disc",
    host: "대한연부조직도수물리치료학회",
    title: "요추 디스크 환자를 위한 근막 이완 기법",
    schedule: "11.28(토)",
    region: "서울",
    city: "서울 마포",
    category: "도수치료",
    price: 120000,
    credit: 4,
    dday: 19,
    weekend: true,
    online: false,
    recruiting: true,
    poster: { label: "MYOFASCIAL", lines: ["SOFT", "TISSUE"], subtitle: "요추 디스크", date: "11.28(토)", theme: "cream" },
  },
  {
    id: "kaltenborn-lumbar",
    host: "칼텐보른-에브옌스정형도수학회",
    title: "칼텐보른 요추 관절가동술 기초",
    schedule: "12.5(토)",
    region: "서울",
    city: "서울 강남",
    category: "도수치료",
    price: 200000,
    credit: 8,
    dday: 26,
    weekend: true,
    online: false,
    recruiting: true,
    poster: { label: "KEOMPT", lines: ["JOINT", "MOBILIZE"], subtitle: "관절가동술 기초", date: "12.5(토)", theme: "forest" },
  },
  {
    id: "lumbar-stability",
    host: "대한기능도수물리치료학회",
    title: "요추 불안정성 평가와 도수 접근",
    schedule: "12.12(토)",
    region: "서울",
    city: "서울 종로",
    category: "도수치료",
    price: 90000,
    credit: null,
    dday: 33,
    weekend: true,
    online: false,
    recruiting: true,
    poster: { label: "FUNCTIONAL MT", lines: ["LUMBAR", "STABILITY"], subtitle: "평가와 도수 접근", date: "12.12(토)", theme: "navy" },
  },
];

export const deadlineSoon = ["kinesio-taping", "lumbar-manual-daegu", "pediatric-vojta", "shoulder-rehab"].map(findSeminar);
export const newlyAdded = ["pnf-level-1", "return-to-play", "rehab-pilates", "kpta-gyeonggi-2026"].map(findSeminar);

function findSeminar(id: string): Seminar {
  const seminar = seminars.find((s) => s.id === id);
  if (!seminar) throw new Error(`Unknown seminar: ${id}`);
  return seminar;
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

export function formatPrice(price: number) {
  return price === 0 ? "무료" : `${price.toLocaleString("ko-KR")}원`;
}

export function isDeadlineSoon(dday: number) {
  return dday <= 7;
}
