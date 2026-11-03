import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";
import type { NoticePage } from "@/lib/support";

// 공지 목록 (rom-back GET /notices). 고정 공지가 맨 위, 나머지는 최신순
export function useNoticesQuery(page: number) {
  return useQuery({
    queryKey: ["notices", "list", page],
    queryFn: () => apiFetch<NoticePage>(`/notices?page=${page}`),
    placeholderData: keepPreviousData,
  });
}
