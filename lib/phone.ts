// rom-back 휴대폰번호 API (/phone) 응답 모델. 서버는 가린 번호만 내려준다
export type MyPhone = {
  // 010-****-5678
  masked: string;
  // KAKAO: 카카오 가입 때 받은 번호, MANUAL: 면허 인증 화면에서 입력한 번호
  source: "KAKAO" | "MANUAL";
  // 본인 소유 확인 여부. 지금은 카카오 번호만 true (문자 인증을 붙이면 입력한 번호도 true가 된다)
  verified: boolean;
};

// 국내 휴대폰번호(숫자만): 010·011·016·017·018·019
const KR_MOBILE = /^01[016789]\d{7,8}$/;

export function isValidPhone(digits: string) {
  return KR_MOBILE.test(digits);
}

// 입력 중인 숫자를 010-1234-5678 모양으로 보여준다
export function formatPhoneInput(digits: string) {
  if (digits.length < 4) return digits;
  if (digits.length < 8) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  const middle = digits.length === 10 ? 3 : 4;
  return `${digits.slice(0, 3)}-${digits.slice(3, 3 + middle)}-${digits.slice(3 + middle)}`;
}
