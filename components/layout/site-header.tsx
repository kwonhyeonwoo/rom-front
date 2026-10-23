import Link from "next/link";
import { Bell } from "lucide-react";

import { cn } from "@/lib/utils";
import { Container } from "./container";
import { Logo } from "./logo";

const navItems = [
  { label: "세미나", href: "/" },
  { label: "보수교육", href: "/search?credit=1" },
  { label: "마감 임박", href: "/search?sort=deadline" },
  { label: "강사", href: "/instructors" },
];

const pillButton = "inline-flex h-10 items-center justify-center rounded-full px-[18px] text-sm font-semibold whitespace-nowrap";

export function SiteHeader({
  searchSlot,
  hideOnMobile = false,
}: {
  // PC 헤더 오른쪽에 넣을 검색창 (검색 결과 페이지에서 사용)
  searchSlot?: React.ReactNode;
  hideOnMobile?: boolean;
}) {
  return (
    <header className="bg-white md:border-b md:border-[#EFEFEF]">
      <Container className="hidden h-[72px] items-center justify-between md:flex">
        <div className="flex items-center gap-11">
          <Logo />
          <nav className="flex items-center gap-7 text-[15.5px] font-semibold">
            {navItems.map((item, index) => (
              <Link
                key={item.label}
                href={item.href}
                className={cn(index === 0 ? "text-ink" : "text-[#7A7A7A] hover:text-ink")}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2.5">
          {searchSlot && <div className="mr-2.5">{searchSlot}</div>}
          <button type="button" aria-label="알림" className="mr-1.5 text-[#555] hover:text-ink">
            <Bell size={21} strokeWidth={1.7} />
          </button>
          <Link href="/login" className={cn(pillButton, "px-2.5 text-[14.5px] text-ink")}>
            로그인
          </Link>
          <Link href="/signup" className={cn(pillButton, "bg-ink text-white")}>
            회원가입
          </Link>
        </div>
      </Container>

      {!hideOnMobile && (
        <div className="flex h-14 items-center justify-between px-5 md:hidden">
          <Logo className="text-[26px]" />
          <div className="flex items-center gap-1.5">
            <Link href="/login" className={cn(pillButton, "h-[34px] px-2.5 text-ink")}>
              로그인
            </Link>
            <Link href="/signup" className={cn(pillButton, "h-[34px] bg-ink px-3.5 text-[13.5px] text-white")}>
              회원가입
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
