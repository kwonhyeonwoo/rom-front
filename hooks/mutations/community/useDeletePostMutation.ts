import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";

// 내 글 삭제 (DELETE /posts/:id). 수강 후기로 쓴 글이면 후기도 함께 지워진다
export function useDeletePostMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiFetch(`/posts/${encodeURIComponent(id)}`, { method: "DELETE" }),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["community", "posts"] }),
        queryClient.invalidateQueries({ queryKey: ["community", "summary"] }),
        queryClient.invalidateQueries({ queryKey: ["bookmark"] }),
      ]),
  });
}
