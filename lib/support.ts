// 고객센터 (rom-back /notices, /inquiries, /admin/inquiries, /admin/notices) 응답 모델과 화면 문구

export type NoticeCategory = "SERVICE" | "MAINTENANCE" | "EVENT";
export type InquiryType = "ACCOUNT" | "SEMINAR" | "PARTNER" | "ETC";
export type InquiryStatus = "OPEN" | "ANSWERED";

export type NoticeItem = {
  id: string;
  category: NoticeCategory;
  title: string;
  pinned: boolean;
  createdAt: string;
};

export type Notice = NoticeItem & { content: string; updatedAt: string };

export type NoticePage = { items: NoticeItem[]; page: number; totalPages: number };

export type Inquiry = {
  id: string;
  type: InquiryType;
  title: string;
  content: string;
  status: InquiryStatus;
  answer: string | null;
  answeredAt: string | null;
  // 답변이 달렸는데 아직 열어보지 않았다
  unread: boolean;
  createdAt: string;
};

// 관리자 화면은 회원 여부, 접수 당시 이메일, 답변한 관리자를 더 받는다.
// member가 false인 문의는 회원 전용으로 바꾸기 전에 받은 비회원 문의다
export type AdminInquiry = Inquiry & { member: boolean; email: string | null; answeredBy: string | null };

export type AdminSummary = { pendingVerifications: number; openInquiries: number };

export const noticeCategories: { value: NoticeCategory; label: string }[] = [
  { value: "SERVICE", label: "안내" },
  { value: "MAINTENANCE", label: "점검" },
  { value: "EVENT", label: "이벤트" },
];

export const noticeCategoryLabel = (value: NoticeCategory) =>
  noticeCategories.find((c) => c.value === value)?.label ?? "안내";

export const inquiryTypes: { value: InquiryType; label: string }[] = [
  { value: "ACCOUNT", label: "계정·면허 인증" },
  { value: "SEMINAR", label: "세미나 정보 오류" },
  { value: "PARTNER", label: "광고·제휴" },
  { value: "ETC", label: "기타" },
];

export const inquiryTypeLabel = (value: InquiryType) =>
  inquiryTypes.find((t) => t.value === value)?.label ?? "기타";

export const inquiryStatusChip: Record<InquiryStatus, { label: string; className: string }> = {
  OPEN: { label: "답변 대기", className: "bg-[#FFF4E5] text-[#B25E00]" },
  ANSWERED: { label: "답변 완료", className: "bg-[#E6F2EF] text-brand" },
};

export const INQUIRY_TITLE_MAX = 100;
export const INQUIRY_CONTENT_MIN = 10;
export const INQUIRY_CONTENT_MAX = 3000;
export const ANSWER_MAX = 5000;
export const NOTICE_CONTENT_MAX = 10000;

// 자주 묻는 질문. 운영하면서 늘려간다
export const faqs: { q: string; a: string }[] = [
  {
    q: "롬의 세미나 정보는 어디서 오나요?",
    a: "대한물리치료사협회, 각 학회, 교육업체 홈페이지에 올라온 공지를 매일 모아서 같은 형식으로 정리해요. 신청은 원래 사이트에서 하고, 정확한 일정과 가격은 신청 전에 원문에서 한 번 더 확인해주세요.",
  },
  {
    q: "세미나 정보가 원문과 달라요",
    a: "자동으로 모으다 보니 틀린 부분이 있을 수 있어요. 1:1 문의에서 '세미나 정보 오류'를 골라 세미나 이름과 틀린 내용을 알려주시면 바로 고칠게요.",
  },
  {
    q: "면허 인증은 얼마나 걸리나요?",
    a: "보통 영업일 기준 1~2일 안에 확인해요. 반려되면 인증 화면에 사유가 보이니, 사유에 맞게 다시 제출해주세요.",
  },
  {
    q: "면허 인증은 왜 필요한가요?",
    a: "커뮤니티를 물리치료사만 쓰는 공간으로 지키기 위해서예요. 글 목록은 누구나 볼 수 있고, 글·댓글 쓰기와 댓글 보기는 인증한 회원만 할 수 있어요. 면허증 사진은 심사가 끝나면 바로 지워요.",
  },
  {
    q: "보수교육 인정 여부는 믿을 수 있나요?",
    a: "원문 공지에 적힌 내용을 옮긴 것이라 최종 인정 여부와 평점은 협회 보수교육 시스템에서 확인해주세요.",
  },
  {
    q: "교육업체인데 세미나를 올리거나 광고하고 싶어요",
    a: "로그인 후 1:1 문의에서 '광고·제휴'를 골라 업체명과 연락처를 남겨주세요. 답변은 마이페이지 문의 내역에서 확인할 수 있고, 계정이 없으면 하단의 contact 메일로 보내주세요.",
  },
  {
    q: "탈퇴하고 싶어요",
    a: "1:1 문의에서 '계정·면허 인증'을 골라 탈퇴 요청을 남겨주세요. 확인 후 계정과 저장한 정보를 지워드려요.",
  },
];

// 공지·문의 날짜 (한국 시간 기준 2026.11.03)
export function formatDate(iso: string | null) {
  if (!iso) return "";
  const kst = new Date(new Date(iso).getTime() + 9 * 3_600_000);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${kst.getUTCFullYear()}.${pad(kst.getUTCMonth() + 1)}.${pad(kst.getUTCDate())}`;
}
