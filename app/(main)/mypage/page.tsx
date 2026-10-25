import type { Metadata } from "next";

import { SiteHeader } from "@/components/layout/site-header";
import { MyPage } from "@/components/mypage/my-page";

export const metadata: Metadata = {
  title: "마이페이지 · 롬",
};

export default function MyPageRoute() {
  return (
    <>
      <SiteHeader />
      <main>
        <MyPage />
      </main>
    </>
  );
}
