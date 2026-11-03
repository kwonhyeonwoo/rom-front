"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, Copy, ImageOff, RotateCw, X, ZoomIn, ZoomOut } from "lucide-react";

import { useReviewVerificationMutation } from "@/hooks/mutations/verification/useReviewVerificationMutation";
import { useAdminVerificationQuery } from "@/hooks/queries/verification/useAdminVerificationQuery";
import { useAdminVerificationsQuery } from "@/hooks/queries/verification/useAdminVerificationsQuery";
import {
  REJECT_REASON_MAX,
  REJECT_REASON_MIN,
  rejectTemplates,
  reviewTabs,
  type AdminVerificationDetail,
  type AdminVerificationItem,
  type ReviewStatus,
} from "@/lib/admin-verification";
import { apiErrorMessage } from "@/lib/api";
import { cn } from "@/lib/utils";
import { formatRequestedAt } from "@/lib/verification";
import { toast } from "@/stores/use-toast-store";

const statusChip: Record<ReviewStatus, { label: string; className: string }> = {
  PENDING: { label: "대기", className: "bg-[#FFF4E5] text-[#B25E00]" },
  APPROVED: { label: "승인", className: "bg-[#E6F2EF] text-brand" },
  REJECTED: { label: "반려", className: "bg-[#FDECEA] text-soon" },
};

// 면허 인증 요청을 보고 승인·반려하는 화면. 로그인과 로그아웃은 관리자 공통 틀(AdminShell)이 맡는다
export function AdminVerifications() {
  const [tab, setTab] = useState<ReviewStatus>("PENDING");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const list = useAdminVerificationsQuery(tab, true);

  const items = list.data ?? [];
  const selected = items.find((item) => item.id === selectedId) ?? null;

  // 처리한 뒤에는 같은 탭의 다음 요청을 바로 연다
  function afterReview(id: string) {
    const index = items.findIndex((item) => item.id === id);
    const next = items.filter((item) => item.id !== id)[index] ?? null;
    setSelectedId(next?.id ?? null);
  }

  return (
    <div>
      <div className={cn("flex flex-wrap items-end justify-between gap-3", selected && "hidden md:flex")}>
        <div>
          <h1 className="text-[24px] font-extrabold tracking-[-0.045em] md:text-[30px]">면허 인증 심사</h1>
          <p className="mt-1 text-[14px] text-sub">사진과 입력 정보가 맞는지 확인하고 승인하거나 반려해주세요</p>
        </div>
        <div role="tablist" className="flex gap-1 rounded-full bg-surface p-1">
          {reviewTabs.map(({ value, label }) => (
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
        <section className={cn(selected && "hidden md:block")} aria-label="요청 목록">
          <RequestList
            items={items}
            status={list.status}
            tab={tab}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </section>

        <section className={cn(!selected && "hidden md:block")} aria-label="요청 상세">
          {selected ? (
            <DetailPanel key={selected.id} item={selected} onBack={() => setSelectedId(null)} onReviewed={afterReview} />
          ) : (
            <div className="flex h-[420px] items-center justify-center rounded-[18px] border border-dashed border-[#E4E4E4] text-[15px] text-sub">
              왼쪽 목록에서 요청을 고르세요
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function RequestList({
  items,
  status,
  tab,
  selectedId,
  onSelect,
}: {
  items: AdminVerificationItem[];
  status: "pending" | "error" | "success";
  tab: ReviewStatus;
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  if (status === "pending") {
    return (
      <div className="space-y-2" aria-busy>
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="skeleton h-[76px] rounded-[14px]" />
        ))}
      </div>
    );
  }
  if (status === "error") {
    return (
      <p role="alert" className="py-16 text-center text-[15px] text-sub">
        목록을 불러오지 못했어요. 잠시 후 다시 시도해주세요.
      </p>
    );
  }
  if (items.length === 0) {
    return (
      <p className="py-16 text-center text-[15px] text-sub">
        {tab === "PENDING" ? "기다리는 요청이 없어요" : "처리한 요청이 없어요"}
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item.id}>
          <button
            onClick={() => onSelect(item.id)}
            aria-current={item.id === selectedId}
            className={cn(
              "flex w-full items-center justify-between gap-3 rounded-[14px] border px-4 py-3.5 text-left transition-colors",
              item.id === selectedId ? "border-ink bg-white" : "border-[#EFEFEF] hover:border-[#D6D6D6]",
            )}
          >
            <div className="min-w-0">
              <p className="truncate text-[15.5px] font-bold">
                {item.name}
                <span className="ml-2 text-[13px] font-medium text-faint">···{item.licenseLast4}</span>
              </p>
              <p className="mt-0.5 truncate text-[13px] text-sub">
                {item.field} · {item.acquiredYear}년 취득
              </p>
            </div>
            <div className="shrink-0 text-right text-[12.5px] text-faint">
              <p>요청 {formatRequestedAt(item.requestedAt)}</p>
              {item.reviewedAt && <p className="mt-0.5">처리 {formatRequestedAt(item.reviewedAt)}</p>}
            </div>
          </button>
        </li>
      ))}
    </ul>
  );
}

function DetailPanel({
  item,
  onBack,
  onReviewed,
}: {
  item: AdminVerificationItem;
  onBack: () => void;
  onReviewed: (id: string) => void;
}) {
  const detail = useAdminVerificationQuery(item.id);
  const chip = statusChip[item.status];

  return (
    <div className="rounded-[18px] border border-[#EFEFEF] p-5 md:p-7">
      <button onClick={onBack} className="-ml-1 mb-4 flex items-center gap-1 text-[14px] font-semibold text-sub md:hidden">
        <ChevronLeft size={18} /> 목록
      </button>

      <div className="flex flex-wrap items-center gap-2.5">
        <h2 className="text-[22px] font-extrabold tracking-[-0.04em]">{item.name}</h2>
        <span className={cn("inline-flex h-6 items-center rounded-md px-2 text-[12.5px] font-bold", chip.className)}>
          {chip.label}
        </span>
        <span className="text-[13px] text-faint">요청 {formatRequestedAt(item.requestedAt)}</span>
      </div>

      {detail.isPending ? (
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]" aria-busy>
          <div className="skeleton aspect-[4/3] rounded-[14px]" />
          <div className="skeleton h-48 rounded-[14px]" />
        </div>
      ) : detail.isError ? (
        <p role="alert" className="py-16 text-center text-[15px] text-sub">
          {apiErrorMessage(detail.error, "요청을 불러오지 못했어요. 잠시 후 다시 시도해주세요.")}
        </p>
      ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
          <LicensePhoto url={detail.data.imageUrl} />
          <div>
            <LicenseInfo detail={detail.data} />
            {item.status === "PENDING" && <ReviewActions id={item.id} onReviewed={onReviewed} />}
          </div>
        </div>
      )}
    </div>
  );
}

function LicenseInfo({ detail }: { detail: AdminVerificationDetail }) {
  function copy() {
    navigator.clipboard.writeText(detail.licenseNumber).then(
      () => toast("면허번호를 복사했어요"),
      () => toast("복사하지 못했어요"),
    );
  }

  const rows = [
    { label: "이름", value: detail.name },
    { label: "취득 연도", value: `${detail.acquiredYear}년` },
    { label: "주 분야", value: detail.field },
  ];

  return (
    <dl className="rounded-[14px] bg-surface px-4 py-3 text-[14.5px]">
      <div className="flex items-center justify-between gap-3 border-b border-[#E8E8E6] py-2.5">
        <dt className="text-sub">면허번호</dt>
        <dd className="flex items-center gap-1.5 font-bold tabular-nums">
          제 {detail.licenseNumber} 호
          <button onClick={copy} aria-label="면허번호 복사" className="rounded p-1 text-faint hover:text-ink">
            <Copy size={14} />
          </button>
        </dd>
      </div>
      {rows.map((row) => (
        <div key={row.label} className="flex items-center justify-between gap-3 border-b border-[#E8E8E6] py-2.5 last:border-0">
          <dt className="text-sub">{row.label}</dt>
          <dd className="font-bold">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function LicensePhoto({ url }: { url: string | null }) {
  const [open, setOpen] = useState(false);

  if (!url) {
    return (
      <div className="flex aspect-[4/3] flex-col items-center justify-center gap-2 rounded-[14px] bg-surface text-[14px] text-sub">
        <ImageOff size={22} />
        검토가 끝나 사진을 지웠어요
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="group relative block aspect-[4/3] w-full overflow-hidden rounded-[14px] bg-[#1A1A1A]"
        aria-label="면허증 사진 크게 보기"
      >
        {/* 서명된 Storage 주소라 next/image 최적화를 거치지 않는다 */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={url} alt="면허증 사진" className="size-full object-contain" />
        <span className="absolute right-3 bottom-3 flex items-center gap-1 rounded-full bg-black/60 px-3 py-1.5 text-[12.5px] font-semibold text-white">
          <ZoomIn size={14} /> 크게 보기
        </span>
      </button>
      {open && <PhotoViewer url={url} onClose={() => setOpen(false)} />}
    </>
  );
}

// 전체 화면 사진 보기: 확대(1~3배), 회전, Esc로 닫기
function PhotoViewer({ url, onClose }: { url: string; onClose: () => void }) {
  const [zoom, setZoom] = useState(1);
  const [rotate, setRotate] = useState(0);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [onClose]);

  const tool = "flex size-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 disabled:opacity-40";

  return (
    <div role="dialog" aria-modal aria-label="면허증 사진" className="fixed inset-0 z-50 flex flex-col bg-black/90">
      <div className="flex items-center justify-end gap-2 p-3">
        <button className={tool} onClick={() => setZoom((z) => Math.max(1, z - 0.5))} disabled={zoom <= 1} aria-label="축소">
          <ZoomOut size={18} />
        </button>
        <span className="w-12 text-center text-[13px] font-semibold text-white tabular-nums">{Math.round(zoom * 100)}%</span>
        <button className={tool} onClick={() => setZoom((z) => Math.min(3, z + 0.5))} disabled={zoom >= 3} aria-label="확대">
          <ZoomIn size={18} />
        </button>
        <button className={tool} onClick={() => setRotate((r) => (r + 90) % 360)} aria-label="회전">
          <RotateCw size={18} />
        </button>
        <button className={cn(tool, "ml-2")} onClick={onClose} aria-label="닫기">
          <X size={20} />
        </button>
      </div>
      <div className="flex-1 overflow-auto" onClick={(event) => event.target === event.currentTarget && onClose()}>
        <div
          className="flex min-h-full min-w-full items-center justify-center p-4"
          style={{ width: `${zoom * 100}%`, height: `${zoom * 100}%` }}
          onClick={(event) => event.target === event.currentTarget && onClose()}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt="면허증 사진"
            onClick={() => setZoom((z) => (z === 1 ? 2 : 1))}
            className={cn("max-h-full max-w-full object-contain", zoom === 1 ? "cursor-zoom-in" : "cursor-zoom-out")}
            style={{ transform: `rotate(${rotate}deg)` }}
          />
        </div>
      </div>
    </div>
  );
}

function ReviewActions({ id, onReviewed }: { id: string; onReviewed: (id: string) => void }) {
  const review = useReviewVerificationMutation();
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");
  const trimmed = reason.trim();
  const reasonValid = trimmed.length >= REJECT_REASON_MIN && trimmed.length <= REJECT_REASON_MAX;

  function run(decision: Parameters<typeof review.mutate>[0], done: string) {
    review.mutate(decision, {
      onSuccess: () => {
        toast(done);
        onReviewed(id);
      },
      onError: (error) => toast(apiErrorMessage(error, "처리하지 못했어요. 잠시 후 다시 시도해주세요")),
    });
  }

  function approve() {
    if (review.isPending) return;
    if (!window.confirm("이 면허 인증을 승인할까요? 승인하면 사진이 지워지고 되돌릴 수 없어요")) return;
    run({ id, action: "approve" }, "승인했어요");
  }

  function reject(event: React.FormEvent) {
    event.preventDefault();
    if (!reasonValid || review.isPending) return;
    run({ id, action: "reject", reason: trimmed }, "반려했어요. 회원에게 사유가 보여요");
  }

  if (!rejecting) {
    return (
      <div className="mt-5 flex gap-2">
        <button
          onClick={() => setRejecting(true)}
          disabled={review.isPending}
          className="h-12 flex-1 rounded-full border border-[#E4E4E4] text-[15px] font-bold disabled:opacity-50"
        >
          반려
        </button>
        <button
          onClick={approve}
          disabled={review.isPending}
          className="h-12 flex-[2] rounded-full bg-brand text-[15px] font-bold text-white disabled:opacity-50"
        >
          {review.isPending ? "처리 중…" : "승인"}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={reject} className="mt-5">
      <p className="text-[13.5px] font-bold">반려 사유</p>
      <p className="mt-0.5 text-[12.5px] text-sub">회원의 인증 화면에 그대로 보여요</p>
      <div className="mt-2.5 flex flex-col gap-1.5">
        {rejectTemplates.map((template) => (
          <button
            key={template}
            type="button"
            onClick={() => setReason(template)}
            className={cn(
              "rounded-[10px] border px-3 py-2 text-left text-[13px] leading-[1.45]",
              reason === template ? "border-ink bg-white font-semibold" : "border-[#EAEAEA] text-[#444] hover:border-[#CFCFCF]",
            )}
          >
            {template}
          </button>
        ))}
      </div>
      <textarea
        value={reason}
        onChange={(event) => setReason(event.target.value)}
        maxLength={REJECT_REASON_MAX}
        rows={3}
        placeholder="직접 입력하거나 위에서 고른 뒤 고쳐주세요"
        className="mt-2.5 w-full resize-none rounded-[12px] border border-[#E1E1E1] px-3.5 py-3 text-[14px] outline-none placeholder:text-faint focus:border-ink"
      />
      <p className="text-right text-[12px] text-faint tabular-nums">
        {trimmed.length}/{REJECT_REASON_MAX}
      </p>
      <div className="mt-2 flex gap-2">
        <button
          type="button"
          onClick={() => setRejecting(false)}
          className="h-12 flex-1 rounded-full border border-[#E4E4E4] text-[15px] font-bold"
        >
          취소
        </button>
        <button
          type="submit"
          disabled={!reasonValid || review.isPending}
          className="h-12 flex-[2] rounded-full bg-soon text-[15px] font-bold text-white disabled:opacity-40"
        >
          {review.isPending ? "처리 중…" : "반려하기"}
        </button>
      </div>
    </form>
  );
}
