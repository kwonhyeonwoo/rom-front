import type { Metadata } from "next";

import { AdminInquiries } from "@/components/admin/admin-inquiries";

export const metadata: Metadata = {
  title: "1:1 문의 · 롬 관리자",
};

export default function AdminInquiriesRoute() {
  return <AdminInquiries />;
}
