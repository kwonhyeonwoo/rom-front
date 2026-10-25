import type { Metadata } from "next";

import { ComingSoon } from "@/components/layout/coming-soon";

export const metadata: Metadata = {
  title: "알림 조건 만들기 · 롬",
};

export default function NewAlertPage() {
  return <ComingSoon title="알림 조건 만들기" description="원하는 조건을 저장하면 새 세미나가 올라올 때 알려드릴게요" />;
}
