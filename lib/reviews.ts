// 저장한 세미나의 수강 확인·후기 (rom-back GET /bookmarks 응답)
import { toSeminar, type ApiSeminar, type Seminar } from "@/lib/seminars";

export type Attendance = "ATTENDED" | "NOT_ATTENDED";

export type Review = {
  rating: number;
  content: string;
  createdAt: string;
  updatedAt: string;
};

export type ApiSavedSeminar = ApiSeminar & {
  bookmarkedAt: string;
  // 교육이 끝났는지 (서버 기준). 끝난 뒤에만 수강 여부를 묻는다
  ended: boolean;
  attendance: Attendance | null;
  review: Review | null;
};

export type SavedSeminar = Seminar & Pick<ApiSavedSeminar, "ended" | "attendance" | "review">;

export function toSavedSeminar(api: ApiSavedSeminar): SavedSeminar {
  return { ...toSeminar(api), ended: api.ended, attendance: api.attendance, review: api.review };
}

// 저장한 세미나가 후기 흐름 어디에 있는지
export type ReviewStage =
  | "upcoming" // 아직 안 끝남
  | "ask" // 끝났고 수강 여부를 아직 안 답함
  | "write" // 수강함, 후기 없음
  | "written" // 후기 작성함
  | "skipped"; // 듣지 않았다고 답함

export function reviewStage(seminar: SavedSeminar): ReviewStage {
  if (!seminar.ended) return "upcoming";
  if (seminar.review) return "written";
  if (seminar.attendance === "ATTENDED") return "write";
  if (seminar.attendance === "NOT_ATTENDED") return "skipped";
  return "ask";
}

export const REVIEW_MIN_LENGTH = 10;
export const REVIEW_MAX_LENGTH = 2000;
