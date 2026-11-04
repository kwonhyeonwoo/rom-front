// 커뮤니티 신고 (rom-back /posts/:id/report, /comments/:id/report, /admin/reports) 모델과 화면 문구
export type ReportTarget = "POST" | "COMMENT";
export type ReportReason = "SPAM" | "ABUSE" | "PRIVACY" | "FALSE_INFO" | "ETC";

export const reportReasons: { value: ReportReason; label: string; hint: string }[] = [
  { value: "SPAM", label: "스팸·광고", hint: "홍보, 도배, 외부 링크 유도" },
  { value: "ABUSE", label: "욕설·비방", hint: "욕설, 인신공격, 혐오 표현" },
  { value: "PRIVACY", label: "개인정보·환자정보 노출", hint: "이름, 연락처, 환자를 알아볼 수 있는 정보" },
  { value: "FALSE_INFO", label: "허위 정보", hint: "사실과 다른 세미나·임상 정보" },
  { value: "ETC", label: "기타", hint: "어떤 문제인지 적어주세요" },
];

export const reportReasonLabel = (value: ReportReason) =>
  reportReasons.find((r) => r.value === value)?.label ?? "기타";

// 서버(rom-back)와 같은 값
export const REPORT_DETAIL_MIN = 5;
export const REPORT_DETAIL_MAX = 500;

// ── 관리자 ──────────────────────────────────────

export type ReportFilter = "PENDING" | "RESOLVED";
export type ReportResolution = "HIDDEN" | "DISMISSED" | "TARGET_DELETED";
// 대상의 지금 상태. REVIEWING: 신고가 쌓여 자동으로 숨긴 채 검토 대기
export type TargetState = "VISIBLE" | "REVIEWING" | "HIDDEN" | "DELETED";
export type Sanction = "NONE" | "WARNING" | "SUSPEND_7" | "SUSPEND_30";

export const reportTabs: { value: ReportFilter; label: string }[] = [
  { value: "PENDING", label: "대기" },
  { value: "RESOLVED", label: "처리 완료" },
];

// 신고를 대상(글·댓글)별로 묶은 목록 한 줄
export type AdminReportGroup = {
  key: string;
  targetType: ReportTarget;
  targetId: string;
  postId: string;
  // 글 제목. 댓글이면 댓글이 달린 글의 제목
  title: string | null;
  excerpt: string;
  authorName: string;
  byOperator: boolean;
  reportCount: number;
  reasons: { reason: ReportReason; count: number }[];
  firstReportedAt: string;
  lastReportedAt: string;
  state: TargetState;
  resolution: ReportResolution | null;
  resolvedAt: string | null;
  resolvedBy: string | null;
};

export type MemberAccount = {
  id: string;
  email: string | null;
  provider: string | null;
  name: string | null;
  joinedAt: string | null;
  verification: { status: "PENDING" | "APPROVED" | "REJECTED"; name: string } | null;
  phoneMasked: string | null;
  operator: boolean;
  exists: boolean;
};

export type AdminReportDetail = {
  targetType: ReportTarget;
  targetId: string;
  postId: string;
  state: TargetState;
  pendingCount: number;
  target: {
    title: string | null;
    content: string | null;
    authorName: string;
    byOperator: boolean;
    board: string | null;
    images: string[];
    createdAt: string | null;
    hiddenAt: string | null;
    hiddenBy: string | null;
  };
  // 작성자가 탈퇴했으면 null
  author: {
    account: MemberAccount | null;
    reportCount: number;
    hiddenCount: number;
    suspendedUntil: string | null;
    sanctions: {
      id: string;
      kind: "WARNING" | "SUSPENSION";
      until: string | null;
      note: string | null;
      createdBy: string;
      createdAt: string;
    }[];
  } | null;
  reports: {
    id: string;
    reason: ReportReason;
    detail: string | null;
    status: ReportFilter;
    resolution: ReportResolution | null;
    resolvedAt: string | null;
    resolvedBy: string | null;
    resolveNote: string | null;
    createdAt: string;
    // 신고자가 탈퇴했으면 null
    reporter: { account: MemberAccount | null; total: number; dismissed: number } | null;
  }[];
};

export const targetStateChip: Record<TargetState, { label: string; className: string }> = {
  VISIBLE: { label: "게시 중", className: "bg-surface text-sub" },
  REVIEWING: { label: "자동 숨김", className: "bg-[#FFF4E5] text-[#B25E00]" },
  HIDDEN: { label: "숨김", className: "bg-[#FDECEA] text-soon" },
  DELETED: { label: "삭제됨", className: "bg-surface text-faint" },
};

export const resolutionLabel: Record<ReportResolution, string> = {
  HIDDEN: "숨김 처리",
  DISMISSED: "반려",
  TARGET_DELETED: "삭제돼 닫음",
};

export const sanctionOptions: { value: Sanction; label: string; hint: string }[] = [
  { value: "NONE", label: "제재 없음", hint: "글만 숨겨요" },
  { value: "WARNING", label: "경고", hint: "기록만 남겨요" },
  { value: "SUSPEND_7", label: "7일 제한", hint: "7일간 글·댓글 쓰기 제한" },
  { value: "SUSPEND_30", label: "30일 제한", hint: "30일간 글·댓글 쓰기 제한" },
];

export const providerLabel = (provider: string | null) =>
  provider === "kakao" ? "카카오" : provider === "google" ? "구글" : (provider ?? "알 수 없음");
