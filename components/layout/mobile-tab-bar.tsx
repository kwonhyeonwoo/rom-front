"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Bookmark, House, Search, User } from "lucide-react";

import { cn } from "@/lib/utils";

const tabs = [
  { label: "홈", href: "/", icon: House },
  { label: "검색", href: "/search", icon: Search },
  { label: "저장", href: "/saved", icon: Bookmark },
  { label: "알림", href: "/alerts", icon: Bell },
  { label: "마이", href: "/me", icon: User },
];

export function MobileTabBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex justify-around border-t border-[#EEE] bg-white pt-2 pb-[max(24px,env(safe-area-inset-bottom))] md:hidden">
      {tabs.map(({ label, href, icon: Icon }) => {
        const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-col items-center gap-[3px] text-[10.5px] font-semibold",
              active ? "text-ink" : "text-[#B5B5B5]",
            )}
          >
            <Icon size={22} strokeWidth={active ? 2.2 : 1.8} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
