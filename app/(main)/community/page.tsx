import { Suspense } from "react";
import type { Metadata } from "next";

import { CommunityPage } from "@/components/community/community-page";
import { CommunitySkeleton } from "@/components/community/login-required";
import { SiteHeader } from "@/components/layout/site-header";

export const metadata: Metadata = {
  title: "물리치료사 커뮤니티",
  description:
    "면허 인증을 마친 물리치료사끼리 세미나 정보, 임상 고민, 커리어 이야기를 나누는 커뮤니티예요.",
  alternates: { canonical: "/community" },
};

export default function CommunityRoute() {
  return (
    <>
      <SiteHeader activeHref="/community" />
      <main>
        {/* 게시판·정렬을 주소에서 읽는 동안 나머지 화면이 막히지 않게 한다 */}
        <Suspense fallback={<CommunitySkeleton />}>
          <CommunityPage />
        </Suspense>
      </main>
    </>
  );
}
