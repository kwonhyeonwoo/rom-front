"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ExternalLink, MessageCircle, FileText, UserX } from "lucide-react";

import { useReportActionMutation } from "@/hooks/mutations/admin/useReportActionMutation";
import { useAdminReportQuery } from "@/hooks/queries/admin/useAdminReportQuery";
import { useAdminReportsQuery } from "@/hooks/queries/admin/useAdminReportsQuery";
import { apiErrorMessage } from "@/lib/api";
import { boardLabel, type Board } from "@/lib/community";
import {
  providerLabel,
  reportReasonLabel,
  reportTabs,
  resolutionLabel,
  sanctionOptions,
  targetStateChip,
  type AdminReportDetail,
  type AdminReportGroup,
  type MemberAccount,
  type ReportFilter,
  type Sanction,
} from "@/lib/report";
import { cn } from "@/lib/utils";
import { formatRequestedAt } from "@/lib/verification";
import { toast } from "@/stores/use-toast-store";

const chipClass = "inline-flex h-6 shrink-0 items-center rounded-md px-2 text-[12.5px] font-bold";

const verifyLabel = { PENDING: "심사 중", APPROVED: "인증 완료", REJECTED: "반려" } as const;

// 커뮤니티 신고를 보고 숨기거나 반려하는 화면. 같은 글·댓글의 신고는 한 줄로 묶는다.
// 로그인과 로그아웃은 관리자 공통 틀(AdminShell)이 맡는다
export function AdminReports() {
  const [tab, setTab] = useState<ReportFilter>("PENDING");
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const list = useAdminReportsQuery(tab);

  const items = list.data ?? [];
  const selected = items.find((item) => item.key === selectedKey) ?? null;

  // 대기 탭에서 처리하면 목록에서 빠지므로 다음 신고를 바로 연다
  function afterAction(key: string) {
    if (tab !== "PENDING") return;
    const index = items.findIndex((item) => item.key === key);
    const next = items.filter((item) => item.key !== key)[index] ?? null;
    setSelectedKey(next?.key ?? null);
  }

  return (
    <div>
      <div className={cn("flex flex-wrap items-end justify-between gap-3", selected && "hidden md:flex")}>
        <div>
          <h1 className="text-[24px] font-extrabold tracking-[-0.045em] md:text-[30px]">신고 관리</h1>
          <p className="mt-1 text-[14px] text-sub">신고된 글·댓글을 확인하고 숨기거나 반려해주세요. 처리 결과는 신고자에게 알림으로 가요</p>
        </div>
        <div role="tablist" className="flex gap-1 rounded-full bg-surface p-1">
          {reportTabs.map(({ value, label }) => (
            <button
              key={value}
              role="tab"
              aria-selected={tab === value}
              onClick={() => {
                setTab(value);
                setSelectedKey(null);
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
        <section className={cn(selected && "hidden md:block")} aria-label="신고 목록">
          <ReportList items={items} status={list.status} tab={tab} selectedKey={selectedKey} onSelect={setSelectedKey} />
        </section>

        <section className={cn(!selected && "hidden md:block")} aria-label="신고 상세">
          {selected ? (
            <DetailPanel key={selected.key} item={selected} onBack={() => setSelectedKey(null)} onDone={afterAction} />
          ) : (
            <div className="flex h-[420px] items-center justify-center rounded-[18px] border border-dashed border-[#E4E4E4] text-[15px] text-sub">
              왼쪽 목록에서 신고를 고르세요
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function ReportList({
  items,
  status,
  tab,
  selectedKey,
  onSelect,
}: {
  items: AdminReportGroup[];
  status: "pending" | "error" | "success";
  tab: ReportFilter;
  selectedKey: string | null;
  onSelect: (key: string) => void;
}) {
  if (status === "pending") {
    return (
      <div className="space-y-2" aria-busy>
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="skeleton h-[92px] rounded-[14px]" />
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
        {tab === "PENDING" ? "기다리는 신고가 없어요" : "처리한 신고가 없어요"}
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {items.map((item) => {
        const state = targetStateChip[item.state];
        return (
          <li key={item.key}>
            <button
              onClick={() => onSelect(item.key)}
              aria-current={item.key === selectedKey}
              className={cn(
                "w-full rounded-[14px] border px-4 py-3.5 text-left transition-colors",
                item.key === selectedKey ? "border-ink bg-white" : "border-[#EFEFEF] hover:border-[#D6D6D6]",
              )}
            >
              <div className="flex items-center gap-1.5 text-[12px] font-bold">
                <span className="inline-flex items-center gap-1 text-sub">
                  {item.targetType === "POST" ? <FileText size={13} /> : <MessageCircle size={13} />}
                  {item.targetType === "POST" ? "글" : "댓글"}
                </span>
                {item.state !== "VISIBLE" && (
                  <span className={cn("inline-flex h-5 items-center rounded px-1.5 text-[11px]", state.className)}>{state.label}</span>
                )}
                {item.byOperator && <span className="inline-flex h-5 items-center rounded bg-ink px-1.5 text-[11px] text-white">운영팀</span>}
                <span className="ml-auto text-soon tabular-nums">신고 {item.reportCount}</span>
              </div>
              <p className="mt-1.5 truncate text-[15px] font-bold">
                {item.targetType === "POST" ? (item.title ?? "(내용 삭제됨)") : item.excerpt || "(내용 삭제됨)"}
              </p>
              <p className="mt-0.5 truncate text-[13px] text-sub">
                {item.reasons.map((r) => `${reportReasonLabel(r.reason)}${r.count > 1 ? ` ${r.count}` : ""}`).join(" · ")}
              </p>
              <p className="mt-1 text-[12px] text-faint">
                {tab === "PENDING"
                  ? `최근 신고 ${formatRequestedAt(item.lastReportedAt)}`
                  : `${item.resolution ? resolutionLabel[item.resolution] : "처리"} ${formatRequestedAt(item.resolvedAt)} · ${item.resolvedBy ?? ""}`}
              </p>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function DetailPanel({
  item,
  onBack,
  onDone,
}: {
  item: AdminReportGroup;
  onBack: () => void;
  onDone: (key: string) => void;
}) {
  const detail = useAdminReportQuery(item.targetType, item.targetId);
  const data = detail.data;
  const state = targetStateChip[data?.state ?? item.state];

  return (
    <div className="rounded-[18px] border border-[#EFEFEF] p-5 md:p-7">
      <button onClick={onBack} className="-ml-1 mb-4 flex items-center gap-1 text-[14px] font-semibold text-sub md:hidden">
        <ChevronLeft size={18} /> 목록
      </button>

      <div className="flex flex-wrap items-center gap-2.5">
        <h2 className="text-[22px] font-extrabold tracking-[-0.04em]">{item.targetType === "POST" ? "글 신고" : "댓글 신고"}</h2>
        <span className={cn(chipClass, state.className)}>{state.label}</span>
        <span className="text-[13px] text-faint">
          신고 {item.reportCount}건 · 처음 {formatRequestedAt(item.firstReportedAt)}
        </span>
      </div>

      {detail.isPending ? (
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]" aria-busy>
          <div className="skeleton h-72 rounded-[14px]" />
          <div className="skeleton h-72 rounded-[14px]" />
        </div>
      ) : detail.isError || !data ? (
        <p role="alert" className="py-16 text-center text-[15px] text-sub">
          {apiErrorMessage(detail.error, "신고를 불러오지 못했어요. 잠시 후 다시 시도해주세요.")}
        </p>
      ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="min-w-0 space-y-6">
            <TargetContent data={data} />
            <ReportHistory data={data} />
          </div>
          <div className="space-y-4">
            <AuthorCard data={data} />
            <Actions data={data} onDone={() => onDone(item.key)} />
          </div>
        </div>
      )}
    </div>
  );
}

// 신고 대상 내용. 작성자가 지웠으면 신고 당시 내용을 보여준다
function TargetContent({ data }: { data: AdminReportDetail }) {
  const { target } = data;
  const deleted = data.state === "DELETED";
  return (
    <div>
      <p className="text-[13.5px] font-bold">{data.targetType === "POST" ? "신고된 글" : "신고된 댓글"}</p>
      <div className="mt-2 rounded-[14px] bg-surface px-4 py-4">
        {data.targetType === "COMMENT" && target.title && (
          <p className="mb-2 truncate text-[12.5px] text-sub">글 「{target.title}」에 단 댓글</p>
        )}
        <div className="flex flex-wrap items-center gap-1.5 text-[12.5px] text-sub">
          {target.board && (
            <span className="rounded bg-white px-1.5 py-0.5 font-semibold">{boardLabel(target.board as Board)}</span>
          )}
          <span className="font-semibold text-ink">{target.authorName}</span>
          {target.byOperator && <span className="rounded bg-ink px-1.5 py-0.5 text-[11px] font-bold text-white">운영팀</span>}
          {target.createdAt && <span>· {formatRequestedAt(target.createdAt)}</span>}
        </div>
        {data.targetType === "POST" && target.title && (
          <p className="mt-2 text-[17px] leading-[1.4] font-extrabold tracking-[-0.03em]">{target.title}</p>
        )}
        {target.content ? (
          <p className="mt-2 max-h-[320px] overflow-y-auto text-[14.5px] leading-[1.65] break-words whitespace-pre-line">
            {target.content}
          </p>
        ) : (
          <p className="mt-2 text-[14px] text-faint">작성자가 탈퇴해 내용을 지웠어요</p>
        )}
        {target.images.length > 0 && (
          <div className="mt-3 flex gap-2 overflow-x-auto">
            {target.images.map((url) => (
              <a key={url} href={url} target="_blank" rel="noreferrer" className="shrink-0">
                {/* 공개 버킷 주소라 next/image 최적화를 거치지 않는다 */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="글 사진" className="size-20 rounded-[10px] object-cover" />
              </a>
            ))}
          </div>
        )}
        {deleted && <p className="mt-3 text-[12.5px] text-faint">작성자가 지운 {data.targetType === "POST" ? "글" : "댓글"}이라 신고 당시 내용이에요</p>}
      </div>
      {!deleted && (
        <Link
          href={`/community/${data.postId}`}
          target="_blank"
          className="mt-2 inline-flex items-center gap-1 text-[13px] font-semibold text-sub hover:text-ink"
        >
          사이트에서 글 보기 <ExternalLink size={13} />
        </Link>
      )}
    </div>
  );
}

function ReportHistory({ data }: { data: AdminReportDetail }) {
  return (
    <div>
      <p className="text-[13.5px] font-bold">
        신고 내역 <span className="font-medium text-faint">{data.reports.length}건</span>
      </p>
      <p className="mt-0.5 text-[12.5px] text-sub">신고자 정보는 관리자에게만 보여요. 작성자에게는 알려지지 않아요</p>
      <ul className="mt-2.5 space-y-2">
        {data.reports.map((report) => (
          <li key={report.id} className="rounded-[12px] border border-[#EFEFEF] px-3.5 py-3">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className={cn(chipClass, report.reason === "PRIVACY" ? "bg-[#FDECEA] text-soon" : "bg-surface text-ink")}>
                {reportReasonLabel(report.reason)}
              </span>
              {report.status === "RESOLVED" && report.resolution && (
                <span className="text-[12px] font-semibold text-faint">{resolutionLabel[report.resolution]}</span>
              )}
              <span className="ml-auto text-[12px] text-faint">{formatRequestedAt(report.createdAt)}</span>
            </div>
            {report.detail && <p className="mt-2 text-[14px] leading-[1.55] whitespace-pre-line">{report.detail}</p>}
            <div className="mt-2 text-[12.5px] text-sub">
              {report.reporter ? (
                <>
                  <AccountLine account={report.reporter.account} />
                  <span className="mt-0.5 block text-faint">
                    이 회원의 신고 {report.reporter.total}건 · 반려 {report.reporter.dismissed}건
                  </span>
                </>
              ) : (
                <span className="inline-flex items-center gap-1 text-faint">
                  <UserX size={13} /> 탈퇴한 회원
                </span>
              )}
            </div>
            {report.resolveNote && <p className="mt-1.5 text-[12.5px] text-faint">메모: {report.resolveNote}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}

// 이메일 · 가입 방식 · 소셜 이름
function AccountLine({ account }: { account: MemberAccount | null }) {
  if (!account || !account.exists) return <span className="text-faint">계정 정보를 찾지 못했어요</span>;
  return (
    <span className="block break-all">
      <b className="font-semibold text-ink">{account.email ?? "이메일 없음"}</b>
      {" · "}
      {providerLabel(account.provider)}
      {account.name && ` · ${account.name}`}
      {account.operator && " · 운영 계정"}
    </span>
  );
}

function AuthorCard({ data }: { data: AdminReportDetail }) {
  const author = data.author;
  if (!author) {
    return (
      <div className="rounded-[14px] bg-surface px-4 py-4 text-[14px] text-sub">
        <p className="text-[13.5px] font-bold text-ink">작성자</p>
        <p className="mt-2 flex items-center gap-1.5">
          <UserX size={15} /> 탈퇴한 회원이에요
        </p>
      </div>
    );
  }
  const account = author.account;
  const rows: { label: string; value: string }[] = account?.exists
    ? [
        { label: "이메일", value: account.email ?? "없음" },
        { label: "가입 방식", value: providerLabel(account.provider) },
        { label: "이름", value: account.name ?? "-" },
        { label: "가입일", value: account.joinedAt ? formatRequestedAt(account.joinedAt).split(" ")[0] : "-" },
        {
          label: "면허 인증",
          value: account.verification
            ? `${verifyLabel[account.verification.status]} · ${account.verification.name}`
            : "요청 안 함",
        },
        { label: "휴대폰", value: account.phoneMasked ?? "-" },
      ]
    : [];

  return (
    <div className="rounded-[14px] bg-surface px-4 py-3 text-[14px]">
      <p className="flex items-center gap-1.5 pt-1 text-[13.5px] font-bold">
        작성자 계정
        {account?.operator && <span className="rounded bg-ink px-1.5 py-0.5 text-[11px] text-white">운영 계정</span>}
      </p>
      {account?.exists ? (
        <dl className="mt-1">
          {rows.map((row) => (
            <div key={row.label} className="flex items-center justify-between gap-3 border-b border-[#E8E8E6] py-2">
              <dt className="shrink-0 text-sub">{row.label}</dt>
              <dd className="min-w-0 truncate text-right font-bold" title={row.value}>
                {row.value}
              </dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className="mt-2 text-[13px] text-faint">계정 정보를 찾지 못했어요</p>
      )}
      <div className="grid grid-cols-2 gap-2 py-3">
        <Stat label="받은 신고" value={author.reportCount} />
        <Stat label="숨김 처리" value={author.hiddenCount} />
      </div>
      {author.suspendedUntil && (
        <p className="mb-2 rounded-[10px] bg-[#FDECEA] px-3 py-2 text-[12.5px] font-semibold text-soon">
          {formatRequestedAt(author.suspendedUntil)}까지 쓰기 제한 중
        </p>
      )}
      {author.sanctions.length > 0 && (
        <div className="pb-2">
          <p className="text-[12.5px] font-bold text-sub">제재 기록</p>
          <ul className="mt-1 space-y-1 text-[12.5px] text-sub">
            {author.sanctions.map((s) => (
              <li key={s.id}>
                {formatRequestedAt(s.createdAt).split(" ")[0]} {s.kind === "WARNING" ? "경고" : `쓰기 제한(~${formatRequestedAt(s.until).split(" ")[0]})`} · {s.createdBy}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[10px] bg-white px-3 py-2">
      <p className="text-[12px] text-sub">{label}</p>
      <p className={cn("text-[18px] font-extrabold tabular-nums", value >= 3 && "text-soon")}>{value}</p>
    </div>
  );
}

function Actions({ data, onDone }: { data: AdminReportDetail; onDone: () => void }) {
  const action = useReportActionMutation();
  const [hiding, setHiding] = useState(false);
  const [sanction, setSanction] = useState<Sanction>("NONE");
  const [note, setNote] = useState("");
  const target = { type: data.targetType, id: data.targetId };
  const deleted = data.state === "DELETED";
  const hidden = data.state === "HIDDEN" || data.state === "REVIEWING";
  const pending = data.pendingCount > 0;

  function run(body: Parameters<typeof action.mutate>[0], done: string, next = true) {
    action.mutate(body, {
      onSuccess: () => {
        toast(done);
        setHiding(false);
        if (next) onDone();
      },
      onError: (error) => toast(apiErrorMessage(error, "처리하지 못했어요. 잠시 후 다시 시도해주세요")),
    });
  }

  function dismiss() {
    if (action.isPending) return;
    const message = deleted
      ? "이미 지워진 대상이에요. 신고를 닫을까요?"
      : data.state === "REVIEWING"
        ? "반려하면 자동으로 숨겨 둔 글이 다시 보여요. 반려할까요?"
        : "위반이 아니라고 보고 반려할까요? 신고자에게 결과가 알림으로 가요";
    if (!window.confirm(message)) return;
    run({ ...target, action: "dismiss", note: note.trim() || undefined }, deleted ? "신고를 닫았어요" : "반려했어요");
  }

  function hide(event: React.FormEvent) {
    event.preventDefault();
    if (action.isPending) return;
    run(
      { ...target, action: "hide", sanction, note: note.trim() || undefined },
      pending ? "숨김 처리했어요. 신고자와 작성자에게 알림이 가요" : "숨겼어요",
      pending,
    );
  }

  function restore() {
    if (action.isPending || !window.confirm("숨김을 풀어 다시 모두에게 보이게 할까요?")) return;
    run({ ...target, action: "restore" }, "다시 보이게 했어요", false);
  }

  if (!pending && hidden) {
    return (
      <div>
        <p className="text-[12.5px] text-sub">처리가 끝난 신고예요. 잘못 숨겼다면 다시 보이게 할 수 있어요</p>
        <button
          onClick={restore}
          disabled={action.isPending}
          className="mt-2 h-12 w-full rounded-full border border-[#E4E4E4] text-[15px] font-bold disabled:opacity-50"
        >
          숨김 해제
        </button>
      </div>
    );
  }
  if (!pending && deleted) return null;
  if (deleted) {
    return (
      <button
        onClick={dismiss}
        disabled={action.isPending}
        className="h-12 w-full rounded-full bg-ink text-[15px] font-bold text-white disabled:opacity-50"
      >
        {action.isPending ? "처리 중…" : "신고 닫기"}
      </button>
    );
  }

  if (!hiding) {
    return (
      <div className="flex gap-2">
        {pending && (
          <button
            onClick={dismiss}
            disabled={action.isPending}
            className="h-12 flex-1 rounded-full border border-[#E4E4E4] text-[15px] font-bold disabled:opacity-50"
          >
            반려
          </button>
        )}
        <button
          onClick={() => setHiding(true)}
          disabled={action.isPending}
          className="h-12 flex-[2] rounded-full bg-soon text-[15px] font-bold text-white disabled:opacity-50"
        >
          {data.state === "REVIEWING" ? "숨김 확정" : "숨김 처리"}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={hide}>
      <p className="text-[13.5px] font-bold">작성자 제재</p>
      <p className="mt-0.5 text-[12.5px] text-sub">
        {data.target.byOperator ? "운영 계정 글이라 제재 없이 숨겨요" : "쓰기 제한은 글·댓글·공감·후기 쓰기를 막아요"}
      </p>
      {!data.target.byOperator && (
        <div className="mt-2.5 grid grid-cols-2 gap-1.5">
          {sanctionOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setSanction(option.value)}
              aria-pressed={sanction === option.value}
              className={cn(
                "rounded-[10px] border px-3 py-2 text-left",
                sanction === option.value ? "border-ink bg-white" : "border-[#EAEAEA] hover:border-[#CFCFCF]",
              )}
            >
              <span className="block text-[13.5px] font-bold">{option.label}</span>
              <span className="block text-[11.5px] text-sub">{option.hint}</span>
            </button>
          ))}
        </div>
      )}
      <textarea
        value={note}
        onChange={(event) => setNote(event.target.value)}
        maxLength={500}
        rows={2}
        placeholder="관리자 메모 (회원에게는 보이지 않아요)"
        className="mt-2.5 w-full resize-none rounded-[12px] border border-[#E1E1E1] px-3.5 py-3 text-[14px] outline-none placeholder:text-faint focus:border-ink"
      />
      <div className="mt-2 flex gap-2">
        <button type="button" onClick={() => setHiding(false)} className="h-12 flex-1 rounded-full border border-[#E4E4E4] text-[15px] font-bold">
          취소
        </button>
        <button
          type="submit"
          disabled={action.isPending}
          className="h-12 flex-[2] rounded-full bg-soon text-[15px] font-bold text-white disabled:opacity-40"
        >
          {action.isPending ? "처리 중…" : "숨기기"}
        </button>
      </div>
    </form>
  );
}
