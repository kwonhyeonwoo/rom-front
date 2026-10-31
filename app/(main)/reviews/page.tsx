import type { Metadata } from "next";

import { SiteHeader } from "@/components/layout/site-header";
import { ReviewsPage } from "@/components/review/reviews-page";

export const metadata: Metadata = {
  title: "수강 후기 · 롬",
};

export default function ReviewsRoute() {
  return (
    <>
      <SiteHeader />
      <main>
        <ReviewsPage />
      </main>
    </>
  );
}
