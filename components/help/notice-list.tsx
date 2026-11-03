"use client";

import { useState } from "react";
import Link from "next/link";
import { Pin } from "lucide-react";

import { useNoticesQuery } from "@/hooks/queries/support/useNoticesQuery";
import { formatDate, noticeCategoryLabel } from "@/lib/support";
import { cn } from "@/lib/utils";

// 운영자 공지 목록. 읽기 전용이고, 고정 공지가 맨 위에 온다
export function NoticeList() {
  const [page, setPage] = useState(1);
  const notices = useNoticesQuery(page);

  if (notices.isPending) {
    return (
      <div className="space-y-2" aria-busy>
        {Array.from({ length: 5 }, (_, index) => (
          <div key={index} className="skeleton h-[60px] rounded-[12px]" />
        ))}
      </div>
    );
  }
  if (notices.isError) {
    return (
      <p role="alert" className="py-16 text-center text-[15px] text-sub">
        공지를 불러오지 못했어요. 잠시 후 다시 시도해주세요.
      </p>
    );
  }

  const { items, totalPages } = notices.data;
  if (items.length === 0) {
    return <p className="py-16 text-center text-[15px] text-sub">아직 올라온 공지가 없어요</p>;
  }

  return (
    <>
      <ul className="divide-y divide-[#EFEFEF] border-y border-[#EFEFEF]">
        {items.map((item) => (
          <li key={item.id}>
            <Link
              href={`/help/notices/${item.id}`}
              className={cn("flex items-center gap-3 px-1 py-4 hover:bg-[#FAFAF9] md:px-3", item.pinned && "bg-[#FBFBFA]")}
            >
              <span
                className={cn(
                  "inline-flex h-6 shrink-0 items-center gap-1 rounded-md px-2 text-[12px] font-bold",
                  item.pinned ? "bg-[#FDECEA] text-soon" : "bg-surface text-[#555]",
                )}
              >
                {item.pinned && <Pin size={11} />}
                {item.pinned ? "중요" : noticeCategoryLabel(item.category)}
              </span>
              <span className={cn("min-w-0 flex-1 truncate text-[15px]", item.pinned ? "font-bold" : "font-semibold")}>
                {item.title}
              </span>
              <span className="shrink-0 text-[13px] text-faint tabular-nums">{formatDate(item.createdAt)}</span>
            </Link>
          </li>
        ))}
      </ul>
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-4 text-[14px] font-semibold">
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="text-sub disabled:opacity-40">
            이전
          </button>
          <span className="tabular-nums">
            {page} / {totalPages}
          </span>
          <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="text-sub disabled:opacity-40">
            다음
          </button>
        </div>
      )}
    </>
  );
}
