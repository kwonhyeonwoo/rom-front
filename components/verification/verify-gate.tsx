"use client";

import Link from "next/link";
import { ShieldCheck } from "lucide-react";

import { Container } from "@/components/layout/container";
import type { Verification, VerifyAccess } from "@/lib/verification";

const copy: Partial<Record<VerifyAccess, { title: string; body: string; cta?: string }>> = {
  NONE: {
    title: "면허 인증 후 이용할 수 있어요",
    body: "물리치료사 면허를 한 번만 인증하면 글쓰기, 댓글, 후기를 쓸 수 있어요.",
    cta: "면허 인증하기",
  },
  PENDING: {
    title: "면허 심사 중이에요",
    body: "보통 영업일 1일 안에 알려드려요. 승인되면 바로 쓸 수 있어요.",
  },
  REJECTED: {
    title: "면허 인증이 반려됐어요",
    body: "면허증 사진을 다시 올려주세요.",
    cta: "다시 제출하기",
  },
};

// 글쓰기·후기 쓰기 화면에서 승인 전 사용자에게 폼 대신 보여주는 안내
export function VerifyGate({ access, verification }: { access: VerifyAccess; verification?: Verification }) {
  const text = copy[access] ?? copy.NONE!;
  return (
    <Container className="flex justify-center py-20 md:py-28">
      <div className="w-full max-w-[380px] text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-surface">
          <ShieldCheck size={22} strokeWidth={2} />
        </span>
        <h1 className="mt-6 text-2xl font-extrabold tracking-[-0.04em]">{text.title}</h1>
        <p className="mt-2 text-[15px] leading-[1.55] text-sub">
          {text.body}
          {access === "REJECTED" && verification?.rejectReason && (
            <>
              <br />
              사유: {verification.rejectReason}
            </>
          )}
        </p>
        <div className="mt-8 flex flex-col gap-2">
          {text.cta && (
            <Link
              href="/verify"
              className="flex h-12 items-center justify-center rounded-full bg-ink text-[15px] font-bold text-white"
            >
              {text.cta}
            </Link>
          )}
          <Link
            href="/community"
            className="flex h-12 items-center justify-center rounded-full border border-[#E4E4E4] text-[15px] font-bold text-ink"
          >
            커뮤니티로 가기
          </Link>
        </div>
      </div>
    </Container>
  );
}
