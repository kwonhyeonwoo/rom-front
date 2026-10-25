import type { Metadata } from "next";

import { ComingSoon } from "@/components/layout/coming-soon";

export const metadata: Metadata = {
  title: "광고·제휴 문의 · 롬",
};

export default function ContactPage() {
  return <ComingSoon title="광고·제휴 문의" description="문의 페이지를 준비하는 동안 contact@rom.example 로 연락해주세요" />;
}
