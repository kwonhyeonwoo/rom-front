"use client";

import Link from "next/link";
import { AlertCircle, Clock } from "lucide-react";

import { formatRequestedAt, type Verification } from "@/lib/verification";

// 심사 중·반려일 때 커뮤니티 위쪽에 붙는 안내. 그 밖의 상태에서는 아무것도 보이지 않는다
export function VerifyBanner({ verification }: { verification: Verification | undefined }) {
  if (verification?.status === "PENDING") {
    return (
      <div role="status" className="mb-6 flex items-start gap-3 rounded-[14px] bg-[#FFF8EA] px-[18px] py-4">
        <Clock size={20} className="mt-0.5 shrink-0 text-[#A86400]" />
        <div className="min-w-0">
          <p className="text-[15px] font-bold text-[#A86400]">면허 심사 중이에요</p>
          <p className="mt-0.5 text-[13.5px] leading-[1.55] text-[#555]">
            보통 영업일 1일 안에 알려드려요. 승인되면 글과 댓글을 쓸 수 있어요.
            {verification.requestedAt && ` (요청 ${formatRequestedAt(verification.requestedAt)})`}
          </p>
        </div>
      </div>
    );
  }
  if (verification?.status === "REJECTED") {
    return (
      <div role="status" className="mb-6 flex flex-wrap items-center gap-3 rounded-[14px] bg-[#FEF3F2] px-[18px] py-4">
        <AlertCircle size={20} className="shrink-0 text-soon" />
        <div className="min-w-0 flex-1 basis-60">
          <p className="text-[15px] font-bold text-soon">면허 인증이 반려됐어요</p>
          <p className="mt-0.5 text-[13.5px] leading-[1.55] text-[#555]">
            {verification.rejectReason ? `사유: ${verification.rejectReason}` : "면허증 사진을 다시 확인해주세요."}
          </p>
        </div>
        <Link
          href="/verify"
          className="inline-flex h-9 shrink-0 items-center rounded-full bg-ink px-4 text-[13px] font-bold text-white"
        >
          다시 제출하기
        </Link>
      </div>
    );
  }
  return null;
}
