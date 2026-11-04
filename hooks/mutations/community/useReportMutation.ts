import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";
import type { PostDetail } from "@/lib/community";
import type { ReportReason, ReportTarget } from "@/lib/report";

// 글·댓글 신고 (POST /posts/:id/report, /comments/:id/report).
// 신고하면 캐시의 글 상세에서 그 글·댓글을 "신고함"으로 바꾼다 (다시 불러오면 조회수가 오르므로 새로 받지 않는다)
export function useReportMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      target,
      id,
      reason,
      detail,
    }: {
      target: ReportTarget;
      id: string;
      reason: ReportReason;
      detail?: string;
    }) =>
      apiFetch<{ reported: true }>(`/${target === "POST" ? "posts" : "comments"}/${encodeURIComponent(id)}/report`, {
        method: "POST",
        body: JSON.stringify({ reason, ...(detail ? { detail } : {}) }),
      }),
    onSuccess: (_data, { target, id }) =>
      queryClient.setQueriesData<PostDetail>({ queryKey: ["community", "post"] }, (post) => {
        if (!post) return post;
        if (target === "POST") return post.id === id ? { ...post, reported: true } : post;
        return {
          ...post,
          comments: post.comments.map((comment) => (comment.id === id ? { ...comment, reported: true } : comment)),
        };
      }),
  });
}
