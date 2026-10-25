import type { Metadata } from "next";

import { ComingSoon } from "@/components/layout/coming-soon";

export const metadata: Metadata = {
  title: "개인정보처리방침 · 롬",
};

export default function PrivacyPage() {
  return <ComingSoon title="개인정보처리방침" description="서비스 정식 오픈에 맞춰 개인정보처리방침을 안내해드릴게요" />;
}
