import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { adminFetch } from "@/lib/admin-api";
import type { NoticePage } from "@/lib/support";

// 관리자 공지 목록 (rom-back GET /admin/notices)
export function useAdminNoticesQuery(page: number) {
  return useQuery({
    queryKey: ["admin", "notices", page],
    queryFn: () => adminFetch<NoticePage>(`/admin/notices?page=${page}`),
    placeholderData: keepPreviousData,
    retry: (count, error) => !("status" in error && error.status === 401) && count < 1,
  });
}
