import { Suspense } from "react";
import type { Metadata } from "next";

import { SiteHeader } from "@/components/layout/site-header";
import { ReviewWritePage } from "@/components/review/review-write-page";
import { ReviewsSkeleton } from "@/components/review/reviews-page";

export const metadata: Metadata = {
  title: "후기 쓰기 · 롬",
};

export default function ReviewWriteRoute({ params }: PageProps<"/reviews/[seminarId]">) {
  return (
    <>
      <SiteHeader />
      <main>
        <Suspense fallback={<ReviewsSkeleton />}>
          {params.then(({ seminarId }) => (
            <ReviewWritePage seminarId={seminarId} />
          ))}
        </Suspense>
      </main>
    </>
  );
}
