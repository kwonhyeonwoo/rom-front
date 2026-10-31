import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";

// 끝난 세미나를 들었는지 답한다 (PUT /bookmarks/:seminarId/attendance)
export function useAttendanceMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ seminarId, attended }: { seminarId: string; attended: boolean }) =>
      apiFetch(`/bookmarks/${encodeURIComponent(seminarId)}/attendance`, {
        method: "PUT",
        body: JSON.stringify({ attended }),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bookmark"] }),
  });
}
