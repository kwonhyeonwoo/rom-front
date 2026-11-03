"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronDown, ChevronLeft, MessagesSquare } from "lucide-react";

import { Container } from "@/components/layout/container";
import { useMarkInquiryReadMutation } from "@/hooks/mutations/support/useMarkInquiryReadMutation";
import { useMyInquiriesQuery } from "@/hooks/queries/support/useMyInquiriesQuery";
import { useSession } from "@/hooks/useSession";
import { formatDate, inquiryStatusChip, inquiryTypeLabel } from "@/lib/support";
import { cn } from "@/lib/utils";

// 내 1:1 문의 내역. 문의를 누르면 보낸 내용과 답변이 펼쳐지고, 새 답변은 열어보면 읽음 처리된다
export function MyInquiries() {
  const session = useSession();
  const inquiries = useMyInquiriesQuery(Boolean(session));
  const markRead = useMarkInquiryReadMutation();
  // 알림에서 들어오면 해당 문의를 바로 펼친다
  const openId = useSearchParams().get("id");

  return (
    <Container className="max-w-[880px] pt-5 pb-14 md:pt-11">
      <Link href="/help" className="-ml-1 flex w-fit items-center gap-0.5 text-[14px] font-semibold text-sub hover:text-ink">
        <ChevronLeft size={18} /> 고객센터
      </Link>
      <div className="mt-3 flex items-end justify-between gap-3">
        <h1 className="text-[24px] font-extrabold tracking-[-0.045em] md:text-[30px]">내 문의 내역</h1>
        {session && (
          <Link href="/help?tab=inquiry" className="h-10 shrink-0 rounded-full bg-ink px-4 text-[14px] leading-10 font-bold text-white">
            새 문의
          </Link>
        )}
      </div>

      <div className="mt-6">
        {session === undefined || (session && inquiries.isPending) ? (
          <div className="space-y-2" aria-busy>
            {Array.from({ length: 3 }, (_, index) => (
              <div key={index} className="skeleton h-[72px] rounded-[12px]" />
            ))}
          </div>
        ) : session === null ? (
          <Empty
            title="로그인하면 문의 내역을 볼 수 있어요"
            description="문의하고 받은 답변을 여기서 확인해요"
            action={{ href: "/login", label: "로그인" }}
          />
        ) : inquiries.isError ? (
          <p role="alert" className="py-16 text-center text-[15px] text-sub">
            문의 내역을 불러오지 못했어요. 잠시 후 다시 시도해주세요.
          </p>
        ) : !inquiries.data || inquiries.data.length === 0 ? (
          <Empty
            title="아직 보낸 문의가 없어요"
            description="궁금한 점이 있으면 언제든 남겨주세요"
            action={{ href: "/help?tab=inquiry", label: "1:1 문의하기" }}
          />
        ) : (
          <ul className="divide-y divide-[#EFEFEF] border-y border-[#EFEFEF]">
            {inquiries.data.map((item) => {
              const chip = inquiryStatusChip[item.status];
              return (
                <li key={item.id}>
                  <details
                    className="group"
                    open={item.id === openId}
                    onToggle={(event) => {
                      if (event.currentTarget.open && item.unread && !markRead.isPending) markRead.mutate(item.id);
                    }}
                  >
                    <summary className="flex cursor-pointer list-none items-center gap-3 py-4 [&::-webkit-details-marker]:hidden">
                      <span className={cn("inline-flex h-6 shrink-0 items-center rounded-md px-2 text-[12px] font-bold", chip.className)}>
                        {chip.label}
                      </span>
                      {item.unread && (
                        <span className="inline-flex h-5 shrink-0 items-center rounded-full bg-soon px-1.5 text-[11px] font-extrabold text-white">
                          NEW
                        </span>
                      )}
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[15px] font-bold">{item.title}</span>
                        <span className="mt-0.5 block text-[12.5px] text-faint">
                          {inquiryTypeLabel(item.type)} · {formatDate(item.createdAt)}
                        </span>
                      </span>
                      <ChevronDown size={18} className="shrink-0 text-faint transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="mb-4 space-y-3">
                      <p className="rounded-[12px] bg-surface px-4 py-3.5 text-[14.5px] leading-[1.65] break-words whitespace-pre-wrap">
                        {item.content}
                      </p>
                      {item.answer ? (
                        <div className="rounded-[12px] border border-[#D7EBE6] bg-[#F3FAF8] px-4 py-3.5">
                          <p className="text-[13px] font-bold text-brand">
                            롬 고객센터 답변 <span className="font-medium text-faint">· {formatDate(item.answeredAt)}</span>
                          </p>
                          <p className="mt-1.5 text-[14.5px] leading-[1.65] break-words whitespace-pre-wrap">{item.answer}</p>
                        </div>
                      ) : (
                        <p className="px-1 text-[13.5px] text-sub">확인하고 있어요. 답변이 달리면 여기에 보여요</p>
                      )}
                    </div>
                  </details>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </Container>
  );
}

function Empty({ title, description, action }: { title: string; description: string; action: { href: string; label: string } }) {
  return (
    <div className="flex flex-col items-center py-16 text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-surface">
        <MessagesSquare size={22} />
      </span>
      <p className="mt-5 text-[18px] font-extrabold tracking-[-0.04em]">{title}</p>
      <p className="mt-1.5 text-[14.5px] text-sub">{description}</p>
      <Link href={action.href} className="mt-6 flex h-11 items-center rounded-full bg-ink px-6 text-[14px] font-bold text-white">
        {action.label}
      </Link>
    </div>
  );
}
