import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";

// 댓글 쓰기 (POST /posts/:id/comments)
export function useAddCommentMutation(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: { content: string; anonymous: boolean }) =>
      apiFetch(`/posts/${encodeURIComponent(postId)}/comments`, { method: "POST", body: JSON.stringify(body) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["community"] }),
  });
}
