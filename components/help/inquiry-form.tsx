"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CircleCheck } from "lucide-react";
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
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 1:1 문의 보내기. 비회원은 답변 받을 이메일과 개인정보 수집 동의가 필요하다
export function InquiryForm({ session }: { session: Session | null | undefined }) {
  const params = useSearchParams();
  const create = useCreateInquiryMutation();
  const initialType = inquiryTypes.find((t) => t.value === params.get("type"))?.value ?? null;
  const [type, setType] = useState<InquiryType | null>(initialType);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [sent, setSent] = useState(false);

  const guest = session === null;
  const loginEmail = session?.user.email ?? null;
  const trimmedEmail = email.trim();
  // 회원은 비우면 로그인 이메일로 받는다. 로그인 이메일이 없는 계정은 입력해야 한다
  const emailNeeded = guest || !loginEmail;
  const emailValid = trimmedEmail === "" ? !emailNeeded : EMAIL_RE.test(trimmedEmail);
  const valid =
    type !== null &&
    title.trim().length >= 2 &&
    content.trim().length >= INQUIRY_CONTENT_MIN &&
    emailValid &&
    (!guest || agreed);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!valid || !type || create.isPending) return;
    create.mutate(
      { type, title: title.trim(), content: content.trim(), ...(trimmedEmail ? { email: trimmedEmail } : {}) },
      { onSuccess: () => setSent(true) },
    );
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center py-14 text-center">
        <CircleCheck size={40} className="text-brand" strokeWidth={1.8} />
        <h2 className="mt-4 text-[21px] font-extrabold tracking-[-0.04em]">문의를 보냈어요</h2>
        <p className="mt-2 text-[15px] leading-[1.6] text-sub">
          {guest ? (
            <>
              영업일 기준 1~2일 안에
              <br />
              {trimmedEmail} 로 답변드릴게요
            </>
          ) : (
            <>
              답변이 달리면 내 문의 내역에서 볼 수 있어요
              <br />
              보통 영업일 기준 1~2일 걸려요
            </>
          )}
        </p>
        <div className="mt-7 flex gap-2">
          {!guest && (
            <Link href="/help/inquiries" className="flex h-11 items-center rounded-full bg-ink px-5 text-[14px] font-bold text-white">
              내 문의 내역
            </Link>
          )}
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
      {guest && (
        <p className="mb-5 rounded-[12px] bg-surface px-4 py-3 text-[13.5px] leading-[1.55] text-[#444]">
          로그인하지 않아도 문의할 수 있어요. 답변은 입력한 이메일로 보내드려요.{" "}
          <Link href="/login" className="font-bold text-ink underline underline-offset-2">
            로그인
          </Link>
          하면 답변을 문의 내역에서 볼 수 있어요.
        </p>
      )}

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

      <label htmlFor="inquiry-email" className="mt-4 block text-[14px] font-bold">
        답변 받을 이메일{!emailNeeded && <span className="ml-1 font-medium text-faint">(선택)</span>}
      </label>
      <input
        id="inquiry-email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        autoComplete="email"
        placeholder={loginEmail && !guest ? `비우면 ${loginEmail} 로 받아요` : "example@email.com"}
        className={cn(inputClass, "mt-2 h-12")}
      />
      {trimmedEmail !== "" && !emailValid && (
        <p className="mt-1.5 text-[13px] font-semibold text-soon">이메일 형식이 맞지 않아요</p>
      )}

      {guest && (
        <label className="mt-5 flex cursor-pointer items-start gap-2.5">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(event) => setAgreed(event.target.checked)}
            className="mt-0.5 size-[18px] accent-ink"
          />
          <span className="text-[13.5px] leading-[1.55] text-[#444]">
            <span className="font-bold text-ink">(필수) 개인정보 수집·이용에 동의해요.</span> 문의 답변을 위해 이메일을 받고,
            답변 후 1년 동안 보관한 뒤 지워요.
          </span>
        </label>
      )}

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
