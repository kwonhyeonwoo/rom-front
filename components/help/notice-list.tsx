"use client";

import { useState } from "react";
import Link from "next/link";
import { Pin } from "lucide-react";

import { useNoticesQuery } from "@/hooks/queries/support/useNoticesQuery";
import {
  formatDate,
  NOTICE_IMPORTANT_CHIP,
  noticeCategories,
  noticeCategoryChip,
  noticeCategoryLabel,
  noticeDisplayTitle,
  type NoticeCategory,
} from "@/lib/support";
import { cn } from "@/lib/utils";

const filters: { value: NoticeCategory | null; label: string }[] = [
  { value: null, label: "전체" },
  ...noticeCategories.map(({ value, label }) => ({ value, label })),
];

// 운영자 공지 목록. 읽기 전용이고, 고정 공지(핀)가 맨 위에 온다.
// 칩은 분류를 보여주고, "중요"는 운영자가 따로 켠 글에만 붙는다
export function NoticeList() {
  const [category, setCategory] = useState<NoticeCategory | null>(null);
  const [page, setPage] = useState(1);
  const notices = useNoticesQuery(page, category);

  function pick(next: NoticeCategory | null) {
    setCategory(next);
    setPage(1);
  }

  return (
    <>
      <div role="tablist" aria-label="공지 분류" className="-mx-5 mb-4 flex gap-1.5 overflow-x-auto px-5 md:mx-0 md:px-0">
        {filters.map(({ value, label }) => (
          <button
            key={label}
            role="tab"
            aria-selected={category === value}
            onClick={() => pick(value)}
            className={cn(
              "h-9 shrink-0 rounded-full border px-4 text-[13.5px] font-bold transition-colors",
              category === value ? "border-ink bg-ink text-white" : "border-[#E4E4E4] text-[#444] hover:border-[#C9C9C9]",
            )}
          >
            {label}
          </button>
        ))}
      </div>
      <NoticeRows notices={notices} category={category} page={page} setPage={setPage} />
    </>
  );
}

function NoticeRows({
  notices,
  category,
  page,
  setPage,
}: {
  notices: ReturnType<typeof useNoticesQuery>;
  category: NoticeCategory | null;
  page: number;
  setPage: (update: (page: number) => number) => void;
}) {
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
    return (
      <p className="py-16 text-center text-[15px] text-sub">
        {category ? `아직 올라온 ${noticeCategoryLabel(category)} 공지가 없어요` : "아직 올라온 공지가 없어요"}
      </p>
    );
  }

  return (
    <>
      <ul className="divide-y divide-[#EFEFEF] border-y border-[#EFEFEF]">
        {items.map((item) => (
          <li key={item.id}>
            <Link
              href={`/help/notices/${item.id}`}
              className={cn(
                "flex items-center gap-2 px-1 py-4 hover:bg-[#FAFAF9] md:gap-2.5 md:px-3",
                item.pinned && "bg-[#FBFBFA]",
                notices.isPlaceholderData && "opacity-60",
              )}
            >
              {item.pinned && <Pin size={14} className="shrink-0 rotate-45 text-ink" aria-label="고정 공지" />}
              <span
                className={cn(
                  "inline-flex h-6 shrink-0 items-center rounded-md px-2 text-[12px] font-bold",
                  noticeCategoryChip(item.category),
                )}
              >
                {noticeCategoryLabel(item.category)}
              </span>
              {item.important && (
                <span className={cn("inline-flex h-6 shrink-0 items-center rounded-md px-2 text-[12px] font-bold", NOTICE_IMPORTANT_CHIP)}>
                  중요
                </span>
              )}
              <span
                className={cn(
                  "ml-0.5 min-w-0 flex-1 truncate text-[15px]",
                  item.pinned || item.important ? "font-bold" : "font-semibold",
                )}
              >
                {noticeDisplayTitle(item.title, item.category)}
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
