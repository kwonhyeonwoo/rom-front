import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";

// 내 댓글 삭제 (DELETE /comments/:id)
export function useDeleteCommentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => apiFetch(`/comments/${encodeURIComponent(commentId)}`, { method: "DELETE" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["community"] }),
  });
}
