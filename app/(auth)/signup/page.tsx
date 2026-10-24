import type { Metadata } from "next";
import Link from "next/link";

import { AuthShell } from "@/components/auth/auth-shell";
import { SocialLoginButtons } from "@/components/auth/social-login-buttons";

export const metadata: Metadata = {
  title: "회원가입 · 롬",
};

export default function SignupPage() {
  return (
    <AuthShell
      title="회원가입"
      description="물리치료 세미나와 보수교육을 한곳에서 찾아보세요"
      footer={
        <>
          이미 계정이 있으신가요?
          <Link href="/login" className="ml-1.5 font-bold text-ink underline underline-offset-[3px]">
            로그인
          </Link>
        </>
      }
    >
      <SocialLoginButtons action="시작하기" />
      <p className="mt-[18px] text-[12.5px] leading-[1.6] text-faint">
        가입하면{" "}
        <Link href="/terms" className="text-sub underline">
          이용약관
        </Link>{" "}
        및{" "}
        <Link href="/privacy" className="text-sub underline">
          개인정보처리방침
        </Link>
        에 동의하게 돼요
      </p>
    </AuthShell>
  );
}
