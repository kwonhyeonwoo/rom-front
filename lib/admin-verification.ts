// rom-back 관리자 면허 인증 API (/admin/verifications) 응답 모델
export type ReviewStatus = "PENDING" | "APPROVED" | "REJECTED";

// 목록에는 면허번호 뒤 4자리만 온다
export type AdminVerificationItem = {
  id: string;
  status: ReviewStatus;
  name: string;
  licenseLast4: string;
  acquiredYear: number;
  field: string;
  requestedAt: string;
  reviewedAt: string | null;
};

// 상세는 면허번호 전체와 몇 분만 유효한 사진 주소를 준다. 사진은 처리 후 지워져 null이 된다
export type AdminVerificationDetail = {
  id: string;
  status: ReviewStatus;
  name: string;
  licenseNumber: string;
  acquiredYear: number;
  field: string;
  requestedAt: string;
  imageUrl: string | null;
};

export const reviewTabs: { value: ReviewStatus; label: string }[] = [
  { value: "PENDING", label: "대기" },
  { value: "APPROVED", label: "승인" },
  { value: "REJECTED", label: "반려" },
];

// 자주 쓰는 반려 사유. 고른 뒤 문구를 고쳐 보낼 수 있다
export const rejectTemplates = [
  "면허증 사진이 흐려 내용을 확인하기 어려워요. 글자가 잘 보이게 다시 찍어주세요",
  "입력한 이름이나 면허번호가 면허증과 달라요. 면허증과 같게 입력해주세요",
  "물리치료사 면허증이 아닌 서류예요. 물리치료사 면허증 사진을 올려주세요",
  "면허증 일부가 가려졌거나 잘렸어요. 전체가 보이게 다시 찍어주세요",
] as const;

export const REJECT_REASON_MIN = 2;
export const REJECT_REASON_MAX = 200;
