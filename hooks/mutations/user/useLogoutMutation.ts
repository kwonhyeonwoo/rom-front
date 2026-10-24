import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export function useLogoutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { error } = await getSupabaseBrowserClient().auth.signOut();
      if (error) throw error;
    },
    onSuccess: () => queryClient.removeQueries({ queryKey: ["user"] }),
  });
}
