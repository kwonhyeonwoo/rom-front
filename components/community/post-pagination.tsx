import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

type Slot = number | "gap";

// 지금 페이지 앞뒤 radius개 + 처음·끝 페이지. 사이가 비면 "…"
function slots(page: number, total: number, radius: number): Slot[] {
  const start = Math.max(1, Math.min(page - radius, total - radius * 2));
  const end = Math.min(total, Math.max(page + radius, 1 + radius * 2));
  const list: Slot[] = [];
  if (start > 1) list.push(1);
  if (start > 2) list.push("gap");
  for (let n = start; n <= end; n += 1) list.push(n);
  if (end < total - 1) list.push("gap");
  if (end < total) list.push(total);
  return list;
}

const itemClass =
  "flex size-[34px] shrink-0 items-center justify-center rounded-full text-[14px] md:size-[38px] md:text-[14.5px]";

// 커뮤니티 글 목록 아래 번호 페이지 (이전·1 2 3 …·다음). 모바일은 번호를 줄여 한 줄에 맞춘다
export function PostPagination({
  page,
  totalPages,
  href,
}: {
  page: number;
  totalPages: number;
  href: (page: number) => string;
}) {
  if (totalPages <= 1) return null;

  const toTop = () => window.scrollTo({ top: 0 });

  const arrow = (target: number, label: string, icon: React.ReactNode) =>
    target < 1 || target > totalPages ? (
      <span aria-hidden className={cn(itemClass, "text-[#CFCFCF]")}>
        {icon}
      </span>
    ) : (
      <Link
        href={href(target)}
        onClick={toTop}
        aria-label={label}
        className={cn(itemClass, "text-[#666] hover:bg-surface")}
      >
        {icon}
      </Link>
    );

  const numbers = (radius: number) =>
    slots(page, totalPages, radius).map((slot, index) =>
      slot === "gap" ? (
        <span
          key={`gap-${index}`}
          aria-hidden
          className={cn(itemClass, "w-5 text-faint md:w-6")}
        >
          …
        </span>
      ) : (
        <Link
          key={slot}
          href={href(slot)}
          onClick={toTop}
          aria-current={slot === page ? "page" : undefined}
          className={cn(
            itemClass,
            slot === page
              ? "bg-ink font-bold text-white"
              : "text-[#666] hover:bg-surface",
          )}
        >
          {slot}
        </Link>
      ),
    );

  return (
    <nav
      aria-label="페이지"
      className="mt-8 flex items-center justify-center gap-1 md:mt-10 md:gap-1.5"
    >
      {arrow(page - 1, "이전 페이지", <ChevronLeft size={18} />)}
      <div className="flex items-center gap-0.5 md:hidden">{numbers(1)}</div>
      <div className="hidden items-center gap-1.5 md:flex">{numbers(2)}</div>
      {arrow(page + 1, "다음 페이지", <ChevronRight size={18} />)}
    </nav>
  );
}
