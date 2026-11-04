import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";
import type { NoticeCategory, NoticePage } from "@/lib/support";

// 공지 목록 (rom-back GET /notices). 고정 공지가 맨 위, 나머지는 최신순. category가 없으면 전체
export function useNoticesQuery(page: number, category: NoticeCategory | null = null) {
  return useQuery({
    queryKey: ["notices", "list", category ?? "ALL", page],
    queryFn: () => {
      const params = new URLSearchParams({ page: String(page) });
      if (category) params.set("category", category);
      return apiFetch<NoticePage>(`/notices?${params}`);
    },
    placeholderData: keepPreviousData,
  });
}
