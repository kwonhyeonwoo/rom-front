// 소셜 로그인 버튼을 누를 때 어떤 방식으로 로그인하는지 잠깐 쿠키에 적어 두고, 콜백에서 읽는다.
// (redirectTo에 쿼리를 붙이면 Supabase 허용 주소 목록과 어긋날 수 있어 쿠키를 쓴다)
export const OAUTH_PROVIDER_COOKIE = "rom_oauth_provider";

export const providerNames: Record<string, string> = {
  google: "구글",
  kakao: "카카오",
};

// 카카오 로그인 버튼을 보여줄지. 카카오 비즈앱·동의항목 검수가 끝나기 전에는 false로 두고 구글만 연다.
// true로 바꾸면 코드 수정 없이 로그인·회원가입 화면에 카카오 버튼이 다시 나온다 (NEXT_PUBLIC_ 이라 바꾼 뒤 다시 빌드해야 한다)
export const KAKAO_LOGIN_ENABLED = process.env.NEXT_PUBLIC_KAKAO_LOGIN_ENABLED === "true";
