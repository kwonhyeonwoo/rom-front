import { useMutation, useQueryClient } from "@tanstack/react-query";

import { adminFetch } from "@/lib/admin-api";
import type { Notice, NoticeCategory } from "@/lib/support";

export type NoticeBody = { category: NoticeCategory; title: string; content: string; pinned: boolean; important: boolean };

// 공지 작성·수정 (rom-back POST /admin/notices, PUT /admin/notices/:id)
export function useSaveNoticeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, body }: { id: string | null; body: NoticeBody }) =>
      adminFetch<Notice>(id ? `/admin/notices/${id}` : "/admin/notices", {
        method: id ? "PUT" : "POST",
        body: JSON.stringify(body),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "notices"] });
      queryClient.invalidateQueries({ queryKey: ["notices"] });
    },
  });
}
