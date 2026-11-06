import type { Metadata } from "next";

import { SiteHeader } from "@/components/layout/site-header";
import { ReviewsPage } from "@/components/review/reviews-page";

export const metadata: Metadata = {
  title: "수강 후기",
  description:
    "실제로 들은 물리치료사가 남긴 세미나·보수교육 수강 후기를 강사와 분야별로 확인하세요.",
};

export default function ReviewsRoute() {
  return (
    <>
      <SiteHeader activeHref="/search" />
      <main>
        <ReviewsPage />
      </main>
    </>
  );
}
