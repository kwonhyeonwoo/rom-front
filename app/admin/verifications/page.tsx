import type { Metadata } from "next";

import { AdminVerifications } from "@/components/admin/admin-verifications";

export const metadata: Metadata = {
  title: "면허 인증 심사 · 롬 관리자",
};

export default function AdminVerificationsRoute() {
  return <AdminVerifications />;
}
