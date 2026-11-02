import { useQuery } from "@tanstack/react-query";

import type { AdminVerificationDetail } from "@/lib/admin-verification";
import { adminFetch } from "@/lib/admin-api";

// 면허 인증 요청 상세 (rom-back GET /admin/verifications/:id).
// 사진 주소가 5분만 유효해서 캐시를 오래 두지 않고, 열어 둔 동안 4분마다 새 주소를 받는다
export function useAdminVerificationQuery(id: string | null) {
  return useQuery({
    queryKey: ["admin-verifications", "detail", id],
    queryFn: () => adminFetch<AdminVerificationDetail>(`/admin/verifications/${id}`),
    enabled: id !== null,
    staleTime: 0,
    gcTime: 4 * 60 * 1000,
    refetchInterval: 4 * 60 * 1000,
  });
}
