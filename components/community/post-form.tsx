"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, CalendarClock, Check, Lightbulb, X } from "lucide-react";

import { Container } from "@/components/layout/container";
import { pillClass } from "@/components/search/filter-pill";
import { SeminarPoster } from "@/components/seminar/seminar-poster";
import { useCreatePostMutation } from "@/hooks/mutations/community/useCreatePostMutation";
import { useBookmarksQuery } from "@/hooks/queries/bookmark/useBookmarksQuery";
import { useUserQuery } from "@/hooks/queries/user/useUserQuery";
import { useSession } from "@/hooks/useSession";
import { useVerifyAccess } from "@/hooks/useVerifyAccess";
import { apiErrorMessage } from "@/lib/api";
import {
  POST_CONTENT_MAX,
  POST_CONTENT_MIN,
  POST_FIELDS,
  POST_FIELDS_MAX,
  POST_TITLE_MAX,
  OPERATOR_NAME,
  SCHEDULE_MAX_DAYS,
  boardGuides,
  boards,
  formatPublishAt,
  plainContent,
  previewName,
  type Board,
} from "@/lib/community";
import {
  clearDraft,
  formatSavedAt,
  loadDraft,
  saveDraft,
} from "@/lib/post-draft";
import { cn } from "@/lib/utils";
import { isVerificationRequired } from "@/lib/verification";
import { VerifyGate } from "@/components/verification/verify-gate";
import { toast } from "@/stores/use-toast-store";
import { CommunityLoginRequired, CommunitySkeleton } from "./login-required";
import { OperatorBadge } from "./post-badges";
import { PostEditor, type PostImage } from "./post-editor";
import { BoardTag } from "./post-item";

// <input type="datetime-local">은 브라우저 시간대 기준 "YYYY-MM-DDTHH:mm"
function toLocalInput(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

// 예약 시각이 지금보다 뒤이고 90일 안인지. 문제가 없으면 null
function scheduleProblem(date: Date | null) {
  if (date === null) return "게시할 날짜와 시간을 골라주세요";
  const now = Date.now();
  if (Number.isNaN(date.getTime()) || date.getTime() <= now)
    return "지금보다 뒤의 시간을 골라주세요";
  if (date.getTime() - now > SCHEDULE_MAX_DAYS * 86_400_000)
    return `예약은 ${SCHEDULE_MAX_DAYS}일 안으로만 할 수 있어요`;
  return null;
}

// 예약 시각 기본값: 다음 날 오전 9시
function tomorrowNine() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(9, 0, 0, 0);
  return toLocalInput(d);
}

export function PostForm() {
  const session = useSession();
  const { data: user } = useUserQuery(Boolean(session));
  const { access, verification, operator } = useVerifyAccess();

  if (session === undefined) return <CommunitySkeleton />;
  if (session === null) return <CommunityLoginRequired />;
  if (access === "LOADING") return <CommunitySkeleton />;
  // 글쓰기는 면허 인증을 마친 회원만. 서버도 한 번 더 막는다
  if (access !== "APPROVED")
    return <VerifyGate access={access} verification={verification} />;

  return (
    <PostFormBody
      userId={session.user.id}
      name={user?.name ?? session.user.email ?? null}
      operator={operator}
    />
  );
}

const check =
  "flex size-[18px] shrink-0 items-center justify-center rounded-full";

function PostFormBody({
  userId,
  name,
  operator,
}: {
  userId: string;
  name: string | null;
  operator: boolean;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const bookmarks = useBookmarksQuery(true);
  const create = useCreatePostMutation();

  // 이 브라우저에 임시저장한 글이 있으면 이어서 쓴다
  const [draft] = useState(() => loadDraft(userId));
  const [restored, setRestored] = useState(draft !== null);
  const [board, setBoard] = useState<Board>(
    draft?.board ??
      boards.find((b) => b.value === params.get("board"))?.value ??
      "FREE",
  );
  const [seminarId, setSeminarId] = useState<string | null>(
    draft?.seminarId ?? null,
  );
  const [picking, setPicking] = useState(false);
  const [fields, setFields] = useState<string[]>(draft?.fields ?? []);
  const [title, setTitle] = useState(draft?.title ?? "");
  const [content, setContent] = useState(draft?.content ?? "");
  const [images, setImages] = useState<PostImage[]>(draft?.images ?? []);
  const [privacyChecked, setPrivacyChecked] = useState(false);
  const [anonymous, setAnonymous] = useState(
    draft?.anonymous ?? board === "FREE",
  );
  const [savedAt, setSavedAt] = useState<number | null>(draft?.savedAt ?? null);
  // 운영 계정만: 예약 게시
  const [scheduling, setScheduling] = useState(false);
  const [publishAt, setPublishAt] = useState(tomorrowNine);

  const empty = title.trim() === "" && content.trim() === "" && !images.length;

  // 쓰는 동안 잠깐 멈추면 자동으로 임시저장한다
  useEffect(() => {
    if (create.isSuccess) return;
    const timer = setTimeout(() => {
      if (empty) return clearDraft(userId);
      const at = Date.now();
      if (
        saveDraft(userId, {
          board,
          seminarId,
          fields,
          title,
          content,
          images,
          anonymous,
          savedAt: at,
        })
      )
        setSavedAt(at);
    }, 800);
    return () => clearTimeout(timer);
  }, [
    userId,
    board,
    seminarId,
    fields,
    title,
    content,
    images,
    anonymous,
    empty,
    create.isSuccess,
  ]);

  // 후기에 연결할 수 있는 건 내가 저장하고 "들었어요"라고 답한 세미나
  const attended = (bookmarks.data ?? []).filter(
    (s) => s.attendance === "ATTENDED",
  );
  const selected = attended.find((s) => s.id === seminarId);
  const guide = boardGuides[board];
  const titleLength = title.trim().length;
  const contentLength = content.trim().length;
  const titleOk = titleLength >= 2 && titleLength <= POST_TITLE_MAX;
  const contentOk =
    contentLength >= POST_CONTENT_MIN && contentLength <= POST_CONTENT_MAX;
  const privacyOk = images.length === 0 || privacyChecked;
  const scheduleDate = scheduling && publishAt ? new Date(publishAt) : null;
  const scheduleError = scheduling ? scheduleProblem(scheduleDate) : null;
  const valid =
    titleOk && contentOk && privacyOk && !(operator && scheduleError);
  const shownName = operator ? OPERATOR_NAME : previewName(name, anonymous);

  function selectBoard(next: Board) {
    setBoard(next);
    if (next !== "REVIEW") setSeminarId(null);
    // 자유 게시판은 익명이 기본이다. 직접 바꾼 선택은 게시판을 옮겨도 그대로 둔다
    if (next === "FREE" && board !== "FREE" && empty) setAnonymous(true);
  }

  function toggleField(field: string) {
    setFields((list) =>
      list.includes(field)
        ? list.filter((f) => f !== field)
        : list.length < POST_FIELDS_MAX
          ? [...list, field]
          : list,
    );
  }

  function saveNow() {
    if (empty) return toast("제목이나 내용을 먼저 적어주세요");
    const at = Date.now();
    if (
      saveDraft(userId, {
        board,
        seminarId,
        fields,
        title,
        content,
        images,
        anonymous,
        savedAt: at,
      })
    ) {
      setSavedAt(at);
      toast("임시저장했어요. 이 브라우저에서 이어서 쓸 수 있어요");
    } else {
      toast("이 브라우저에서는 임시저장을 할 수 없어요");
    }
  }

  function startOver() {
    clearDraft(userId);
    setRestored(false);
    setSeminarId(null);
    setFields([]);
    setTitle("");
    setContent("");
    setImages([]);
    setPrivacyChecked(false);
    setSavedAt(null);
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!valid || create.isPending) return;
    create.mutate(
      {
        board,
        title: title.trim(),
        content: content.trim(),
        anonymous: operator ? false : anonymous,
        ...(seminarId && { seminarId }),
        ...(fields.length && { fields }),
        ...(images.length && { images: images.map((image) => image.path) }),
        ...(operator &&
          scheduleDate && { publishAt: scheduleDate.toISOString() }),
      },
      {
        onSuccess: ({ id, eventEntry, publishAt: scheduledAt }) => {
          clearDraft(userId);
          toast(
            scheduledAt
              ? `${formatPublishAt(scheduledAt)}에 게시되도록 예약했어요`
              : eventEntry
                ? "첫 글 이벤트에 참여했어요"
                : "글을 올렸어요",
          );
          router.replace(`/community/${id}`);
        },
        onError: (error) =>
          toast(
            isVerificationRequired(error)
              ? "면허 인증 후 글을 쓸 수 있어요"
              : apiErrorMessage(
                  error,
                  "글을 올리지 못했어요. 잠시 후 다시 시도해주세요",
                ),
            isVerificationRequired(error)
              ? { label: "인증하기", href: "/verify" }
              : undefined,
          ),
      },
    );
  }

  const submitLabel = create.isPending
    ? "올리는 중"
    : operator && scheduling
      ? "예약 등록"
      : "등록하기";

  return (
    <Container className="max-w-[1160px] pt-5 pb-10 md:pt-9 md:pb-16">
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-10">
        <form onSubmit={submit} className="min-w-0">
          <p className="hidden text-[13px] text-faint md:block">
            <Link href="/community" className="hover:text-ink">
              커뮤니티
            </Link>
            <span className="mx-1.5">›</span>글쓰기
          </p>
          <div className="flex items-end justify-between gap-3 md:mt-2">
            <h1 className="text-[26px] font-extrabold tracking-[-0.045em] md:text-[30px]">
              글쓰기
            </h1>
            {savedAt !== null && (
              <span className="mb-1 flex items-center gap-1 text-[12.5px] text-faint">
                <Check size={14} strokeWidth={2.6} className="text-brand" />
                {formatSavedAt(savedAt)} 임시저장됨
              </span>
            )}
          </div>
          {restored && (
            <p className="mt-3 flex flex-wrap items-center gap-x-2 rounded-[12px] bg-[#E8F0FE] px-3.5 py-2.5 text-[13px] text-[#1A56DB]">
              임시저장한 글을 불러왔어요.
              <button
                type="button"
                onClick={startOver}
                className="font-semibold underline underline-offset-2"
              >
                지우고 새로 쓰기
              </button>
            </p>
          )}

          <fieldset className="mt-6">
            <legend className="text-[15px] font-bold">게시판</legend>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {boards.map((b) => (
                <button
                  key={b.value}
                  type="button"
                  data-on={board === b.value}
                  onClick={() => selectBoard(b.value)}
                  className={pillClass}
                >
                  {b.label}
                </button>
              ))}
            </div>
            <div className="mt-3 rounded-[14px] bg-surface px-4 py-3.5 md:px-5 md:py-4">
              <p className="flex items-center gap-1.5 text-[14px] font-bold">
                <Lightbulb size={16} strokeWidth={2} className="text-brand" />
                {guide.title}
              </p>
              <ol className="mt-2 space-y-1">
                {guide.tips.map((tip, i) => (
                  <li
                    key={tip}
                    className="flex gap-2 text-[13.5px] text-[#444]"
                  >
                    <b className="w-3 shrink-0 font-bold text-brand">{i + 1}</b>
                    {tip}
                  </li>
                ))}
              </ol>
            </div>
          </fieldset>

          {board === "REVIEW" && (
            <div className="mt-7">
              <p className="text-[15px] font-bold">
                수강한 세미나 연결{" "}
                <span className="text-[13px] font-medium text-faint">선택</span>
              </p>
              {selected && !picking ? (
                <div className="mt-3 flex items-center gap-3 rounded-[14px] border border-[#EDEDED] px-3.5 py-3 md:gap-3.5 md:px-4">
                  <div className="shrink-0 overflow-hidden rounded-[8px]">
                    <SeminarPoster poster={selected.poster} width={48} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap gap-1">
                      {selected.ceRecognized && (
                        <span className={tag + " bg-[#E6F2EF] text-brand"}>
                          보수교육 인정
                        </span>
                      )}
                      <span className={tag + " bg-surface text-sub"}>
                        {selected.city}
                      </span>
                    </div>
                    <p className="truncate text-[14.5px] font-bold">
                      {selected.title}
                    </p>
                    <p className="truncate text-[12.5px] text-sub">
                      {selected.host} · {selected.schedule}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    {attended.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setPicking(true)}
                        className="h-8 rounded-full border border-[#DEDEDE] px-3 text-[12.5px] font-semibold hover:border-ink"
                      >
                        변경
                      </button>
                    )}
                    <button
                      type="button"
                      aria-label="연결 해제"
                      onClick={() => setSeminarId(null)}
                      className="p-1 text-faint hover:text-ink"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
              ) : attended.length > 0 ? (
                <div className="mt-3 max-h-56 overflow-y-auto rounded-[14px] border border-[#E4E4E4]">
                  {attended.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        setSeminarId(s.id);
                        setPicking(false);
                      }}
                      className="flex w-full items-center gap-3 border-b border-line px-3.5 py-3 text-left last:border-b-0 hover:bg-surface"
                    >
                      <div className="shrink-0 overflow-hidden rounded-[6px]">
                        <SeminarPoster poster={s.poster} width={36} />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-[14.5px] font-semibold">
                          {s.title}
                        </p>
                        <p className="truncate text-[12.5px] text-sub">
                          {s.host} · {s.schedule}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-[13.5px] leading-[1.6] text-sub">
                  저장하고 &quot;들었어요&quot;라고 답한 세미나가 있으면 여기서
                  연결할 수 있어요.{" "}
                  <Link
                    href="/mypage"
                    className="font-semibold text-ink underline underline-offset-2"
                  >
                    내 저장 목록 보기
                  </Link>
                </p>
              )}
            </div>
          )}

          <fieldset className="mt-7">
            <legend className="text-[15px] font-bold">
              분야{" "}
              <span className="text-[13px] font-medium text-faint">
                선택 · 최대 {POST_FIELDS_MAX}개
                <span className="hidden md:inline">
                  {" "}
                  · 같은 분야 사람들이 찾기 쉬워져요
                </span>
              </span>
            </legend>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {POST_FIELDS.map((field) => {
                const on = fields.includes(field);
                const full = !on && fields.length >= POST_FIELDS_MAX;
                return (
                  <button
                    key={field}
                    type="button"
                    aria-pressed={on}
                    disabled={full}
                    onClick={() => toggleField(field)}
                    className={cn(
                      "inline-flex h-8 items-center rounded-full border px-3 text-[13px] font-medium whitespace-nowrap transition-colors disabled:opacity-40",
                      on
                        ? "border-brand bg-[#EAF5F3] font-semibold text-brand"
                        : "border-[#E4E4E4] text-[#444] hover:border-ink",
                    )}
                  >
                    {field}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="mt-7">
            <label htmlFor="post-title" className="text-[15px] font-bold">
              제목
            </label>
            <div className="relative mt-3">
              <input
                id="post-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                maxLength={POST_TITLE_MAX}
                placeholder="제목을 입력해주세요"
                className="h-[52px] w-full rounded-[12px] border border-[#E1E1E1] pr-20 pl-4 text-base font-semibold outline-none placeholder:font-normal placeholder:text-faint focus:border-ink"
              />
              <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-[12.5px] text-faint">
                {titleLength} / {POST_TITLE_MAX}
              </span>
            </div>
          </div>

          <div className="mt-7">
            <p className="mb-3 text-[15px] font-bold">내용</p>
            <PostEditor
              value={content}
              onChange={setContent}
              template={guide.template}
              images={images}
              onImagesChange={(update) => {
                setImages(update);
                setPrivacyChecked(false);
              }}
            />
          </div>

          <div className="mt-3 rounded-[12px] bg-[#FFF6E5] px-3.5 py-3 text-[13px] leading-[1.55] text-[#8A5A00]">
            <p className="flex items-start gap-2.5">
              <AlertCircle
                size={17}
                strokeWidth={2}
                className="mt-0.5 shrink-0"
              />
              <span>
                환자 이름, 얼굴, 차트, 영상처럼 누구인지 알 수 있는 정보는
                올리지 말아주세요.
              </span>
            </p>
            {images.length > 0 && (
              <label className="mt-2.5 flex cursor-pointer items-center gap-2 border-t border-[#F3E3C3] pt-2.5 pl-[27px] font-semibold">
                <input
                  type="checkbox"
                  checked={privacyChecked}
                  onChange={(event) => setPrivacyChecked(event.target.checked)}
                  className="size-4 accent-[#8A5A00]"
                />
                사진 속 환자 얼굴, 이름, 차트를 가렸는지 확인했어요
              </label>
            )}
          </div>

          {operator ? (
            <OperatorOptions
              scheduling={scheduling}
              onScheduling={setScheduling}
              publishAt={publishAt}
              onPublishAt={setPublishAt}
              error={scheduleError}
            />
          ) : (
            <div className="mt-6 flex items-center justify-between gap-4 rounded-[14px] bg-surface px-4 py-3.5">
              <div className="min-w-0">
                <label
                  htmlFor="post-anonymous"
                  className="text-[14.5px] font-bold"
                >
                  익명으로 쓰기
                </label>
                <p className="mt-0.5 truncate text-[12.5px] text-sub">
                  다른 사람에게 <b className="text-ink">{shownName}</b>로 보여요
                </p>
              </div>
              <button
                id="post-anonymous"
                type="button"
                role="switch"
                aria-checked={anonymous}
                onClick={() => setAnonymous((value) => !value)}
                className={`relative h-6 w-10 shrink-0 rounded-full transition-colors ${anonymous ? "bg-brand" : "bg-[#CFCFCF]"}`}
              >
                <span
                  className={`absolute top-[3px] size-[18px] rounded-full bg-white transition-all ${anonymous ? "left-[19px]" : "left-[3px]"}`}
                />
              </button>
            </div>
          )}

          <div className="mt-7 flex items-center justify-between gap-3 md:border-t md:border-line md:pt-5">
            <span className="hidden text-[13px] text-faint md:inline">
              작성 중인 글은 자동으로 임시저장돼요
            </span>
            <div className="flex w-full gap-2 md:w-auto">
              <button
                type="button"
                onClick={saveNow}
                className="inline-flex h-12 flex-1 items-center justify-center rounded-full border border-[#DEDEDE] bg-white px-6 text-[15px] font-semibold md:flex-none"
              >
                임시저장
              </button>
              <button
                type="submit"
                disabled={!valid || create.isPending}
                className="inline-flex h-12 flex-[2] items-center justify-center rounded-full bg-ink px-8 text-[15px] font-bold text-white disabled:bg-[#CFCFCF] md:flex-none md:px-10"
              >
                {submitLabel}
              </button>
            </div>
          </div>
        </form>

        <aside className="hidden lg:block">
          <div className="sticky top-24 mt-[92px] space-y-4">
            <div className="rounded-[16px] border border-[#EDEDED] px-5 py-[18px]">
              <p className="mb-3 text-[14px] font-bold">
                목록에서 이렇게 보여요
              </p>
              <div className="rounded-[12px] border border-line p-3.5">
                <div className="flex flex-wrap items-center gap-1">
                  <BoardTag board={board} />
                  {fields.map((field) => (
                    <span
                      key={field}
                      className={tag + " bg-[#E6F2EF] text-brand"}
                    >
                      {field}
                    </span>
                  ))}
                </div>
                <p
                  className={cn(
                    "mt-1.5 line-clamp-2 text-[14.5px] leading-[1.4] font-bold",
                    !title.trim() && "text-faint",
                  )}
                >
                  {title.trim() || "제목을 입력하면 여기에 보여요"}
                </p>
                {content.trim() && (
                  <p className="mt-1 line-clamp-2 text-[13px] leading-[1.55] text-sub">
                    {plainContent(content)}
                  </p>
                )}
                <p className="mt-2.5 flex items-center gap-1.5 text-xs text-faint">
                  <b className="font-semibold text-[#333]">{shownName}</b>
                  {operator && <OperatorBadge />}
                  {images.length > 0 && <span>· 사진 {images.length}</span>}
                </p>
              </div>
            </div>
            <div className="rounded-[16px] border border-[#EDEDED] px-5 py-[18px]">
              <p className="mb-3 text-[14px] font-bold">등록 전 확인</p>
              <ul className="space-y-2.5 text-[13.5px]">
                {[
                  { ok: true, label: "게시판 선택" },
                  { ok: titleOk, label: "제목 2자 이상" },
                  { ok: contentOk, label: `내용 ${POST_CONTENT_MIN}자 이상` },
                  ...(images.length
                    ? [
                        {
                          ok: privacyChecked,
                          label: "사진 속 환자 정보 가렸어요",
                        },
                      ]
                    : []),
                  ...(operator && scheduling
                    ? [{ ok: !scheduleError, label: "예약 시간 확인" }]
                    : []),
                ].map((item) => (
                  <li
                    key={item.label}
                    className={cn(
                      "flex items-center gap-2",
                      !item.ok && "text-sub",
                    )}
                  >
                    <span
                      className={cn(
                        check,
                        item.ok
                          ? "bg-brand text-white"
                          : "border-[1.5px] border-[#D6D6D6]",
                      )}
                    >
                      {item.ok && <Check size={11} strokeWidth={3} />}
                    </span>
                    {item.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </Container>
  );
}

const tag =
  "inline-flex h-[22px] items-center rounded-md px-2 text-xs font-semibold whitespace-nowrap";

// 운영 계정 글쓰기: 이름은 가리지 않고 "ROM 운영팀"으로 보이고, 예약 게시를 할 수 있다
function OperatorOptions({
  scheduling,
  onScheduling,
  publishAt,
  onPublishAt,
  error,
}: {
  scheduling: boolean;
  onScheduling: (value: boolean) => void;
  publishAt: string;
  onPublishAt: (value: string) => void;
  error: string | null;
}) {
  return (
    <div className="mt-6 rounded-[14px] bg-surface px-4 py-3.5">
      <p className="flex items-center gap-1.5 text-[12.5px] text-sub">
        <OperatorBadge />
        <span>
          다른 사람에게 <b className="text-ink">{OPERATOR_NAME}</b>로 보여요
        </span>
      </p>
      <div className="mt-3.5 flex items-center justify-between gap-4 border-t border-[#E6E6E3] pt-3.5">
        <div className="min-w-0">
          <label
            htmlFor="post-schedule"
            className="flex items-center gap-1.5 text-[14.5px] font-bold"
          >
            <CalendarClock size={16} strokeWidth={2} />
            예약 게시
          </label>
          <p className="mt-0.5 text-[12.5px] text-sub">
            정한 시간 전에는 나에게만 보여요
          </p>
        </div>
        <button
          id="post-schedule"
          type="button"
          role="switch"
          aria-checked={scheduling}
          onClick={() => onScheduling(!scheduling)}
          className={`relative h-6 w-10 shrink-0 rounded-full transition-colors ${scheduling ? "bg-brand" : "bg-[#CFCFCF]"}`}
        >
          <span
            className={`absolute top-[3px] size-[18px] rounded-full bg-white transition-all ${scheduling ? "left-[19px]" : "left-[3px]"}`}
          />
        </button>
      </div>
      {scheduling && (
        <div className="mt-3">
          <label htmlFor="post-publish-at" className="sr-only">
            게시 시각
          </label>
          <input
            id="post-publish-at"
            type="datetime-local"
            value={publishAt}
            onChange={(event) => onPublishAt(event.target.value)}
            className="h-12 w-full rounded-[12px] border border-[#E1E1E1] bg-white px-3.5 text-[15px] font-semibold outline-none focus:border-ink"
          />
          {error && (
            <p className="mt-1.5 text-[12.5px] font-semibold text-soon">
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
