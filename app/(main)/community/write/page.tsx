import { Suspense } from "react";
import type { Metadata } from "next";

import { CommunitySkeleton } from "@/components/community/login-required";
import { PostForm } from "@/components/community/post-form";
import { SiteHeader } from "@/components/layout/site-header";

export const metadata: Metadata = {
  title: "글쓰기 · 롬",
};

export default function WritePostRoute() {
  return (
    <>
      <SiteHeader activeHref="/community" />
      <main>
        <Suspense fallback={<CommunitySkeleton />}>
          <PostForm />
        </Suspense>
      </main>
    </>
  );
}
