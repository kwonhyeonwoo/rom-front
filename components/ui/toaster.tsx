"use client";

import Link from "next/link";

import { useToastStore } from "@/stores/use-toast-store";

// 화면 아래 가운데에 뜨는 짧은 알림. 모바일에서는 하단 탭바 위에 띄운다
export function Toaster() {
  const toasts = useToastStore((state) => state.toasts);
  const dismiss = useToastStore((state) => state.dismiss);

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-[96px] z-50 flex flex-col items-center gap-2 px-5 md:bottom-10"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          className="pointer-events-auto flex max-w-[420px] items-center gap-4 rounded-full bg-ink py-3 pr-3 pl-5 text-[14px] font-semibold text-white shadow-[0_8px_28px_rgba(0,0,0,.22)] animate-[toast-in_.22s_ease-out] max-md:w-full"
        >
          <span className="flex-1">{toast.message}</span>
          {toast.action ? (
            <Link
              href={toast.action.href}
              onClick={() => dismiss(toast.id)}
              className="shrink-0 rounded-full bg-white px-3.5 py-1.5 text-[13px] font-bold text-ink"
            >
              {toast.action.label}
            </Link>
          ) : (
            <span className="w-2" />
          )}
        </div>
      ))}
    </div>
  );
}
