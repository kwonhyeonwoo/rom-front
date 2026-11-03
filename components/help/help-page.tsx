"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronRight, Headset } from "lucide-react";

import { Container } from "@/components/layout/container";
import { useSession } from "@/hooks/useSession";
import { cn } from "@/lib/utils";
import { FaqList } from "./faq-list";
import { InquiryForm } from "./inquiry-form";
import { NoticeList } from "./notice-list";

const tabs = [
  { value: "notice", label: "공지사항" },
  { value: "faq", label: "자주 묻는 질문" },
  { value: "inquiry", label: "1:1 문의" },
] as const;

type Tab = (typeof tabs)[number]["value"];

// 고객센터. 탭은 주소(?tab=notice|faq|inquiry)에 담아 푸터·마이페이지에서 바로 열 수 있게 한다
export function HelpPage() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const session = useSession();
  const tab: Tab = tabs.find((t) => t.value === params.get("tab"))?.value ?? "notice";

  function select(next: Tab) {
    router.replace(`${pathname}?tab=${next}`, { scroll: false });
  }

  return (
    <Container className="max-w-[880px] pt-5 pb-14 md:pt-11">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-[24px] font-extrabold tracking-[-0.045em] md:text-[30px]">고객센터</h1>
          <p className="mt-1 text-[14px] text-sub md:text-[15px]">공지를 확인하고, 궁금한 점은 1:1 문의로 남겨주세요</p>
        </div>
        {session && (
          <Link
            href="/help/inquiries"
            className="hidden shrink-0 items-center gap-0.5 text-[13.5px] font-semibold text-sub hover:text-ink sm:flex"
          >
            내 문의 내역 <ChevronRight size={15} />
          </Link>
        )}
      </div>

      <div role="tablist" className="mt-6 flex border-b border-[#EFEFEF]">
        {tabs.map(({ value, label }) => (
          <button
            key={value}
            role="tab"
            aria-selected={tab === value}
            onClick={() => select(value)}
            className={cn(
              "-mb-px h-12 flex-1 border-b-2 text-[14.5px] font-bold sm:flex-none sm:px-6 md:text-[15.5px]",
              tab === value ? "border-ink text-ink" : "border-transparent text-faint hover:text-ink",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-5 md:mt-7">
        {tab === "notice" && <NoticeList />}
        {tab === "faq" && (
          <>
            <FaqList />
            <div className="mt-8 flex flex-col items-center gap-3 rounded-[18px] bg-surface px-5 py-7 text-center">
              <Headset size={22} />
              <p className="text-[15px] font-bold">원하는 답을 찾지 못했나요?</p>
              <button onClick={() => select("inquiry")} className="h-11 rounded-full bg-ink px-6 text-[14px] font-bold text-white">
                1:1 문의하기
              </button>
            </div>
          </>
        )}
        {tab === "inquiry" && <InquiryForm session={session} />}
      </div>
    </Container>
  );
}
