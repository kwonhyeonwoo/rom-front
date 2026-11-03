"use client";

import Link from "next/link";
import { Bell } from "lucide-react";

import { useLogoutMutation } from "@/hooks/mutations/user/useLogoutMutation";
import { useUnreadAnswersQuery } from "@/hooks/queries/support/useUnreadAnswersQuery";
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
  const { data: user } = useUserQuery(Boolean(session));
  const unread = useUnreadAnswersQuery(Boolean(session));
  const logout = useLogoutMutation();
  const { access } = useVerifyAccess();

  // 세션 확인 전에는 버튼 자리만 비워 깜빡임을 줄인다
  if (session === undefined) return <div className={mobile ? "h-[34px]" : "h-10"} />;

  if (session) {
    const name = user?.name ?? session.user.email ?? "회원";
    return (
      <div className="flex items-center gap-1.5">
        {/* 문의에 답변이 달리면 빨간 숫자 배지와 함께 내 문의 내역으로 연결한다 */}
        <Link
          href="/help/inquiries"
          aria-label={unread.data ? `새 답변 ${unread.data}개` : "내 문의 내역"}
          className={cn("relative flex items-center justify-center rounded-full text-[#555] hover:bg-surface hover:text-ink", mobile ? "size-8" : "mr-0.5 size-9")}
        >
          <Bell size={19} strokeWidth={1.8} />
          {Boolean(unread.data) && (
            <span className="absolute top-0.5 right-0 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-soon px-1 text-[10.5px] font-bold text-white tabular-nums">
              {unread.data}
            </span>
          )}
        </Link>
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
