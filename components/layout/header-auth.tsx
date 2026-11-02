"use client";

import Link from "next/link";

import { useLogoutMutation } from "@/hooks/mutations/user/useLogoutMutation";
import { useUserQuery } from "@/hooks/queries/user/useUserQuery";
import { useSession } from "@/hooks/useSession";
import { useVerifyAccess } from "@/hooks/useVerifyAccess";
import { cn } from "@/lib/utils";
import { VerifyChip } from "@/components/verification/verify-chip";
import { UserAvatar } from "./user-avatar";

const pillButton = "inline-flex h-10 items-center justify-center rounded-full px-[18px] text-sm font-semibold whitespace-nowrap";

// 헤더 오른쪽 로그인/회원가입 또는 내 이름(마이페이지 링크)/로그아웃
export function HeaderAuth({ mobile = false }: { mobile?: boolean }) {
  const session = useSession();
  const { data: user, status: userStatus } = useUserQuery(Boolean(session));
  const logout = useLogoutMutation();
  const { access } = useVerifyAccess();

  // 세션 확인 전에는 버튼 자리에 스켈레톤을 둔다
  if (session === undefined) {
    return (
      <div aria-hidden className="flex items-center gap-1.5">
        <div className={cn("skeleton rounded-full", mobile ? "h-[34px] w-12" : "h-10 w-16")} />
        <div className={cn("skeleton rounded-full", mobile ? "h-[34px] w-[72px]" : "h-10 w-[88px]")} />
      </div>
    );
  }

  // 로그인했지만 내 정보를 아직 못 받았으면 프로필 자리만 스켈레톤
  if (session && userStatus === "pending") {
    return (
      <div aria-hidden className="flex items-center gap-1.5">
        <div className="mr-1 flex items-center gap-2">
          <div className={cn("skeleton rounded-full", mobile ? "size-[30px]" : "size-8")} />
          {!mobile && <div className="skeleton h-4 w-16 rounded" />}
        </div>
        <div className={cn("skeleton rounded-full", mobile ? "h-[34px] w-[68px]" : "h-10 w-[84px]")} />
      </div>
    );
  }

  if (session) {
    const name = user?.name ?? session.user.email ?? "회원";
    return (
      <div className="flex items-center gap-1.5">
        <VerifyChip access={access} className={mobile ? "h-6 px-2 text-[11px]" : undefined} />
        {/* 이름(모바일은 프로필 동그라미)을 누르면 마이페이지 */}
        <Link
          href="/mypage"
          aria-label="마이페이지"
          className="mr-1 flex items-center gap-2 rounded-full text-[14.5px] font-semibold text-ink hover:opacity-80"
        >
          <UserAvatar name={name} src={user?.avatarUrl} className={mobile ? "size-[30px] text-[13px]" : "size-8"} />
          {!mobile && <span className="max-w-40 truncate">{name}님</span>}
        </Link>
        <button
          type="button"
          onClick={() => logout.mutate()}
          disabled={logout.isPending}
          className={cn(pillButton, "border border-[#E4E4E4] text-ink", mobile && "h-[34px] px-3.5 text-[13.5px]")}
        >
          로그아웃
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <Link href="/login" className={cn(pillButton, "px-2.5 text-ink", mobile ? "h-[34px]" : "text-[14.5px]")}>
        로그인
      </Link>
      <Link
        href="/signup"
        className={cn(pillButton, "bg-ink text-white", mobile && "h-[34px] px-3.5 text-[13.5px]")}
      >
        회원가입
      </Link>
    </div>
  );
}
