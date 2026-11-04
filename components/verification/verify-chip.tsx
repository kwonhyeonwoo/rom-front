"use client";

import Link from "next/link";
import { ShieldCheck } from "lucide-react";

import { verifyLabel, type VerifyAccess } from "@/lib/verification";
import { cn } from "@/lib/utils";

const tone = {
  NONE: "bg-[#F0F0EE] text-sub",
  PENDING: "bg-[#FFF3DC] text-[#A86400]",
  REJECTED: "bg-[#FDECEA] text-soon",
  APPROVED: "bg-[#E6F2EF] text-brand",
} as const;

// 헤더의 인증 상태 칩. 승인 전에는 누르면 인증 화면으로 간다. 운영 계정은 "운영팀"
export function VerifyChip({
  access,
  operator = false,
  className,
}: {
  access: VerifyAccess;
  operator?: boolean;
  className?: string;
}) {
  if (access === "GUEST" || access === "LOADING") return null;
  if (operator)
    return (
      <span
        className={cn(
          "inline-flex h-[26px] items-center gap-1 rounded-full bg-ink px-2.5 text-xs font-bold whitespace-nowrap text-white",
          className,
        )}
      >
        <ShieldCheck size={14} strokeWidth={2.2} />
        운영팀
      </span>
    );
  const base = cn(
    "inline-flex h-[26px] items-center gap-1 rounded-full px-2.5 text-xs font-bold whitespace-nowrap",
    tone[access],
    className,
  );
  const content = (
    <>
      {access === "APPROVED" && <ShieldCheck size={14} strokeWidth={2.2} />}
      {verifyLabel[access]}
    </>
  );
  return access === "APPROVED" || access === "PENDING" ? (
    <span className={base}>{content}</span>
  ) : (
    <Link href="/verify" className={base}>
      {content}
    </Link>
  );
}
