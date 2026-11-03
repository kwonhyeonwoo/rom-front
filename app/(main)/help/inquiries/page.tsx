import type { Metadata } from "next";

import { MyInquiries } from "@/components/help/my-inquiries";
import { SiteHeader } from "@/components/layout/site-header";

export const metadata: Metadata = {
  title: "내 문의 내역 · 롬",
};

export default function MyInquiriesRoute() {
  return (
    <>
      <SiteHeader activeHref="" />
      <main>
        <MyInquiries />
      </main>
    </>
  );
}
