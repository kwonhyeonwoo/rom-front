import { useQuery } from "@tanstack/react-query";

import { adminFetch } from "@/lib/admin-api";
import type { Notice } from "@/lib/support";

// 고칠 공지 본문 (rom-back GET /admin/notices/:id). id가 없으면(새 공지) 요청하지 않는다
export function useAdminNoticeQuery(id: string | null) {
  return useQuery({
    queryKey: ["admin", "notices", "detail", id],
    queryFn: () => adminFetch<Notice>(`/admin/notices/${id}`),
    enabled: id !== null,
  });
}
