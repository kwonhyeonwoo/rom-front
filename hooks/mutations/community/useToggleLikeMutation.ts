import { useMutation, useQueryClient } from "@tanstack/react-query";

import { postKey } from "@/hooks/queries/community/usePostQuery";
import { apiFetch } from "@/lib/api";
import type { PostDetail } from "@/lib/community";

// 공감·공감 취소 (PUT·DELETE /posts/:id/like). 버튼은 먼저 바꿔두고 실패하면 되돌린다
export function useToggleLikeMutation(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (like: boolean) => apiFetch(`/posts/${encodeURIComponent(postId)}/like`, { method: like ? "PUT" : "DELETE" }),
    onMutate: async (like) => {
      await queryClient.cancelQueries({ queryKey: postKey(postId) });
      const previous = queryClient.getQueryData<PostDetail>(postKey(postId));
      queryClient.setQueryData<PostDetail>(postKey(postId), (post) =>
        post && post.liked !== like ? { ...post, liked: like, likeCount: post.likeCount + (like ? 1 : -1) } : post,
      );
      return { previous };
    },
    onError: (_error, _like, context) => queryClient.setQueryData(postKey(postId), context?.previous),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["community"] }),
  });
}
