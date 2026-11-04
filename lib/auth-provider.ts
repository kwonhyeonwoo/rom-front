// 소셜 로그인 버튼을 누를 때 어떤 방식으로 로그인하는지 잠깐 쿠키에 적어 두고, 콜백에서 읽는다.
// (redirectTo에 쿼리를 붙이면 Supabase 허용 주소 목록과 어긋날 수 있어 쿠키를 쓴다)
export const OAUTH_PROVIDER_COOKIE = "rom_oauth_provider";

export const providerNames: Record<string, string> = {
  google: "구글",
  kakao: "카카오",
};
