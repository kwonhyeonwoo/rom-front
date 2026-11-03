import type { Metadata } from "next";

import { AdminNotices } from "@/components/admin/admin-notices";

export const metadata: Metadata = {
  title: "공지사항 관리 · 롬 관리자",
};

export default function AdminNoticesRoute() {
  return <AdminNotices />;
}
