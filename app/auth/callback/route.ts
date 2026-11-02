import { NextResponse, type NextRequest } from "next/server";

import { getSupabaseServerClient } from "@/lib/supabase/server";
import { WELCOME_COOKIE } from "@/lib/welcome";

// 계정이 만들어진 지 이 시간 안이면 새로 가입한 것으로 본다
const NEW_USER_WINDOW_MS = 2 * 60 * 1000;

// 카카오·구글 로그인 후 Supabase가 돌려보내는 곳. code를 세션으로 바꾸고 원래 가려던 곳으로 보낸다.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";
  // 외부 주소로 튕겨나가지 않도록 내부 경로만 허용
  const redirectPath = next.startsWith("/") && !next.startsWith("//") ? next : "/";

  if (code) {
    const supabase = await getSupabaseServerClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const response = NextResponse.redirect(new URL(redirectPath, origin));
      // 방금 만들어진 계정이면(처음 가입, 또는 탈퇴 후 같은 계정으로 다시 로그인) 환영 안내를 띄운다.
      // 탈퇴하면 계정이 완전히 지워지므로 같은 카카오·구글 계정이어도 새 회원으로 가입된다
      const createdAt = data.user?.created_at ? Date.parse(data.user.created_at) : NaN;
      if (Date.now() - createdAt < NEW_USER_WINDOW_MS) {
        response.cookies.set(WELCOME_COOKIE, "1", { path: "/", maxAge: 60, sameSite: "lax" });
      }
      return response;
    }
  }

  return NextResponse.redirect(new URL("/login?error=oauth", origin));
}
