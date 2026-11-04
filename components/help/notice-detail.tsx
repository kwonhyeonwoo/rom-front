"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { Container } from "@/components/layout/container";
import { useNoticeQuery } from "@/hooks/queries/support/useNoticeQuery";
import { apiErrorMessage } from "@/lib/api";
import {
  formatDate,
  NOTICE_IMPORTANT_CHIP,
  noticeCategoryChip,
  noticeCategoryLabel,
  noticeDisplayTitle,
} from "@/lib/support";
import { cn } from "@/lib/utils";

// 공지 본문. 읽기 전용
export function NoticeDetail({ id }: { id: string }) {
  const notice = useNoticeQuery(id);

  return (
    <Container className="max-w-[880px] pt-5 pb-14 md:pt-11">
      <Link href="/help?tab=notice" className="-ml-1 flex w-fit items-center gap-0.5 text-[14px] font-semibold text-sub hover:text-ink">
        <ChevronLeft size={18} /> 공지사항
      </Link>

      {notice.isPending ? (
        <div className="mt-6" aria-busy>
          <div className="skeleton h-8 w-2/3 rounded-lg" />
          <div className="skeleton mt-6 h-64 rounded-[14px]" />
        </div>
      ) : notice.isError ? (
        <p role="alert" className="py-20 text-center text-[15px] text-sub">
          {apiErrorMessage(notice.error, "공지를 불러오지 못했어요. 잠시 후 다시 시도해주세요.")}
        </p>
      ) : (
        <article className="mt-5">
          <header className="border-b border-[#EFEFEF] pb-5">
            <div className="flex items-center gap-1.5">
              <span
                className={cn(
                  "inline-flex h-6 items-center rounded-md px-2 text-[12px] font-bold",
                  noticeCategoryChip(notice.data.category),
                )}
              >
                {noticeCategoryLabel(notice.data.category)}
              </span>
              {notice.data.important && (
                <span className={cn("inline-flex h-6 items-center rounded-md px-2 text-[12px] font-bold", NOTICE_IMPORTANT_CHIP)}>
                  중요
                </span>
              )}
            </div>
            <h1 className="mt-2.5 text-[22px] font-extrabold tracking-[-0.045em] break-words md:text-[28px]">
              {noticeDisplayTitle(notice.data.title, notice.data.category)}
            </h1>
            <p className="mt-2 text-[13.5px] text-faint">롬 운영팀 · {formatDate(notice.data.createdAt)}</p>
          </header>
          <div className="py-7 text-[15.5px] leading-[1.8] break-words whitespace-pre-wrap text-[#222]">{notice.data.content}</div>
          <div className="border-t border-[#EFEFEF] pt-5">
            <Link href="/help?tab=notice" className="inline-flex h-11 items-center rounded-full border border-[#E4E4E4] px-5 text-[14px] font-bold">
              목록으로
            </Link>
          </div>
        </article>
      )}
    </Container>
  );
}
