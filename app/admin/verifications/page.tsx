import type { Metadata } from "next";

import { AdminVerifications } from "@/components/admin/admin-verifications";

export const metadata: Metadata = {
  title: "면허 인증 심사",
};

export default function AdminVerificationsRoute() {
  return <AdminVerifications />;
}
