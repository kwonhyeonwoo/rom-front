"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, EyeOff, MessageSquareReply, Siren } from "lucide-react";

import { useReadAllNotificationsMutation } from "@/hooks/mutations/notification/useReadAllNotificationsMutation";
import { useReadNotificationMutation } from "@/hooks/mutations/notification/useReadNotificationMutation";
import { useNotificationsQuery } from "@/hooks/queries/notification/useNotificationsQuery";
import { timeAgo, type AppNotification, type NotificationType } from "@/lib/notifications";
import { cn } from "@/lib/utils";

// 헤더 알림 벨. 안 읽은 알림 개수를 배지로 보여주고, 누르면 알림 목록이 열린다.
// 항목을 누르면 읽음 처리하고 해당 화면(예: 답변이 달린 문의)으로 이동한다
export function NotificationBell({ mobile = false }: { mobile?: boolean }) {
  const router = useRouter();
  const notifications = useNotificationsQuery(true);
  const read = useReadNotificationMutation();
  const readAll = useReadAllNotificationsMutation();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  const items = notifications.data?.items ?? [];
  const unread = notifications.data?.unreadCount ?? 0;

  // 바깥을 누르거나 Esc를 누르면 닫는다
  useEffect(() => {
    if (!open) return;
    function onPointer(event: PointerEvent) {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function go(item: AppNotification) {
    if (!item.readAt) read.mutate(item.id);
    setOpen(false);
    router.push(item.link);
  }

  return (
    <div ref={root} className={cn("md:relative", mobile ? "mr-0" : "mr-0.5")}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={unread > 0 ? `알림 ${unread}개` : "알림"}
        aria-expanded={open}
        aria-haspopup="dialog"
        className={cn(
          "relative flex items-center justify-center rounded-full text-[#555] hover:bg-surface hover:text-ink",
          mobile ? "size-8" : "size-9",
        )}
      >
        <Bell size={19} strokeWidth={1.8} />
        {unread > 0 && (
          <span className="absolute top-0.5 right-0 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-soon px-1 text-[10.5px] font-bold text-white tabular-nums">
            {unread > 99 ? "99+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="알림"
          // 모바일은 헤더 아래 가로 전체, PC는 벨 아래 오른쪽 정렬 패널
          className="fixed inset-x-3 top-[60px] z-50 overflow-hidden rounded-[16px] border border-[#E8E8E6] bg-white shadow-[0_12px_40px_rgba(0,0,0,.14)] md:absolute md:inset-x-auto md:top-full md:right-0 md:mt-2 md:w-[360px]"
        >
          <div className="flex items-center justify-between border-b border-[#F0F0F0] px-4 py-3">
            <p className="text-[15px] font-extrabold">
              알림 {unread > 0 && <span className="ml-0.5 text-soon">{unread}</span>}
            </p>
            <button
              type="button"
              onClick={() => readAll.mutate()}
              disabled={unread === 0 || readAll.isPending}
              className="text-[12.5px] font-semibold text-sub hover:text-ink disabled:opacity-40"
            >
              모두 읽음
            </button>
          </div>

          <div className="max-h-[min(70vh,420px)] overflow-y-auto">
            {notifications.isPending ? (
              <div className="space-y-2 p-3" aria-busy>
                {Array.from({ length: 3 }, (_, index) => (
                  <div key={index} className="skeleton h-14 rounded-[12px]" />
                ))}
              </div>
            ) : notifications.isError ? (
              <p role="alert" className="px-4 py-10 text-center text-[14px] text-sub">
                알림을 불러오지 못했어요
              </p>
            ) : items.length === 0 ? (
              <p className="px-4 py-12 text-center text-[14px] text-sub">새 알림이 없어요</p>
            ) : (
              <ul>
                {items.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => go(item)}
                      className={cn(
                        "flex w-full items-start gap-3 px-4 py-3.5 text-left hover:bg-[#FAFAF9]",
                        !item.readAt && "bg-[#F6FBFA]",
                      )}
                    >
                      <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-surface text-brand">
                        <NotificationIcon type={item.type} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className={cn("block text-[14px] leading-[1.4]", item.readAt ? "font-semibold" : "font-bold")}>
                          {item.title}
                        </span>
                        {item.body && <span className="mt-0.5 block truncate text-[13px] text-sub">{item.body}</span>}
                        <span className="mt-1 block text-[12px] text-faint">{timeAgo(item.createdAt)}</span>
                      </span>
                      {!item.readAt && <span className="mt-2 size-2 shrink-0 rounded-full bg-soon" aria-label="읽지 않음" />}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function NotificationIcon({ type }: { type: NotificationType }) {
  if (type === "REPORT_RESULT") return <Siren size={16} />;
  if (type === "CONTENT_HIDDEN") return <EyeOff size={16} className="text-soon" />;
  return <MessageSquareReply size={16} />;
}
