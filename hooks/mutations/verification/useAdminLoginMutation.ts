import { useMutation, useQueryClient } from "@tanstack/react-query";

import { adminFetch } from "@/lib/admin-api";
import { setAdminToken } from "@/lib/admin-session";

// 관리자 로그인 (rom-back POST /admin/login). 성공하면 토큰을 저장하고 관리자 데이터를 새로 받는다
export function useAdminLoginMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: { id: string; password: string }) =>
      adminFetch<{ token: string; expiresInSeconds: number }>("/admin/login", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    onSuccess: ({ token }) => {
      setAdminToken(token);
      queryClient.invalidateQueries({ queryKey: ["admin-verifications"] });
    },
  });
}
