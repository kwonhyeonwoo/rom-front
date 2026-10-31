import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";
import type { Board } from "@/lib/community";

type Variables = { board: Board; title: string; content: string; anonymous: boolean; seminarId?: string };

// 글쓰기 (POST /posts)
export function useCreatePostMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: Variables) => apiFetch<{ id: string }>("/posts", { method: "POST", body: JSON.stringify(body) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["community", "posts"] }),
  });
}
