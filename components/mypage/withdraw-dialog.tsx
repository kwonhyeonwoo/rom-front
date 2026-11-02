"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog } from "radix-ui";
import { Check, X } from "lucide-react";

import { useWithdrawMutation } from "@/hooks/mutations/user/useWithdrawMutation";
import { apiErrorMessage } from "@/lib/api";
import { cn } from "@/lib/utils";
import { toast } from "@/stores/use-toast-store";

const notices = [
  "저장한 세미나, 수강 후기, 면허 인증 정보가 바로 삭제돼요.",
  "커뮤니티에 쓴 글과 댓글은 남고, 작성자는 '탈퇴한 회원'으로 바뀌어요. 지우고 싶은 글은 탈퇴 전에 삭제해주세요.",
  "삭제한 정보는 되돌릴 수 없어요. 같은 계정으로 다시 로그인하면 새 회원으로 가입돼요.",
];

// 마이페이지의 회원 탈퇴 버튼과 확인 모달
export function WithdrawButton({ className }: { className?: string }) {
  const router = useRouter();
  const withdraw = useWithdrawMutation();
  const [open, setOpen] = useState(false);
  const [agreed, setAgreed] = useState(false);

  function change(next: boolean) {
    // 처리 중에는 닫지 않는다
    if (withdraw.isPending) return;
    setOpen(next);
    if (!next) {
      setAgreed(false);
      withdraw.reset();
    }
  }

  function submit() {
    if (!agreed || withdraw.isPending) return;
    withdraw.mutate(undefined, {
      onSuccess: () => {
        setOpen(false);
        router.replace("/");
        toast("탈퇴가 완료됐어요. 그동안 이용해주셔서 감사해요");
      },
    });
  }

  return (
    <Dialog.Root open={open} onOpenChange={change}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className={cn("text-[13px] font-medium text-faint underline underline-offset-[3px] hover:text-sub", className)}
        >
          회원 탈퇴
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/45 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content
          className={cn(
            "fixed z-50 bg-white p-6 shadow-[0_12px_40px_rgba(0,0,0,.18)] focus:outline-none",
            // 모바일은 아래에서 올라오는 시트, PC는 가운데 모달
            "inset-x-0 bottom-0 rounded-t-[24px] pb-[calc(24px+env(safe-area-inset-bottom))]",
            "md:inset-x-auto md:bottom-auto md:top-1/2 md:left-1/2 md:w-[420px] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-[24px] md:p-7",
          )}
        >
          <div className="flex items-start justify-between gap-4">
            <Dialog.Title className="text-[21px] font-extrabold tracking-[-0.04em]">정말 탈퇴하시겠어요?</Dialog.Title>
            <Dialog.Close
              aria-label="닫기"
              disabled={withdraw.isPending}
              className="-mt-1 -mr-1 flex size-8 items-center justify-center rounded-full text-sub hover:bg-surface"
            >
              <X size={18} />
            </Dialog.Close>
          </div>
          <Dialog.Description className="mt-1.5 text-[14px] text-sub">
            탈퇴하면 바로 처리되고 아래 내용이 적용돼요.
          </Dialog.Description>

          <ul className="mt-5 flex flex-col gap-2.5 rounded-[16px] bg-surface p-4 text-[13.5px] leading-[1.6] text-[#444]">
            {notices.map((notice) => (
              <li key={notice} className="flex gap-2">
                <span aria-hidden className="mt-[9px] size-1 shrink-0 rounded-full bg-[#999]" />
                {notice}
              </li>
            ))}
          </ul>

          <label className="mt-5 flex cursor-pointer items-center gap-2.5 text-[14px] font-semibold">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(event) => setAgreed(event.target.checked)}
              disabled={withdraw.isPending}
              className="peer sr-only"
            />
            <span
              aria-hidden
              className={cn(
                "flex size-5 items-center justify-center rounded-md border peer-focus-visible:ring-2 peer-focus-visible:ring-ink/30",
                agreed ? "border-ink bg-ink text-white" : "border-[#D0D0D0] bg-white",
              )}
            >
              {agreed && <Check size={13} strokeWidth={3} />}
            </span>
            안내를 모두 확인했고 탈퇴에 동의해요
          </label>

          {withdraw.isError && (
            <p role="alert" className="mt-3 text-[13px] text-soon">
              {apiErrorMessage(withdraw.error, "탈퇴를 처리하지 못했어요. 잠시 후 다시 시도해주세요.")}
            </p>
          )}

          <div className="mt-6 grid grid-cols-2 gap-2">
            <Dialog.Close
              disabled={withdraw.isPending}
              className="flex h-12 items-center justify-center rounded-full border border-[#E4E4E4] text-[15px] font-bold text-ink"
            >
              취소
            </Dialog.Close>
            <button
              type="button"
              onClick={submit}
              disabled={!agreed || withdraw.isPending}
              className="flex h-12 items-center justify-center rounded-full bg-soon text-[15px] font-bold text-white disabled:opacity-40"
            >
              {withdraw.isPending ? "탈퇴하는 중" : "탈퇴하기"}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
