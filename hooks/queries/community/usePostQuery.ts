import { useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";
import type { PostDetail } from "@/lib/community";

export const postKey = (id: string) => ["community", "post", id] as const;

// 글 상세와 댓글 (rom-back GET /posts/:id). 열 때마다 조회수가 오른다
export function usePostQuery(id: string, enabled: boolean) {
  return useQuery({
    queryKey: postKey(id),
    queryFn: () => apiFetch<PostDetail>(`/posts/${encodeURIComponent(id)}`),
    enabled,
  });
}
