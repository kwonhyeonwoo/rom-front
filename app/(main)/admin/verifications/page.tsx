import type { Metadata } from "next";

import { AdminVerifications } from "@/components/admin/admin-verifications";
import { SiteHeader } from "@/components/layout/site-header";

export const metadata: Metadata = {
  title: "면허 인증 심사 · 롬",
  robots: { index: false, follow: false },
};

export default function AdminVerificationsRoute() {
  return (
    <>
      <SiteHeader activeHref="" />
      <main>
        <AdminVerifications />
      </main>
    </>
  );
}
