import type { Metadata } from "next";

import { AdminShell } from "@/components/admin/admin-shell";

export const metadata: Metadata = {
  title: { default: "롬 관리자", template: "%s · 롬 관리자" },
  robots: { index: false, follow: false },
};

// 관리자 화면은 일반 헤더·푸터·하단 탭바 없이 전용 헤더와 사이드바만 쓴다
export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return <AdminShell>{children}</AdminShell>;
}
