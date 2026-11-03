import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";

// 후기 삭제 (DELETE /reviews/:seminarId). 커뮤니티 글도 함께 지워진다
export function useDeleteReviewMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (seminarId: string) => apiFetch(`/reviews/${encodeURIComponent(seminarId)}`, { method: "DELETE" }),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["bookmark"] }),
        queryClient.invalidateQueries({ queryKey: ["community"] }),
      ]),
  });
}
