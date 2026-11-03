"use client";

import { useState } from "react";
import { ChevronLeft, Copy } from "lucide-react";

import { useAnswerInquiryMutation } from "@/hooks/mutations/admin/useAnswerInquiryMutation";
import { useAdminInquiriesQuery } from "@/hooks/queries/admin/useAdminInquiriesQuery";
import { apiErrorMessage } from "@/lib/api";
import {
  ANSWER_MAX,
  inquiryStatusChip,
  inquiryTypeLabel,
  type AdminInquiry,
  type InquiryStatus,
} from "@/lib/support";
import { cn } from "@/lib/utils";
import { formatRequestedAt } from "@/lib/verification";
import { toast } from "@/stores/use-toast-store";

const tabs: { value: InquiryStatus; label: string }[] = [
  { value: "OPEN", label: "답변 대기" },
  { value: "ANSWERED", label: "답변 완료" },
];

// 1:1 문의를 보고 답변하는 화면. 답변하면 문의한 회원의 헤더 알림과 문의 내역에 바로 보인다
export function AdminInquiries() {
  const [tab, setTab] = useState<InquiryStatus>("OPEN");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const list = useAdminInquiriesQuery(tab);
  const items = list.data ?? [];
  const selected = items.find((item) => item.id === selectedId) ?? null;

  return (
    <div>
      <div className={cn("flex flex-wrap items-end justify-between gap-3", selected && "hidden md:flex")}>
        <div>
          <h1 className="text-[24px] font-extrabold tracking-[-0.045em] md:text-[30px]">1:1 문의</h1>
          <p className="mt-1 text-[14px] text-sub">오래 기다린 문의부터 보여요. 답변하면 문의한 회원에게 새 답변으로 알려져요</p>
        </div>
        <div role="tablist" className="flex gap-1 rounded-full bg-surface p-1">
          {tabs.map(({ value, label }) => (
            <button
              key={value}
              role="tab"
              aria-selected={tab === value}
              onClick={() => {
                setTab(value);
                setSelectedId(null);
              }}
              className={cn(
                "h-9 rounded-full px-4 text-[14px] font-bold",
                tab === value ? "bg-white text-ink shadow-sm" : "text-sub hover:text-ink",
              )}
            >
              {label}
              {value === tab && list.data && <span className="ml-1 text-faint">{list.data.length}</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 md:grid md:grid-cols-[340px_minmax(0,1fr)] md:items-start md:gap-6">
        <section className={cn(selected && "hidden md:block")} aria-label="문의 목록">
          {list.status === "pending" ? (
            <div className="space-y-2" aria-busy>
              {Array.from({ length: 4 }, (_, index) => (
                <div key={index} className="skeleton h-[76px] rounded-[14px]" />
              ))}
            </div>
          ) : list.status === "error" ? (
            <p role="alert" className="py-16 text-center text-[15px] text-sub">
              목록을 불러오지 못했어요. 잠시 후 다시 시도해주세요.
            </p>
          ) : items.length === 0 ? (
            <p className="py-16 text-center text-[15px] text-sub">
              {tab === "OPEN" ? "답변을 기다리는 문의가 없어요" : "답변한 문의가 없어요"}
            </p>
          ) : (
            <ul className="space-y-2">
              {items.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => setSelectedId(item.id)}
                    aria-current={item.id === selectedId}
                    className={cn(
                      "w-full rounded-[14px] border px-4 py-3.5 text-left transition-colors",
                      item.id === selectedId ? "border-ink bg-white" : "border-[#EFEFEF] hover:border-[#D6D6D6]",
                    )}
                  >
                    <div className="flex items-center gap-1.5 text-[12.5px] font-semibold text-sub">
                      <span>{inquiryTypeLabel(item.type)}</span>
                      {!item.member && <span className="text-faint">·</span>}
                      {!item.member && <span className="text-[#B25E00]">이전 비회원 문의</span>}
                      <span className="ml-auto font-medium text-faint">{formatRequestedAt(item.createdAt)}</span>
                    </div>
                    <p className="mt-1 truncate text-[15.5px] font-bold">{item.title}</p>
                    {item.email && <p className="mt-0.5 truncate text-[13px] text-sub">{item.email}</p>}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className={cn(!selected && "hidden md:block")} aria-label="문의 상세">
          {selected ? (
            <InquiryDetail
              key={selected.id}
              item={selected}
              onBack={() => setSelectedId(null)}
              onAnswered={() => setSelectedId(null)}
            />
          ) : (
            <div className="flex h-[420px] items-center justify-center rounded-[18px] border border-dashed border-[#E4E4E4] text-[15px] text-sub">
              왼쪽 목록에서 문의를 고르세요
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function InquiryDetail({
  item,
  onBack,
  onAnswered,
}: {
  item: AdminInquiry;
  onBack: () => void;
  onAnswered: () => void;
}) {
  const chip = inquiryStatusChip[item.status];

  function copyEmail() {
    if (!item.email) return;
    navigator.clipboard.writeText(item.email).then(
      () => toast("이메일을 복사했어요"),
      () => toast("복사하지 못했어요"),
    );
  }

  return (
    <div className="rounded-[18px] border border-[#EFEFEF] p-5 md:p-7">
      <button onClick={onBack} className="-ml-1 mb-4 flex items-center gap-1 text-[14px] font-semibold text-sub md:hidden">
        <ChevronLeft size={18} /> 목록
      </button>

      <div className="flex flex-wrap items-center gap-2">
        <span className={cn("inline-flex h-6 items-center rounded-md px-2 text-[12.5px] font-bold", chip.className)}>
          {chip.label}
        </span>
        <span className="inline-flex h-6 items-center rounded-md bg-surface px-2 text-[12.5px] font-bold text-[#555]">
          {inquiryTypeLabel(item.type)}
        </span>
        <span className="text-[13px] text-faint">접수 {formatRequestedAt(item.createdAt)}</span>
      </div>
      <h2 className="mt-3 text-[21px] font-extrabold tracking-[-0.04em] break-words">{item.title}</h2>

      <dl className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13.5px]">
        <div className="flex items-center gap-1.5">
          <dt className="text-sub">보낸 사람</dt>
          <dd className="font-bold">{item.member ? "회원" : "이전 비회원 문의"}</dd>
        </div>
        {item.email && (
          <div className="flex min-w-0 items-center gap-1.5">
            <dt className="text-sub">이메일</dt>
            <dd className="flex min-w-0 items-center gap-1 font-bold">
              <span className="truncate">{item.email}</span>
              <button onClick={copyEmail} aria-label="이메일 복사" className="rounded p-1 text-faint hover:text-ink">
                <Copy size={14} />
              </button>
            </dd>
          </div>
        )}
      </dl>

      <p className="mt-4 rounded-[14px] bg-surface px-4 py-3.5 text-[14.5px] leading-[1.65] break-words whitespace-pre-wrap">
        {item.content}
      </p>

      {item.status === "ANSWERED" ? (
        <div className="mt-6">
          <p className="text-[13.5px] font-bold">
            답변 <span className="font-medium text-faint">· {item.answeredBy} · {formatRequestedAt(item.answeredAt)}</span>
          </p>
          <p className="mt-2 rounded-[14px] border border-[#EFEFEF] px-4 py-3.5 text-[14.5px] leading-[1.65] break-words whitespace-pre-wrap">
            {item.answer}
          </p>
          {item.status === "ANSWERED" && (
            <p className="mt-2 text-[12.5px] text-faint">
              {item.member ? (item.unread ? "회원이 아직 열어보지 않았어요" : "회원이 확인했어요") : "비회원 문의라 화면 알림은 가지 않아요"}
            </p>
          )}
        </div>
      ) : (
        <AnswerForm item={item} onAnswered={onAnswered} />
      )}
    </div>
  );
}

function AnswerForm({ item, onAnswered }: { item: AdminInquiry; onAnswered: () => void }) {
  const answerMutation = useAnswerInquiryMutation();
  const [answer, setAnswer] = useState("");
  const trimmed = answer.trim();
  const valid = trimmed.length >= 2 && trimmed.length <= ANSWER_MAX;

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!valid || answerMutation.isPending) return;
    answerMutation.mutate(
      { id: item.id, answer: trimmed },
      {
        onSuccess: () => {
          toast(item.member ? "답변했어요. 회원에게 새 답변으로 알려져요" : "답변을 저장했어요");
          onAnswered();
        },
        onError: (error) => toast(apiErrorMessage(error, "답변하지 못했어요. 잠시 후 다시 시도해주세요")),
      },
    );
  }

  return (
    <form onSubmit={submit} className="mt-6">
      <label htmlFor="answer" className="text-[13.5px] font-bold">
        답변 작성
      </label>
      {!item.member && (
        <p className="mt-1 text-[12.5px] leading-[1.5] text-[#B25E00]">
          회원 전용으로 바꾸기 전에 받은 비회원 문의라 알림이 가지 않아요. 필요하면 {item.email ?? "문의자"} 에게 직접 연락해주세요
        </p>
      )}
      <textarea
        id="answer"
        value={answer}
        onChange={(event) => setAnswer(event.target.value)}
        maxLength={ANSWER_MAX}
        rows={7}
        placeholder="문의한 회원에게 보일 답변을 적어주세요"
        className="mt-2 w-full resize-y rounded-[12px] border border-[#E1E1E1] px-3.5 py-3 text-[14.5px] leading-[1.6] outline-none placeholder:text-faint focus:border-ink"
      />
      <div className="mt-1 flex items-center justify-between">
        <p className="text-[12px] text-faint">답변은 한 번 보내면 고칠 수 없어요</p>
        <p className="text-[12px] text-faint tabular-nums">
          {trimmed.length}/{ANSWER_MAX}
        </p>
      </div>
      <button
        type="submit"
        disabled={!valid || answerMutation.isPending}
        className="mt-3 h-12 w-full rounded-full bg-ink text-[15px] font-bold text-white disabled:opacity-40"
      >
        {answerMutation.isPending ? "보내는 중…" : "답변 보내기"}
      </button>
    </form>
  );
}
