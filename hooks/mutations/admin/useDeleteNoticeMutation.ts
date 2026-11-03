import { useMutation, useQueryClient } from "@tanstack/react-query";

import { adminFetch } from "@/lib/admin-api";

// 공지 삭제 (rom-back DELETE /admin/notices/:id)
export function useDeleteNoticeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminFetch<{ ok: true }>(`/admin/notices/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "notices"] });
      queryClient.invalidateQueries({ queryKey: ["notices"] });
    },
  });
}
