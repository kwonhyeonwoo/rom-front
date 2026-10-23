import Link from "next/link";

import { toQueryString, type SearchFilters } from "@/lib/search";
import { cn } from "@/lib/utils";

export function Pagination({ filters, page, totalPages }: { filters: SearchFilters; page: number; totalPages: number }) {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="페이지" className="flex justify-center gap-1.5 pt-[50px]">
      {Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => (
        <Link
          key={number}
          href={`/search${toQueryString({ ...filters, page: number })}`}
          aria-current={number === page ? "page" : undefined}
          className={cn(
            "flex size-[38px] items-center justify-center rounded-full text-[14.5px]",
            number === page ? "bg-ink font-bold text-white" : "text-[#666] hover:bg-surface",
          )}
        >
          {number}
        </Link>
      ))}
    </nav>
  );
}
