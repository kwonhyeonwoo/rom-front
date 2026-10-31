"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, X } from "lucide-react";

import { Container } from "@/components/layout/container";
import { pillClass } from "@/components/search/filter-pill";
import { useCreatePostMutation } from "@/hooks/mutations/community/useCreatePostMutation";
import { useBookmarksQuery } from "@/hooks/queries/bookmark/useBookmarksQuery";
import { useUserQuery } from "@/hooks/queries/user/useUserQuery";
import { useSession } from "@/hooks/useSession";
import { apiErrorMessage } from "@/lib/api";
import {
  POST_CONTENT_MAX,
  POST_CONTENT_MIN,
  POST_TITLE_MAX,
  boards,
  previewName,
  type Board,
} from "@/lib/community";
import { toast } from "@/stores/use-toast-store";
import { CommunityLoginRequired, CommunitySkeleton } from "./login-required";

export function PostForm() {
  const session = useSession();
  const router = useRouter();
  const params = useSearchParams();
  const { data: user } = useUserQuery(Boolean(session));
  const bookmarks = useBookmarksQuery(Boolean(session));
  const create = useCreatePostMutation();

  const [board, setBoard] = useState<Board>(
    boards.find((b) => b.value === params.get("board"))?.value ?? "FREE",
  );
  const [seminarId, setSeminarId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [anonymous, setAnonymous] = useState(board === "FREE");

  if (session === undefined) return <CommunitySkeleton />;
  if (session === null) return <CommunityLoginRequired />;

  // 후기에 연결할 수 있는 건 내가 저장하고 "들었어요"라고 답한 세미나
  const attended = (bookmarks.data ?? []).filter(
    (s) => s.attendance === "ATTENDED",
  );
  const selected = attended.find((s) => s.id === seminarId);
  const titleLength = title.trim().length;
  const contentLength = content.trim().length;
  const valid =
    titleLength >= 2 &&
    titleLength <= POST_TITLE_MAX &&
    contentLength >= POST_CONTENT_MIN &&
    contentLength <= POST_CONTENT_MAX;
  const name = user?.name ?? session.user.email ?? null;

  function selectBoard(next: Board) {
    setBoard(next);
    if (next !== "REVIEW") setSeminarId(null);
    // 자유 게시판은 익명이 기본이다. 직접 바꾼 선택은 게시판을 옮겨도 그대로 둔다
    if (next === "FREE" && board !== "FREE" && title === "" && content === "")
      setAnonymous(true);
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!valid || create.isPending) return;
    create.mutate(
      {
        board,
        title: title.trim(),
        content: content.trim(),
        anonymous,
        ...(seminarId && { seminarId }),
      },
      {
        onSuccess: ({ id }) => {
          toast("글을 올렸어요");
          router.replace(`/community/${id}`);
        },
        onError: (error) =>
          toast(
            apiErrorMessage(
              error,
              "글을 올리지 못했어요. 잠시 후 다시 시도해주세요",
            ),
          ),
      },
    );
  }

  return (
    <Container className="max-w-[720px] pt-6 pb-12 md:pt-11">
      <h1 className="text-[26px] font-extrabold tracking-[-0.045em]">글쓰기</h1>

      <form onSubmit={submit} className="mt-6">
        <fieldset>
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
        </fieldset>

        {board === "REVIEW" && (
          <div className="mt-7">
            <p className="text-[15px] font-bold">
              수강한 세미나 연결{" "}
              <span className="text-[13px] font-medium text-faint">선택</span>
            </p>
            {selected ? (
              <div className="mt-3 flex items-center gap-3 rounded-[12px] border-[1.5px] border-ink px-3.5 py-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14.5px] font-bold">
                    {selected.title}
                  </p>
                  <p className="truncate text-[12.5px] text-sub">
                    {selected.host} · {selected.schedule}
                  </p>
                </div>
                <button
                  type="button"
                  aria-label="연결 해제"
                  onClick={() => setSeminarId(null)}
                  className="text-faint hover:text-ink"
                >
                  <X size={18} />
                </button>
              </div>
            ) : attended.length > 0 ? (
              <div className="mt-3 max-h-56 overflow-y-auto rounded-[12px] border border-[#E4E4E4]">
                {attended.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSeminarId(s.id)}
                    className="block w-full border-b border-line px-3.5 py-3 text-left last:border-b-0 hover:bg-surface"
                  >
                    <p className="truncate text-[14.5px] font-semibold">
                      {s.title}
                    </p>
                    <p className="truncate text-[12.5px] text-sub">
                      {s.host} · {s.schedule}
                    </p>
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

        <div className="mt-7">
          <label htmlFor="post-title" className="text-[15px] font-bold">
            제목
          </label>
          <input
            id="post-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            maxLength={POST_TITLE_MAX}
            placeholder="제목을 입력해주세요"
            className="mt-3 h-[52px] w-full rounded-[12px] border border-[#E1E1E1] px-4 text-base font-semibold outline-none placeholder:font-normal placeholder:text-faint focus:border-ink"
          />
        </div>

        <div className="mt-6">
          <label htmlFor="post-content" className="text-[15px] font-bold">
            내용
          </label>
          <textarea
            id="post-content"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            maxLength={POST_CONTENT_MAX}
            rows={10}
            placeholder="경험이나 궁금한 점을 자유롭게 적어주세요"
            className="mt-3 w-full resize-y rounded-[14px] border border-[#E1E1E1] p-4 text-[15px] leading-[1.7] outline-none placeholder:text-faint focus:border-ink"
          />
          <p className="mt-1.5 text-right text-[12.5px] text-faint">
            {contentLength.toLocaleString("ko-KR")} /{" "}
            {POST_CONTENT_MAX.toLocaleString("ko-KR")}
          </p>
        </div>

        <div className="mt-4 flex items-start gap-2.5 rounded-[12px] bg-[#FFF6E5] px-3.5 py-3 text-[13px] leading-[1.55] text-[#8A5A00]">
          <AlertCircle size={17} strokeWidth={2} className="mt-0.5 shrink-0" />
          <span>
            환자 이름, 얼굴, 차트, 영상처럼 누구인지 알 수 있는 정보는 올리지
            말아주세요.
          </span>
        </div>

        <div className="mt-6 flex items-center justify-between gap-4 rounded-[14px] bg-surface px-4 py-3.5">
          <div className="min-w-0">
            <label htmlFor="post-anonymous" className="text-[14.5px] font-bold">
              익명으로 쓰기
            </label>
            <p className="mt-0.5 truncate text-[12.5px] text-sub">
              다른 사람에게{" "}
              <b className="text-ink">{previewName(name, anonymous)}</b>로
              보여요
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

        <button
          type="submit"
          disabled={!valid || create.isPending}
          className="mt-7 inline-flex h-12 w-full items-center justify-center rounded-full bg-ink text-[15px] font-bold text-white disabled:bg-[#CFCFCF] md:w-auto md:px-12"
        >
          {create.isPending ? "올리는 중" : "등록"}
        </button>
      </form>
    </Container>
  );
}
