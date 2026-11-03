"use client";

import { useState } from "react";
import { ChevronLeft, Pin, Plus } from "lucide-react";

import { useDeleteNoticeMutation } from "@/hooks/mutations/admin/useDeleteNoticeMutation";
import { useSaveNoticeMutation, type NoticeBody } from "@/hooks/mutations/admin/useSaveNoticeMutation";
import { useAdminNoticeQuery } from "@/hooks/queries/admin/useAdminNoticeQuery";
import { useAdminNoticesQuery } from "@/hooks/queries/admin/useAdminNoticesQuery";
import { apiErrorMessage } from "@/lib/api";
import { formatDate, NOTICE_CONTENT_MAX, noticeCategories, noticeCategoryLabel, type Notice } from "@/lib/support";
import { cn } from "@/lib/utils";
import { toast } from "@/stores/use-toast-store";

// 편집 중인 공지: null은 아무것도 안 고른 상태, "new"는 새 공지
type Editing = string | "new" | null;

// 공지 작성·수정·삭제. 고정한 공지는 목록 맨 위와 메인 상단 띠 배너에 보인다
export function AdminNotices() {
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<Editing>(null);
  const list = useAdminNoticesQuery(page);
  const items = list.data?.items ?? [];
  const totalPages = list.data?.totalPages ?? 1;

  return (
    <div>
      <div className={cn("flex flex-wrap items-end justify-between gap-3", editing && "hidden md:flex")}>
        <div>
          <h1 className="text-[24px] font-extrabold tracking-[-0.045em] md:text-[30px]">공지사항</h1>
          <p className="mt-1 text-[14px] text-sub">고객센터 공지 탭에 보여요. 고정한 공지는 메인 상단 띠 배너로도 떠요</p>
        </div>
        <button
          onClick={() => setEditing("new")}
          className="flex h-10 items-center gap-1.5 rounded-full bg-ink px-4 text-[14px] font-bold text-white"
        >
          <Plus size={16} /> 새 공지
        </button>
      </div>

      <div className="mt-6 md:grid md:grid-cols-[340px_minmax(0,1fr)] md:items-start md:gap-6">
        <section className={cn(editing && "hidden md:block")} aria-label="공지 목록">
          {list.status === "pending" ? (
            <div className="space-y-2" aria-busy>
              {Array.from({ length: 4 }, (_, index) => (
                <div key={index} className="skeleton h-[64px] rounded-[14px]" />
              ))}
            </div>
          ) : list.status === "error" ? (
            <p role="alert" className="py-16 text-center text-[15px] text-sub">
              목록을 불러오지 못했어요. 잠시 후 다시 시도해주세요.
            </p>
          ) : items.length === 0 ? (
            <p className="py-16 text-center text-[15px] text-sub">아직 공지가 없어요</p>
          ) : (
            <>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => setEditing(item.id)}
                      aria-current={item.id === editing}
                      className={cn(
                        "w-full rounded-[14px] border px-4 py-3.5 text-left transition-colors",
                        item.id === editing ? "border-ink bg-white" : "border-[#EFEFEF] hover:border-[#D6D6D6]",
                      )}
                    >
                      <div className="flex items-center gap-1.5 text-[12.5px] font-semibold text-sub">
                        {item.pinned && <Pin size={12} className="text-soon" aria-label="고정" />}
                        <span>{noticeCategoryLabel(item.category)}</span>
                        <span className="ml-auto font-medium text-faint">{formatDate(item.createdAt)}</span>
                      </div>
                      <p className="mt-1 truncate text-[15px] font-bold">{item.title}</p>
                    </button>
                  </li>
                ))}
              </ul>
              {totalPages > 1 && (
                <div className="mt-4 flex items-center justify-center gap-3 text-[13.5px] font-semibold">
                  <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="text-sub disabled:opacity-40">
                    이전
                  </button>
                  <span className="tabular-nums">
                    {page} / {totalPages}
                  </span>
                  <button
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="text-sub disabled:opacity-40"
                  >
                    다음
                  </button>
                </div>
              )}
            </>
          )}
        </section>

        <section className={cn(!editing && "hidden md:block")} aria-label="공지 편집">
          {editing ? (
            <NoticeEditorLoader key={editing} id={editing === "new" ? null : editing} onClose={() => setEditing(null)} />
          ) : (
            <div className="flex h-[420px] items-center justify-center rounded-[18px] border border-dashed border-[#E4E4E4] text-[15px] text-sub">
              공지를 골라 고치거나 새 공지를 써주세요
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function NoticeEditorLoader({ id, onClose }: { id: string | null; onClose: () => void }) {
  const detail = useAdminNoticeQuery(id);

  if (id && detail.isPending) {
    return <div className="skeleton h-[420px] rounded-[18px]" aria-busy />;
  }
  if (id && detail.isError) {
    return (
      <p role="alert" className="py-16 text-center text-[15px] text-sub">
        {apiErrorMessage(detail.error, "공지를 불러오지 못했어요. 잠시 후 다시 시도해주세요.")}
      </p>
    );
  }
  return <NoticeEditor notice={detail.data ?? null} onClose={onClose} />;
}

function NoticeEditor({ notice, onClose }: { notice: Notice | null; onClose: () => void }) {
  const save = useSaveNoticeMutation();
  const remove = useDeleteNoticeMutation();
  const [form, setForm] = useState<NoticeBody>({
    category: notice?.category ?? "SERVICE",
    title: notice?.title ?? "",
    content: notice?.content ?? "",
    pinned: notice?.pinned ?? false,
  });
  const title = form.title.trim();
  const content = form.content.trim();
  const valid = title.length >= 2 && title.length <= 100 && content.length >= 2;
  const busy = save.isPending || remove.isPending;

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!valid || busy) return;
    save.mutate(
      { id: notice?.id ?? null, body: { ...form, title, content } },
      {
        onSuccess: () => {
          toast(notice ? "공지를 고쳤어요" : "공지를 올렸어요");
          onClose();
        },
        onError: (error) => toast(apiErrorMessage(error, "저장하지 못했어요. 잠시 후 다시 시도해주세요")),
      },
    );
  }

  function destroy() {
    if (!notice || busy) return;
    if (!window.confirm("이 공지를 지울까요? 지우면 되돌릴 수 없어요")) return;
    remove.mutate(notice.id, {
      onSuccess: () => {
        toast("공지를 지웠어요");
        onClose();
      },
      onError: (error) => toast(apiErrorMessage(error, "지우지 못했어요. 잠시 후 다시 시도해주세요")),
    });
  }

  return (
    <form onSubmit={submit} className="rounded-[18px] border border-[#EFEFEF] p-5 md:p-7">
      <button type="button" onClick={onClose} className="-ml-1 mb-4 flex items-center gap-1 text-[14px] font-semibold text-sub md:hidden">
        <ChevronLeft size={18} /> 목록
      </button>
      <h2 className="text-[20px] font-extrabold tracking-[-0.04em]">{notice ? "공지 고치기" : "새 공지"}</h2>

      <p className="mt-5 text-[13.5px] font-bold">분류</p>
      <div className="mt-2 flex gap-1.5">
        {noticeCategories.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            aria-pressed={form.category === value}
            onClick={() => setForm((f) => ({ ...f, category: value }))}
            className={cn(
              "h-9 rounded-full border px-4 text-[13.5px] font-bold",
              form.category === value ? "border-ink bg-ink text-white" : "border-[#E4E4E4] text-[#444]",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <label htmlFor="notice-title" className="mt-5 block text-[13.5px] font-bold">
        제목
      </label>
      <input
        id="notice-title"
        value={form.title}
        onChange={(event) => setForm((f) => ({ ...f, title: event.target.value }))}
        maxLength={100}
        placeholder="예: 11월 10일 새벽 서버 점검 안내"
        className="mt-2 h-12 w-full rounded-[12px] border border-[#E1E1E1] px-3.5 text-[15px] outline-none placeholder:text-faint focus:border-ink"
      />

      <label htmlFor="notice-content" className="mt-5 block text-[13.5px] font-bold">
        내용
      </label>
      <textarea
        id="notice-content"
        value={form.content}
        onChange={(event) => setForm((f) => ({ ...f, content: event.target.value }))}
        maxLength={NOTICE_CONTENT_MAX}
        rows={12}
        className="mt-2 w-full resize-y rounded-[12px] border border-[#E1E1E1] px-3.5 py-3 text-[14.5px] leading-[1.65] outline-none focus:border-ink"
      />

      <label className="mt-4 flex cursor-pointer items-start gap-2.5">
        <input
          type="checkbox"
          checked={form.pinned}
          onChange={(event) => setForm((f) => ({ ...f, pinned: event.target.checked }))}
          className="mt-0.5 size-[18px] accent-ink"
        />
        <span>
          <span className="block text-[14px] font-bold">상단 고정</span>
          <span className="block text-[12.5px] text-sub">목록 맨 위에 두고, 가장 최근 고정 공지는 메인 상단 띠 배너로 보여요</span>
        </span>
      </label>

      <div className="mt-6 flex gap-2">
        {notice ? (
          <button
            type="button"
            onClick={destroy}
            disabled={busy}
            className="h-12 flex-1 rounded-full border border-[#E4E4E4] text-[15px] font-bold text-soon disabled:opacity-50"
          >
            삭제
          </button>
        ) : (
          <button type="button" onClick={onClose} className="h-12 flex-1 rounded-full border border-[#E4E4E4] text-[15px] font-bold">
            취소
          </button>
        )}
        <button
          type="submit"
          disabled={!valid || busy}
          className="h-12 flex-[2] rounded-full bg-ink text-[15px] font-bold text-white disabled:opacity-40"
        >
          {save.isPending ? "저장 중…" : notice ? "저장" : "올리기"}
        </button>
      </div>
    </form>
  );
}
