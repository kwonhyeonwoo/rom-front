// rom-back 면허 인증 API (/verification) 응답 모델
export type VerifyStatus = "NONE" | "PENDING" | "APPROVED" | "REJECTED";

export type Verification = {
  status: VerifyStatus;
  // 반려됐을 때만 값이 있다
  rejectReason: string | null;
  requestedAt: string | null;
  reviewedAt: string | null;
};

// 비로그인(GUEST)과 아직 확인 중(LOADING)까지 포함한 화면용 상태
export type VerifyAccess = VerifyStatus | "GUEST" | "LOADING";

export const LICENSE_BUCKET = "license-images";
export const LICENSE_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
export const LICENSE_IMAGE_MAX_BYTES = 5 * 1024 * 1024;

export const LICENSE_FIELDS = ["근골격·도수", "신경계 재활", "스포츠", "소아", "심폐", "기타"] as const;

export const verifyLabel: Record<VerifyStatus, string> = {
  NONE: "인증 필요",
  PENDING: "심사 중",
  APPROVED: "인증 PT",
  REJECTED: "재제출 필요",
};

// 서버가 인증 전 쓰기를 막을 때 내려주는 403 응답인지
export function isVerificationRequired(error: unknown) {
  if (!(error instanceof Error) || !("status" in error) || error.status !== 403) return false;
  return error.message.includes("VERIFICATION_REQUIRED");
}

export function formatRequestedAt(iso: string | null) {
  if (!iso) return "";
  const kst = new Date(new Date(iso).getTime() + 9 * 3_600_000);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${kst.getUTCMonth() + 1}.${kst.getUTCDate()} ${pad(kst.getUTCHours())}:${pad(kst.getUTCMinutes())}`;
}
