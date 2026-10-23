"use client";

import { useRouter } from "next/navigation";

import { toQueryString, type SearchFilters } from "@/lib/search";

// 필터를 바꾸면 1페이지부터 다시 보여준다
export function useFilterNavigation(filters: SearchFilters) {
  const router = useRouter();
  return (patch: Partial<SearchFilters>) =>
    router.push(`/search${toQueryString({ ...filters, page: 1, ...patch })}`, { scroll: false });
}
