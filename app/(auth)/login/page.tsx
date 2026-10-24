import type { Metadata } from "next";
import Link from "next/link";

import { AuthShell } from "@/components/auth/auth-shell";
import { SocialLoginButtons } from "@/components/auth/social-login-buttons";

export const metadata: Metadata = {
  title: "로그인 · 롬",
};

export default function LoginPage() {
  return (
    <AuthShell
      title="로그인"
      description="다시 오신 걸 환영해요"
      footer={
        <>
          아직 회원이 아니신가요?
          <Link href="/signup" className="ml-1.5 font-bold text-ink underline underline-offset-[3px]">
            회원가입
          </Link>
        </>
      }
    >
      <SocialLoginButtons action="로그인" />
    </AuthShell>
  );
}
