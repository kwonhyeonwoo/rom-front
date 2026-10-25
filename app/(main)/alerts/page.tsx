import type { Metadata } from "next";

import { ComingSoon } from "@/components/layout/coming-soon";

export const metadata: Metadata = {
  title: "알림 조건 · 롬",
};

export default function AlertsPage() {
  return <ComingSoon title="알림 조건" description="원하는 조건을 저장하면 새 세미나가 올라올 때 알려드릴게요" />;
}
