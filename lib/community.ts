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
  // 본문. **굵게**, "- " 목록, "1. " 번호 목록만 쓰는 간단한 서식 (post-content.tsx가 그린다)
  content: string;
  // 분야 태그 (최대 3개)
  fields: string[];
  // 본문 사진 주소
  images: string[];
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

// 글 분야 태그. 서버(rom-back POST_FIELDS)와 같은 목록
export const POST_FIELDS = [
  "도수치료",
  "테이핑",
  "운동치료",
  "필라테스",
  "신경계 재활",
  "스포츠",
  "소아",
  "심폐",
  "기타",
] as const;
export const POST_FIELDS_MAX = 3;

// 글 사진: 공개 버킷, 한 장 5MB, 최대 10장 (서버와 같은 값)
export const POST_IMAGE_BUCKET = "post-images";
export const POST_IMAGES_MAX = 10;
export const POST_IMAGE_MAX_BYTES = 5 * 1024 * 1024;
export const POST_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

// 글쓰기 화면의 게시판별 작성 가이드와 "양식 넣기"로 넣는 본문 틀
export const boardGuides: Record<
  Board,
  { title: string; tips: string[]; template: { label: string; text: string } | null }
> = {
  REVIEW: {
    title: "세미나 후기는 이렇게 쓰면 많이 읽혀요",
    tips: [
      "어떤 세미나였는지 (강사, 일정, 실습 비중)",
      "좋았던 점과 아쉬웠던 점을 하나씩",
      "이런 분께 추천해요, 가격 대비 만족도",
    ],
    template: {
      label: "후기 양식 넣기",
      text: "**어떤 세미나였나요**\n\n\n**좋았던 점**\n- \n\n**아쉬웠던 점**\n- \n\n**이런 분께 추천해요**\n",
    },
  },
  QNA: {
    title: "상황을 자세히 쓸수록 답이 빨리 달려요",
    tips: [
      "환자 나이대, 증상, 발병 기간 (누구인지 알 수 있는 정보는 빼고)",
      "지금까지 해본 평가와 치료",
      "궁금한 점을 한 문장으로",
    ],
    template: {
      label: "질문 양식 넣기",
      text: "**환자 상황**\n\n\n**해본 평가·치료**\n- \n\n**궁금한 점**\n",
    },
  },
  JOB: {
    title: "채용 글에는 이 정보가 있어야 지원이 많아요",
    tips: [
      "근무지(시·구)와 기관 종류",
      "근무 시간, 급여 같은 근무 조건",
      "지원 방법과 마감일",
    ],
    template: {
      label: "채용 양식 넣기",
      text: "**근무지**\n\n\n**근무 조건**\n- 근무 시간: \n- 급여: \n\n**지원 방법·마감일**\n",
    },
  },
  FREE: {
    title: "편하게 이야기해요",
    tips: [
      "보수교육, 직장 고민, 일상 이야기 모두 좋아요",
      "서로 존중하는 말투로 써주세요",
    ],
    template: null,
  },
};

// 목록 미리보기용: 서식 기호(**, 목록 머리)를 걷어낸 한 덩어리 글
export function plainContent(content: string) {
  return content
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/^\s*(?:- |\d+\. )/gm, "")
    .replace(/\s+/g, " ")
    .trim();
}

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
