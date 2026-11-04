// rom-back 커뮤니티 API (/posts) 응답 모델
export type Board = "REVIEW" | "QNA" | "JOB" | "FREE";

export const boards: { value: Board; label: string; hint: string }[] = [
  {
    value: "REVIEW",
    label: "세미나 후기",
    hint: "들은 세미나의 후기를 나눠요",
  },
  {
    value: "QNA",
    label: "임상 Q&A",
    hint: "임상 질문과 치료 방법을 이야기해요",
  },
  {
    value: "JOB",
    label: "취업·구인",
    hint: "채용 공고와 이직 정보를 공유해요",
  },
  {
    value: "FREE",
    label: "자유",
    hint: "보수교육, 직장 고민 등 편하게 이야기해요",
  },
];

export const boardLabel = (board: Board) =>
  boards.find((b) => b.value === board)!.label;

export type PostSeminar = {
  id: string;
  title: string;
  host: string | null;
  startDate: string | null;
  endDate: string | null;
  region: string | null;
  ceCredits: number | null;
  // 이 세미나에 남겨진 수강 후기(Review)의 평균 별점과 개수
  avgRating: number | null;
  reviewCount: number;
};

export type CommunitySummary = {
  myPostCount: number;
  myCommentCount: number;
  topSeminars: {
    id: string;
    title: string;
    host: string | null;
    reviewCount: number;
    avgRating: number | null;
  }[];
};

export type Post = {
  id: string;
  board: Board;
  title: string;
  content: string;
  authorName: string;
  anonymous: boolean;
  // 운영 계정이 쓴 글 ("ROM 운영팀" 배지)
  byOperator: boolean;
  // 첫 글 이벤트 참여 글
  eventEntry: boolean;
  // 게시 시각(createdAt)이 아직 오지 않은 예약 글. 작성자에게만 내려온다
  scheduled: boolean;
  mine: boolean;
  liked: boolean;
  likeCount: number;
  commentCount: number;
  viewCount: number;
  createdAt: string;
  // 마이페이지 수강 후기로 쓴 글이면 작성자가 준 별점(1~5)
  rating: number | null;
  seminar: PostSeminar | null;
};

export type PostComment = {
  id: string;
  content: string;
  authorName: string;
  anonymous: boolean;
  byOperator: boolean;
  mine: boolean;
  byAuthor: boolean;
  createdAt: string;
};

// commentsLocked: 면허 인증을 마친 회원이 아니라서 댓글 내용이 내려오지 않았다 (개수는 commentCount)
export type PostDetail = Post & { comments: PostComment[]; commentsLocked: boolean };

export type PostPage = {
  items: Post[];
  total: number;
  page: number;
  limit: number;
};

export const POST_TITLE_MAX = 100;
// 운영 계정의 예약 게시는 90일 안으로 (서버와 같은 값)
export const SCHEDULE_MAX_DAYS = 90;
export const OPERATOR_NAME = "ROM 운영팀";
export const POST_CONTENT_MIN = 5;
export const POST_CONTENT_MAX = 5000;
export const COMMENT_MAX = 1000;

// 서버(rom-back)가 보여주는 이름과 같은 규칙: 익명이면 "익명", 아니면 성만 남기고 가린다
export function previewName(
  name: string | null | undefined,
  anonymous: boolean,
) {
  if (anonymous) return "익명";
  const base = name?.trim().split("@")[0];
  if (!base) return "회원";
  const chars = Array.from(base);
  return chars.length <= 1
    ? base
    : chars[0] + "○".repeat(Math.min(chars.length - 1, 3));
}

// 예약 게시 시각: "11.10 09:00" (한국 시간)
export function formatPublishAt(iso: string) {
  const kst = new Date(new Date(iso).getTime() + 9 * 3_600_000);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${kst.getUTCMonth() + 1}.${kst.getUTCDate()} ${pad(kst.getUTCHours())}:${pad(kst.getUTCMinutes())}`;
}

// "방금 전", "12분 전", "3시간 전", 하루가 지나면 날짜
export function timeAgo(iso: string, now = Date.now()) {
  const diff = Math.max(0, now - new Date(iso).getTime());
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "방금 전";
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  const kst = new Date(new Date(iso).getTime() + 9 * 3_600_000);
  return `${kst.getUTCMonth() + 1}.${kst.getUTCDate()}`;
}
