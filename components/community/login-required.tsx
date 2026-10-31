import Link from "next/link";
import { Users } from "lucide-react";

import { Container } from "@/components/layout/container";

export function CommunityLoginRequired() {
  return (
    <Container className="flex justify-center py-20 md:py-28">
      <div className="w-full max-w-[380px] text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-surface">
          <Users size={22} strokeWidth={2} />
        </span>
        <h1 className="mt-6 text-2xl font-extrabold tracking-[-0.04em]">로그인이 필요해요</h1>
        <p className="mt-2 text-[15px] leading-[1.55] text-sub">
          로그인하면 동료 물리치료사들과
          <br />
          세미나 후기와 임상 이야기를 나눌 수 있어요
        </p>
        <div className="mt-8 flex flex-col gap-2">
          <Link href="/login" className="flex h-12 items-center justify-center rounded-full bg-ink text-[15px] font-bold text-white">
            로그인
          </Link>
          <Link
            href="/signup"
            className="flex h-12 items-center justify-center rounded-full border border-[#E4E4E4] text-[15px] font-bold text-ink"
          >
            회원가입
          </Link>
        </div>
      </div>
    </Container>
  );
}

export function CommunitySkeleton() {
  return (
    <Container className="max-w-[820px] pt-6 md:pt-11" aria-busy>
      <div className="skeleton h-9 w-40 rounded-lg" />
      <div className="mt-8 space-y-3">
        {Array.from({ length: 5 }, (_, index) => (
          <div key={index} className="skeleton h-[104px] rounded-[14px]" />
        ))}
      </div>
    </Container>
  );
}
