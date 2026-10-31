import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";

// 후기 삭제 (DELETE /reviews/:seminarId)
export function useDeleteReviewMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (seminarId: string) => apiFetch(`/reviews/${encodeURIComponent(seminarId)}`, { method: "DELETE" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bookmark"] }),
  });
}
