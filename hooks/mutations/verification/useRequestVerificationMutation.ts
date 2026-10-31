import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { LICENSE_BUCKET, type Verification } from "@/lib/verification";

export type VerificationRequest = {
  name: string;
  licenseNumber: string;
  acquiredYear: number;
  field: string;
  photo: File;
};

// 면허 인증 요청: 업로드 토큰을 받아 사진을 비공개 버킷에 올린 뒤 면허 정보와 함께 제출한다
// (POST /verification/upload-url → Storage 업로드 → POST /verification)
export function useRequestVerificationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ photo, ...info }: VerificationRequest) => {
      const { path, token } = await apiFetch<{ path: string; token: string }>("/verification/upload-url", {
        method: "POST",
        body: JSON.stringify({ contentType: photo.type }),
      });
      const { error } = await getSupabaseBrowserClient()
        .storage.from(LICENSE_BUCKET)
        .uploadToSignedUrl(path, token, photo, { contentType: photo.type });
      if (error) throw new Error("사진을 올리지 못했어요. 잠시 후 다시 시도해주세요");
      return apiFetch<Verification>("/verification", {
        method: "POST",
        body: JSON.stringify({ ...info, imagePath: path }),
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["verification"] }),
  });
}
