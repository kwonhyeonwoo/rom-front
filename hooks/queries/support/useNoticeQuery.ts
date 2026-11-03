import { useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";
import type { Notice } from "@/lib/support";

// 공지 본문 (rom-back GET /notices/:id)
export function useNoticeQuery(id: string) {
  return useQuery({
    queryKey: ["notices", "detail", id],
    queryFn: () => apiFetch<Notice>(`/notices/${id}`),
  });
}
