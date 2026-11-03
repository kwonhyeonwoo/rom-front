"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CircleCheck, LogIn } from "lucide-react";
import type { Session } from "@supabase/supabase-js";

import { useCreateInquiryMutation } from "@/hooks/mutations/support/useCreateInquiryMutation";
import { apiErrorMessage } from "@/lib/api";
import {
  INQUIRY_CONTENT_MAX,
  INQUIRY_CONTENT_MIN,
  INQUIRY_TITLE_MAX,
  inquiryTypes,
  type InquiryType,
} from "@/lib/support";
import { cn } from "@/lib/utils";

const inputClass =
  "w-full rounded-[12px] border border-[#E1E1E1] bg-white px-3.5 text-[15px] outline-none placeholder:text-faint focus:border-ink";

// 1:1 문의 보내기. 로그인한 회원만 보낼 수 있고, 답변은 내 문의 내역과 헤더 알림에서 확인한다
export function InquiryForm({ session }: { session: Session | null | undefined }) {
  const params = useSearchParams();
  const create = useCreateInquiryMutation();
  const initialType = inquiryTypes.find((t) => t.value === params.get("type"))?.value ?? null;
  const [type, setType] = useState<InquiryType | null>(initialType);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [sent, setSent] = useState(false);

  const valid = type !== null && title.trim().length >= 2 && content.trim().length >= INQUIRY_CONTENT_MIN;

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!valid || !type || create.isPending) return;
    create.mutate(
      { type, title: title.trim(), content: content.trim() },
      { onSuccess: () => setSent(true) },
    );
  }

  if (session === null) {
    return (
      <div className="flex flex-col items-center py-14 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-surface">
          <LogIn size={22} />
        </span>
        <h2 className="mt-5 text-[21px] font-extrabold tracking-[-0.04em]">로그인하고 문의해주세요</h2>
        <p className="mt-2 text-[15px] leading-[1.6] text-sub">
          답변은 마이페이지 문의 내역과
          <br />
          헤더 알림에서 바로 확인할 수 있어요
        </p>
        <div className="mt-7 flex gap-2">
          <Link href="/login" className="flex h-11 items-center rounded-full bg-ink px-6 text-[14px] font-bold text-white">
            로그인
          </Link>
          <Link href="/signup" className="flex h-11 items-center rounded-full border border-[#E4E4E4] px-6 text-[14px] font-bold">
            회원가입
          </Link>
        </div>
        <p className="mt-6 text-[13px] text-faint">계정이 없는 업체는 페이지 아래 contact 메일로 보내주세요</p>
      </div>
    );
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center py-14 text-center">
        <CircleCheck size={40} className="text-brand" strokeWidth={1.8} />
        <h2 className="mt-4 text-[21px] font-extrabold tracking-[-0.04em]">문의를 보냈어요</h2>
        <p className="mt-2 text-[15px] leading-[1.6] text-sub">
          답변이 달리면 헤더 알림과 내 문의 내역에서 볼 수 있어요
          <br />
          보통 영업일 기준 1~2일 걸려요
        </p>
        <div className="mt-7 flex gap-2">
          <Link href="/help/inquiries" className="flex h-11 items-center rounded-full bg-ink px-5 text-[14px] font-bold text-white">
            내 문의 내역
          </Link>
          <button
            onClick={() => {
              setSent(false);
              setTitle("");
              setContent("");
              setType(null);
            }}
            className="h-11 rounded-full border border-[#E4E4E4] px-5 text-[14px] font-bold"
          >
            새 문의 쓰기
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="max-w-[640px]">
      <p className="text-[14px] font-bold">문의 유형</p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {inquiryTypes.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            aria-pressed={type === value}
            onClick={() => setType(value)}
            className={cn(
              "h-10 rounded-full border px-4 text-[14px] font-bold",
              type === value ? "border-ink bg-ink text-white" : "border-[#E4E4E4] text-[#444] hover:border-[#CFCFCF]",
            )}
          >
            {label}
          </button>
        ))}
      </div>
      {type === "PARTNER" && (
        <p className="mt-2 text-[13px] text-sub">업체명, 담당자 연락처, 원하는 노출 방식을 함께 적어주시면 빨리 안내드릴 수 있어요</p>
      )}
      {type === "SEMINAR" && <p className="mt-2 text-[13px] text-sub">세미나 이름과 틀린 내용(날짜, 가격 등)을 적어주세요</p>}

      <label htmlFor="inquiry-title" className="mt-6 block text-[14px] font-bold">
        제목
      </label>
      <input
        id="inquiry-title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        maxLength={INQUIRY_TITLE_MAX}
        placeholder="어떤 내용인지 짧게 적어주세요"
        className={cn(inputClass, "mt-2 h-12")}
      />

      <label htmlFor="inquiry-content" className="mt-6 block text-[14px] font-bold">
        내용
      </label>
      <textarea
        id="inquiry-content"
        value={content}
        onChange={(event) => setContent(event.target.value)}
        maxLength={INQUIRY_CONTENT_MAX}
        rows={8}
        placeholder={`${INQUIRY_CONTENT_MIN}자 이상 적어주세요`}
        className={cn(inputClass, "mt-2 resize-y py-3 leading-[1.6]")}
      />
      <p className="text-right text-[12px] text-faint tabular-nums">
        {content.trim().length}/{INQUIRY_CONTENT_MAX}
      </p>

      {create.isError && (
        <p role="alert" className="mt-4 text-[13.5px] font-semibold text-soon">
          {apiErrorMessage(create.error, "문의를 보내지 못했어요. 잠시 후 다시 시도해주세요")}
        </p>
      )}

      <button
        type="submit"
        disabled={!valid || create.isPending || session === undefined}
        className="mt-6 h-12 w-full rounded-full bg-ink text-[15px] font-bold text-white disabled:opacity-40"
      >
        {create.isPending ? "보내는 중…" : "문의 보내기"}
      </button>
    </form>
  );
}
