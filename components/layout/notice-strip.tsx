"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Megaphone, X } from "lucide-react";

import { useNoticeBannerQuery } from "@/hooks/queries/support/useNoticeBannerQuery";

const DISMISSED_KEY = "rom-dismissed-notice";

function readDismissed() {
  try {
    return localStorage.getItem(DISMISSED_KEY);
  } catch {
    return null;
  }
}

// 모든 일반 페이지 상단 띠 배너: 가장 최근 고정 공지. 닫으면 그 공지는 이 브라우저에서 다시 띄우지 않는다
export function NoticeStrip() {
  const banner = useNoticeBannerQuery();
  const [dismissed, setDismissed] = useState<string | null>(() => (typeof window === "undefined" ? null : readDismissed()));
  const notice = banner.data;

  if (!notice || dismissed === notice.id) return null;

  function close() {
    if (!notice) return;
    try {
      localStorage.setItem(DISMISSED_KEY, notice.id);
    } catch {
      // 저장하지 못해도 이번 화면에서는 닫는다
    }
    setDismissed(notice.id);
  }

  return (
    <div className="border-b border-[#EFEFEF] bg-[#FAFAF9]">
      <div className="mx-auto flex h-10 max-w-[1240px] items-center gap-2 px-5 text-[13px] md:h-11 md:text-[13.5px]">
        <Megaphone size={15} className="shrink-0 text-brand" />
        <Link href={`/help/notices/${notice.id}`} className="flex min-w-0 flex-1 items-center gap-1 font-semibold hover:underline">
          <span className="truncate">{notice.title}</span>
          <ChevronRight size={14} className="shrink-0 text-faint" />
        </Link>
        <button onClick={close} aria-label="공지 닫기" className="-mr-1.5 shrink-0 rounded p-1.5 text-faint hover:text-ink">
          <X size={15} />
        </button>
      </div>
    </div>
  );
}
