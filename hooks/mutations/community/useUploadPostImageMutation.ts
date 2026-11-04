import { useMutation } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";
import { POST_IMAGE_BUCKET } from "@/lib/community";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type Result = { path: string; url: string };

// 글 사진 올리기: 업로드 토큰을 받아 공개 버킷에 바로 올린다
// (POST /posts/images/upload-url → Storage 업로드). 받은 path는 글 등록 때 images로 보낸다
export function useUploadPostImageMutation() {
  return useMutation({
    mutationFn: async (file: File): Promise<Result> => {
      const { path, token, url } = await apiFetch<Result & { token: string }>("/posts/images/upload-url", {
        method: "POST",
        body: JSON.stringify({ contentType: file.type }),
      });
      const { error } = await getSupabaseBrowserClient()
        .storage.from(POST_IMAGE_BUCKET)
        .uploadToSignedUrl(path, token, file, { contentType: file.type });
      if (error) throw new Error("사진을 올리지 못했어요. 잠시 후 다시 시도해주세요");
      return { path, url };
    },
  });
}
