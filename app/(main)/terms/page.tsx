import type { Metadata } from "next";

import { ComingSoon } from "@/components/layout/coming-soon";

export const metadata: Metadata = {
  title: "이용약관 · 롬",
};

export default function TermsPage() {
  return <ComingSoon title="이용약관" description="서비스 정식 오픈에 맞춰 이용약관을 안내해드릴게요" />;
}
