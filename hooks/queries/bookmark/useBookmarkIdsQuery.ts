import { useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export const bookmarkIdsKey = ["bookmark", "ids"] as const;

// 내가 저장한 세미나 id (rom-back GET /bookmarks/ids). 로그아웃 상태면 빈 배열
export function useBookmarkIdsQuery() {
  return useQuery({
    queryKey: bookmarkIdsKey,
    queryFn: async (): Promise<string[]> => {
      const { data } = await getSupabaseBrowserClient().auth.getSession();
      return data.session ? apiFetch<string[]>("/bookmarks/ids") : [];
    },
  });
}
