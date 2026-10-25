import { useMutation, useQueryClient } from "@tanstack/react-query";

import { bookmarkIdsKey } from "@/hooks/queries/bookmark/useBookmarkIdsQuery";
import { apiFetch } from "@/lib/api";

type Variables = { seminarId: string; save: boolean };

// 북마크 저장(PUT)·취소(DELETE). 버튼은 응답 전에 먼저 바꿔두고 실패하면 되돌린다
export function useToggleBookmarkMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ seminarId, save }: Variables) =>
      apiFetch(`/bookmarks/${encodeURIComponent(seminarId)}`, { method: save ? "PUT" : "DELETE" }),
    onMutate: async ({ seminarId, save }) => {
      await queryClient.cancelQueries({ queryKey: bookmarkIdsKey });
      const previous = queryClient.getQueryData<string[]>(bookmarkIdsKey);
      queryClient.setQueryData<string[]>(bookmarkIdsKey, (ids = []) =>
        save ? [...ids.filter((id) => id !== seminarId), seminarId] : ids.filter((id) => id !== seminarId),
      );
      return { previous };
    },
    onError: (_error, _variables, context) => queryClient.setQueryData(bookmarkIdsKey, context?.previous),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["bookmark"] }),
  });
}
