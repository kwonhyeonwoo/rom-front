import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export function useLogoutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { error } = await getSupabaseBrowserClient().auth.signOut();
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["user"] });
      // 화면에 남은 저장 표시를 지우도록 다시 불러온다 (로그아웃 상태면 빈 목록)
      queryClient.resetQueries({ queryKey: ["bookmark"] });
    },
  });
}
