import { NextResponse, type NextRequest } from "next/server";

import { OAUTH_PROVIDER_COOKIE } from "@/lib/auth-provider";
import { getSupabaseServerClient } from "@/lib/supabase/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

type SignInCheck = { allowed: true } | { allowed: false; provider: string };

// 카카오·구글 로그인 후 Supabase가 돌려보내는 곳. code를 세션으로 바꾸고 원래 가려던 곳으로 보낸다.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";
  // 외부 주소로 튕겨나가지 않도록 내부 경로만 허용
  const redirectPath = next.startsWith("/") && !next.startsWith("//") ? next : "/";
  const usedProvider = request.cookies.get(OAUTH_PROVIDER_COOKIE)?.value;

  let target = new URL("/login?error=oauth", origin);
  if (code) {
    const supabase = await getSupabaseServerClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const check = await checkSignIn(data.session.access_token, usedProvider);
      if (check.allowed) {
        // 카카오 로그인이면 카카오가 가진 휴대폰번호를 저장해 둔다 (동의한 경우만 값이 온다)
        const provider = usedProvider ?? data.session.user.app_metadata?.provider;
        if (provider === "kakao" && data.session.provider_token) {
          await saveKakaoPhone(data.session.access_token, data.session.provider_token);
        }
        target = new URL(redirectPath, origin);
      } else {
        // 같은 이메일이 다른 방식으로 이미 가입돼 있다. 이 로그인은 끊고 가입한 방식을 안내한다
        await supabase.auth.signOut({ scope: "local" });
        target = new URL(`/login?error=linked&provider=${encodeURIComponent(check.provider)}`, origin);
      }
    }
  }

  const response = NextResponse.redirect(target);
  response.cookies.delete(OAUTH_PROVIDER_COOKIE);
  return response;
}

// 같은 이메일로 다른 소셜 로그인을 했는지 rom-back에 묻는다.
// 서버에 닿지 않으면 로그인 자체를 막지 않는다 (다음 로그인 때 다시 확인된다)
async function checkSignIn(accessToken: string, provider: string | undefined): Promise<SignInCheck> {
  try {
    const res = await fetch(`${API_URL}/auth/sign-in-check`, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
      body: JSON.stringify(provider === "google" || provider === "kakao" ? { provider } : {}),
      cache: "no-store",
    });
    if (!res.ok) return { allowed: true };
    return (await res.json()) as SignInCheck;
  } catch {
    return { allowed: true };
  }
}

// 카카오 토큰을 rom-back에 넘겨 카카오 동의항목의 휴대폰번호를 저장한다. 번호는 서버끼리만 오가고 화면·로그에 남지 않는다.
// 실패해도 로그인은 그대로 진행한다 (번호가 없으면 면허 인증 때 직접 입력받는다)
async function saveKakaoPhone(accessToken: string, kakaoToken: string) {
  try {
    await fetch(`${API_URL}/phone/kakao`, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({ accessToken: kakaoToken }),
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
  } catch {
    // 무시
  }
}
