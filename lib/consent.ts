// 동의 화면에 보여주는 개인정보처리방침·이용약관의 버전(시행일).
// lib/legal의 effectiveDate와 rom-back src/consent/consent.constants.ts의 CONSENT_VERSIONS를 함께 바꾼다
export const CONSENT_VERSION = "2026-11-05";

export type ConsentRecord = { agreed: boolean; version: string; at: string } | null;

export type MyConsents = {
  licensePrivacy: ConsentRecord;
  communityRules: ConsentRecord;
  marketing: ConsentRecord;
};

// 면허 인증 요청에 함께 보내는 동의 (rom-back POST /verification의 agreements)
export type VerificationAgreements = {
  licensePrivacy: true;
  communityRules: true;
  marketing: boolean;
  version: string;
};
