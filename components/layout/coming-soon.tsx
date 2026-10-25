import Link from "next/link";
import { Hammer } from "lucide-react";

import { Container } from "./container";
import { SiteHeader } from "./site-header";

// 아직 개발되지 않은 페이지에 보여줄 "준비 중" 안내
export function ComingSoon({ title, description }: { title: string; description?: string }) {
  return (
    <>
      <SiteHeader />
      <main>
        <Container className="flex justify-center py-20 md:py-28">
          <div className="w-full max-w-[380px] text-center">
            <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-surface">
              <Hammer size={22} strokeWidth={2} />
            </span>
            <p className="mt-6 text-[13px] font-bold tracking-[.08em] text-brand">준비 중</p>
            <h1 className="mt-1.5 text-2xl font-extrabold tracking-[-0.04em]">{title} 페이지를 준비하고 있어요</h1>
            <p className="mt-2 text-[15px] leading-[1.55] text-sub">
              {description ?? "더 좋은 모습으로 곧 찾아올게요"}
            </p>
            <div className="mt-8 flex flex-col gap-2">
              <Link href="/" className="flex h-12 items-center justify-center rounded-full bg-ink text-[15px] font-bold text-white">
                홈으로 가기
              </Link>
              <Link
                href="/search"
                className="flex h-12 items-center justify-center rounded-full border border-[#E4E4E4] text-[15px] font-bold text-ink"
              >
                세미나 둘러보기
              </Link>
            </div>
          </div>
        </Container>
      </main>
    </>
  );
}
