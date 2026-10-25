import type { Metadata } from "next";

import { ComingSoon } from "@/components/layout/coming-soon";

export const metadata: Metadata = {
  title: "강사 · 롬",
};

export default function InstructorsPage() {
  return <ComingSoon title="강사" description="강사별 세미나와 수강 후기를 모아 곧 보여드릴게요" />;
}
