export type Category =
  | "MANUAL_THERAPY"
  | "TAPING"
  | "EXERCISE"
  | "PILATES"
  | "NEURO"
  | "SPORTS"
  | "PEDIATRIC"
  | "ETC";

export type Format = "OFFLINE" | "ONLINE" | "HYBRID";

export type Region =
  | "SEOUL"
  | "BUSAN"
  | "DAEGU"
  | "INCHEON"
  | "GWANGJU"
  | "DAEJEON"
  | "ULSAN"
  | "SEJONG"
  | "GYEONGGI"
  | "GANGWON"
  | "CHUNGBUK"
  | "CHUNGNAM"
  | "JEONBUK"
  | "JEONNAM"
  | "GYEONGBUK"
  | "GYEONGNAM"
  | "JEJU";

export type Seminar = {
  id: string;
  title: string;
  provider: string;
  instructors: string[];
  category: Category;
  format: Format;
  startAt: string;
  endAt: string;
  isWeekend: boolean;
  region: Region | null;
  venue: string | null;
  price: number | null;
  kptaCredits: number | null;
  applyStartAt: string | null;
  applyDeadline: string | null;
  capacity: number | null;
  applyUrl: string | null;
  sourceUrl: string;
};
