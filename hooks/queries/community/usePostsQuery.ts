import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";
import type { Board, PostPage } from "@/lib/community";

export type PostSort = "latest" | "popular" | "comments";

export const POSTS_LIMIT = 20;

// 커뮤니티 글 목록 (rom-back GET /posts). 페이지 번호로 한 페이지씩 받는다
export function usePostsQuery({
  board,
  sort,
  q = "",
  mine = false,
  page = 1,
  limit = POSTS_LIMIT,
  viewer = "guest",
  enabled,
}: {
  board: Board | null;
  sort: PostSort;
  q?: string;
  mine?: boolean;
  page?: number;
  limit?: number;
  // 로그인한 사용자 id (비회원은 "guest"). 내 글 표시가 달라서 키에 넣는다
  viewer?: string;
  enabled: boolean;
}) {
  return useQuery({
    queryKey: ["community", "posts", board, sort, q, mine, page, limit, viewer],
    queryFn: () => {
      const params = new URLSearchParams({
        sort,
        page: String(page),
        limit: String(limit),
      });
      if (board) params.set("board", board);
      if (q) params.set("q", q);
      if (mine) params.set("mine", "true");
      return apiFetch<PostPage>(`/posts?${params}`);
    },
    // 페이지를 넘길 때 다음 페이지가 올 때까지 지금 목록을 그대로 둔다
    placeholderData: keepPreviousData,
    enabled,
  });
}
