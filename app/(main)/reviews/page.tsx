import type { Metadata } from "next";

import { ComingSoon } from "@/components/layout/coming-soon";

export const metadata: Metadata = {
  title: "수강 후기 · 롬",
};

export default function ReviewsPage() {
  return <ComingSoon title="수강 후기" description="들었던 세미나의 후기를 남기고 모아볼 수 있게 준비하고 있어요" />;
}
