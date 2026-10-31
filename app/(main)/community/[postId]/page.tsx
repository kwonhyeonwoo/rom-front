import { Suspense } from "react";
import type { Metadata } from "next";

import { CommunitySkeleton } from "@/components/community/login-required";
import { PostDetail } from "@/components/community/post-detail";
import { SiteHeader } from "@/components/layout/site-header";

export const metadata: Metadata = {
  title: "커뮤니티 · 롬",
};

export default function PostRoute({ params }: PageProps<"/community/[postId]">) {
  return (
    <>
      <SiteHeader activeHref="/community" />
      <main>
        <Suspense fallback={<CommunitySkeleton />}>
          {params.then(({ postId }) => (
            <PostDetail postId={postId} />
          ))}
        </Suspense>
      </main>
    </>
  );
}
