import { Suspense } from "react";
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
        {/* 알림에서 넘어온 문의 id를 주소에서 읽는 동안 나머지 화면이 막히지 않게 한다 */}
        <Suspense>
          <MyInquiries />
        </Suspense>
      </main>
    </>
  );
}
