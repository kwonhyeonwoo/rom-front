import { useInfiniteQuery } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";
import type { Board, PostPage } from "@/lib/community";

export type PostSort = "latest" | "popular";

const LIMIT = 20;

// 커뮤니티 글 목록 (rom-back GET /posts). 더 보기로 다음 페이지를 이어 붙인다
export function usePostsQuery({ board, sort, enabled }: { board: Board | null; sort: PostSort; enabled: boolean }) {
  return useInfiniteQuery({
    queryKey: ["community", "posts", board, sort],
    queryFn: ({ pageParam }) => {
      const params = new URLSearchParams({ sort, page: String(pageParam), limit: String(LIMIT) });
      if (board) params.set("board", board);
      return apiFetch<PostPage>(`/posts?${params}`);
    },
    initialPageParam: 1,
    getNextPageParam: (last) => (last.page * last.limit < last.total ? last.page + 1 : undefined),
    enabled,
  });
}
