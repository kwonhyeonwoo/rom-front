"use client";

import Link from "next/link";

import { useVerifyAccess } from "@/hooks/useVerifyAccess";
import { cn } from "@/lib/utils";
import { toast } from "@/stores/use-toast-store";

// 글쓰기 버튼. 승인 회원은 글쓰기로, 인증 전·반려는 인증 화면으로, 심사 중에는 눌러도 안내만 뜬다
export function WriteButton({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  const { access } = useVerifyAccess();

  if (access === "PENDING") {
    const hint = "면허 심사가 끝나면 글을 쓸 수 있어요";
    return (
      <span className={cn("group relative", className?.includes("w-full") ? "flex w-full" : "inline-flex")}>
        <button
          type="button"
          aria-disabled
          aria-describedby="write-pending-hint"
          onClick={() => toast(hint)}
          className={cn(className, "cursor-not-allowed bg-[#E4E4E2] text-[#9A9A9A] shadow-none")}
        >
          {children}
        </button>
        <span
          id="write-pending-hint"
          role="tooltip"
          className="pointer-events-none absolute top-full right-0 z-40 mt-2 hidden w-[230px] rounded-[10px] bg-ink px-3.5 py-2.5 text-left text-[12.5px] leading-[1.5] font-medium whitespace-normal text-white group-focus-within:block group-hover:block"
        >
          {hint}
        </span>
      </span>
    );
  }

  const target =
    access === "GUEST" ? "/login" : access === "NONE" || access === "REJECTED" ? "/verify" : href;
  return (
    <Link href={target} className={className}>
      {children}
    </Link>
  );
}
