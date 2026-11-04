import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";
import type { Board } from "@/lib/community";

type Variables = {
  board: Board;
  title: string;
  content: string;
  anonymous: boolean;
  seminarId?: string;
  // 예약 게시 시각 (ISO). 운영 계정만
  publishAt?: string;
};

// eventEntry: 첫 글 이벤트 참여로 표시됐다. publishAt: 예약 게시면 그 시각
type Result = { id: string; eventEntry: boolean; publishAt: string | null };

// 글쓰기 (POST /posts)
export function useCreatePostMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: Variables) => apiFetch<Result>("/posts", { method: "POST", body: JSON.stringify(body) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["community", "posts"] }),
  });
}
