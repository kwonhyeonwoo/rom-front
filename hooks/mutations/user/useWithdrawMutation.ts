import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

// 회원 탈퇴 (rom-back DELETE /account). 서버가 계정과 개인정보를 바로 지운다
export function useWithdrawMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await apiFetch<void>("/account", { method: "DELETE" });
      // 서버 쪽 세션은 계정과 함께 이미 지워졌으므로 브라우저에 남은 토큰만 지운다
      await getSupabaseBrowserClient().auth.signOut({ scope: "local" });
    },
    onSuccess: () => {
      // 탈퇴한 사람의 데이터가 화면에 남지 않게 캐시를 비운다
      queryClient.clear();
    },
  });
}
