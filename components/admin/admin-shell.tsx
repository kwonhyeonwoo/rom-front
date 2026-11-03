"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BadgeCheck, LogOut, Megaphone, MessagesSquare } from "lucide-react";

import { AdminLogin } from "@/components/admin/admin-login";
import { Logo } from "@/components/layout/logo";
import { useAdminSummaryQuery } from "@/hooks/queries/admin/useAdminSummaryQuery";
import { clearAdminToken, useAdminToken } from "@/lib/admin-session";
import type { AdminSummary } from "@/lib/support";
import { cn } from "@/lib/utils";

const menu: { label: string; href: string; icon: typeof BadgeCheck; badge?: keyof AdminSummary }[] = [
  { label: "면허 인증 심사", href: "/admin/verifications", icon: BadgeCheck, badge: "pendingVerifications" },
  { label: "1:1 문의", href: "/admin/inquiries", icon: MessagesSquare, badge: "openInquiries" },
  { label: "공지사항", href: "/admin/notices", icon: Megaphone },
];

// 관리자 토큰(JWT)의 sub = 관리자 로그인 아이디. 화면 표시용으로만 읽고 검증은 서버가 한다
function adminIdFrom(token: string) {
  try {
    const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return (JSON.parse(atob(payload)) as { sub?: string }).sub ?? "관리자";
  } catch {
    return "관리자";
  }
}

// 관리자 화면 공통 틀: 일반 헤더·푸터·하단 탭바 없이 로고와 로그인 상태만 있는 헤더,
// 그리고 처리할 일을 고르는 사이드바(모바일은 헤더 아래 가로 탭)
export function AdminShell({ children }: { children: React.ReactNode }) {
  const token = useAdminToken();
  const pathname = usePathname();
  const summary = useAdminSummaryQuery(Boolean(token));

  return (
    <div className="flex min-h-full flex-1 flex-col bg-white">
      <header className="sticky top-0 z-30 border-b border-[#EFEFEF] bg-white">
        <div className="flex h-14 items-center justify-between px-5 md:h-16 md:px-8">
          <div className="flex items-center gap-2.5">
            <Logo className="text-[26px]" />
            <span className="rounded-md bg-surface px-2 py-0.5 text-[12px] font-bold text-sub">관리자</span>
          </div>
          {token && (
            <div className="flex items-center gap-3 md:gap-4">
              <p className="flex items-center gap-1.5 text-[13px] text-sub md:text-[13.5px]">
                <span className="size-2 rounded-full bg-brand" aria-hidden />
                <span className="font-bold text-ink">{adminIdFrom(token)}</span>
                <span className="hidden sm:inline">로그인 중</span>
              </p>
              <button
                onClick={clearAdminToken}
                className="flex h-9 items-center gap-1.5 rounded-full border border-[#E4E4E4] px-3.5 text-[13px] font-bold hover:border-[#CFCFCF]"
              >
                <LogOut size={14} />
                로그아웃
              </button>
            </div>
          )}
        </div>

        {token && (
          <nav aria-label="관리 메뉴" className="flex gap-1.5 overflow-x-auto px-5 pb-2.5 md:hidden">
            {menu.map((item) => (
              <MenuLink key={item.href} item={item} active={pathname.startsWith(item.href)} count={item.badge ? summary.data?.[item.badge] : undefined} compact />
            ))}
          </nav>
        )}
      </header>

      {token === undefined ? (
        <div className="flex-1" aria-busy />
      ) : token === null ? (
        <main className="flex-1">
          <AdminLogin />
        </main>
      ) : (
        <div className="flex flex-1">
          <aside className="hidden w-[232px] shrink-0 border-r border-[#EFEFEF] md:block">
            <nav aria-label="관리 메뉴" className="sticky top-16 flex flex-col gap-1 p-4">
              <p className="px-3 pt-2 pb-2 text-[12px] font-bold tracking-[.04em] text-faint">관리 메뉴</p>
              {menu.map((item) => (
                <MenuLink key={item.href} item={item} active={pathname.startsWith(item.href)} count={item.badge ? summary.data?.[item.badge] : undefined} />
              ))}
            </nav>
          </aside>
          <main className="min-w-0 flex-1 px-5 pt-5 pb-12 md:px-8 md:pt-8">
            <div className="mx-auto max-w-[1160px]">{children}</div>
          </main>
        </div>
      )}
    </div>
  );
}

function MenuLink({
  item,
  active,
  count,
  compact = false,
}: {
  item: (typeof menu)[number];
  active: boolean;
  count?: number;
  compact?: boolean;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex shrink-0 items-center gap-2.5 font-semibold transition-colors",
        compact ? "h-9 rounded-full px-3.5 text-[13.5px]" : "h-11 rounded-[10px] px-3 text-[14.5px]",
        active ? (compact ? "bg-ink text-white" : "bg-surface text-ink") : "text-sub hover:bg-surface hover:text-ink",
      )}
    >
      {!compact && <Icon size={18} strokeWidth={1.9} />}
      <span className="flex-1">{item.label}</span>
      {count !== undefined && count > 0 && (
        <span
          className={cn(
            "flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11.5px] font-bold tabular-nums",
            compact && active ? "bg-white text-ink" : "bg-soon text-white",
          )}
        >
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
