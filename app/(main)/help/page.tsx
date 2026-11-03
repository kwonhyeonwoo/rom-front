import { Suspense } from "react";
import type { Metadata } from "next";

import { HelpPage } from "@/components/help/help-page";
import { SiteHeader } from "@/components/layout/site-header";

export const metadata: Metadata = {
  title: "고객센터 · 롬",
};

export default function HelpRoute() {
  return (
    <>
      <SiteHeader activeHref="" />
      <main>
        {/* 탭을 주소에서 읽는 동안 나머지 화면이 막히지 않게 한다 */}
        <Suspense>
          <HelpPage />
        </Suspense>
      </main>
    </>
  );
}
