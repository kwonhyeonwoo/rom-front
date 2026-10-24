import { NextResponse, type NextRequest } from "next/server";

import { getSupabaseServerClient } from "@/lib/supabase/server";

// 카카오·구글 로그인 후 Supabase가 돌려보내는 곳. code를 세션으로 바꾸고 원래 가려던 곳으로 보낸다.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";
  // 외부 주소로 튕겨나가지 않도록 내부 경로만 허용
  const redirectPath = next.startsWith("/") && !next.startsWith("//") ? next : "/";

  if (code) {
    const supabase = await getSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(redirectPath, origin));
  }

  return NextResponse.redirect(new URL("/login?error=oauth", origin));
}
