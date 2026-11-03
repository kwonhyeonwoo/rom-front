import { Suspense } from "react";
import type { Metadata } from "next";

import { NoticeDetail } from "@/components/help/notice-detail";
import { SiteHeader } from "@/components/layout/site-header";

export const metadata: Metadata = {
  title: "공지사항",
};

export default function NoticeRoute({ params }: PageProps<"/help/notices/[id]">) {
  return (
    <>
      <SiteHeader activeHref="" />
      <main>
        {/* 경로의 공지 id를 읽는 동안 나머지 화면이 막히지 않게 한다 */}
        <Suspense>{params.then(({ id }) => <NoticeDetail id={id} />)}</Suspense>
      </main>
    </>
  );
}
