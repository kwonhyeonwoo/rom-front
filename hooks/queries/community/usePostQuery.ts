import { useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";
import type { PostDetail } from "@/lib/community";

// viewer(로그인한 사용자 id, 비회원은 "guest")가 바뀌면 댓글 공개 여부가 달라지므로 키에 넣어 다시 가져온다
export const postKey = (id: string, viewer: string) => ["community", "post", id, viewer] as const;

// 글 상세와 댓글 (rom-back GET /posts/:id). 열 때마다 조회수가 오른다.
// 면허 인증을 마친 회원이 아니면 댓글은 비어 있고 commentsLocked가 true다
export function usePostQuery(id: string, viewer: string, enabled: boolean) {
  return useQuery({
    queryKey: postKey(id, viewer),
    queryFn: () => apiFetch<PostDetail>(`/posts/${encodeURIComponent(id)}`),
    enabled,
  });
}
