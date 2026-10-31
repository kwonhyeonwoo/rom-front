import { useInfiniteQuery } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";
import type { Board, PostPage } from "@/lib/community";

export type PostSort = "latest" | "popular" | "comments";

const LIMIT = 20;

// 커뮤니티 글 목록 (rom-back GET /posts). 더 보기로 다음 페이지를 이어 붙인다
export function usePostsQuery({
  board,
  sort,
  q = "",
  mine = false,
  limit = LIMIT,
  viewer = "guest",
  enabled,
}: {
  board: Board | null;
  sort: PostSort;
  q?: string;
  mine?: boolean;
  limit?: number;
  // 로그인한 사용자 id (비회원은 "guest"). 내 글 표시가 달라서 키에 넣는다
  viewer?: string;
  enabled: boolean;
}) {
  return useInfiniteQuery({
    queryKey: ["community", "posts", board, sort, q, mine, limit, viewer],
    queryFn: ({ pageParam }) => {
      const params = new URLSearchParams({
        sort,
        page: String(pageParam),
        limit: String(limit),
      });
      if (board) params.set("board", board);
      if (q) params.set("q", q);
      if (mine) params.set("mine", "true");
      return apiFetch<PostPage>(`/posts?${params}`);
    },
    initialPageParam: 1,
    getNextPageParam: (last) =>
      last.page * last.limit < last.total ? last.page + 1 : undefined,
    enabled,
  });
}
