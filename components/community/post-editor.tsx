"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { Bold, ImagePlus, List, ListOrdered, Loader2, NotebookPen, Plus, X } from "lucide-react";

import { useUploadPostImageMutation } from "@/hooks/mutations/community/useUploadPostImageMutation";
import { apiErrorMessage } from "@/lib/api";
import {
  POST_CONTENT_MAX,
  POST_IMAGE_MAX_BYTES,
  POST_IMAGE_TYPES,
  POST_IMAGES_MAX,
} from "@/lib/community";
import { cn } from "@/lib/utils";
import { toast } from "@/stores/use-toast-store";

export type PostImage = { path: string; url: string };

type Edit = { value: string; start: number; end: number };

const LIST_LINE = /^(\s*)(- |(\d+)\. )(.*)$/;

// 선택한 줄들의 시작·끝 위치
function lineRange(value: string, start: number, end: number) {
  const from = value.lastIndexOf("\n", start - 1) + 1;
  const next = value.indexOf("\n", end);
  return { from, to: next === -1 ? value.length : next };
}

// **굵게**: 고른 글자를 감싼다. 이미 감싸져 있으면 푼다
function toggleBold(value: string, start: number, end: number): Edit {
  const selected = value.slice(start, end);
  if (value.slice(start - 2, start) === "**" && value.slice(end, end + 2) === "**")
    return { value: value.slice(0, start - 2) + selected + value.slice(end + 2), start: start - 2, end: end - 2 };
  const text = selected || "굵게";
  return {
    value: `${value.slice(0, start)}**${text}**${value.slice(end)}`,
    start: start + 2,
    end: start + 2 + text.length,
  };
}

// 고른 줄마다 "- " 또는 "1. "를 붙인다. 모두 붙어 있으면 뗀다
function toggleList(value: string, start: number, end: number, ordered: boolean): Edit {
  const { from, to } = lineRange(value, start, end);
  const lines = value.slice(from, to).split("\n");
  const marked = (line: string) => (ordered ? /^\s*\d+\. /.test(line) : /^\s*- /.test(line));
  const off = lines.every(marked);
  const next = lines.map((line, i) => {
    const bare = line.replace(/^\s*(?:- |\d+\. )/, "");
    if (off) return bare;
    return ordered ? `${i + 1}. ${bare}` : `- ${bare}`;
  });
  const block = next.join("\n");
  return { value: value.slice(0, from) + block + value.slice(to), start: from, end: from + block.length };
}

// 목록 줄에서 Enter: 다음 줄에 목록 머리를 이어 붙인다. 빈 목록 줄이면 목록을 끝낸다
function continueList(value: string, caret: number): Edit | null {
  const { from } = lineRange(value, caret, caret);
  const match = LIST_LINE.exec(value.slice(from, caret));
  if (!match) return null;
  const [, indent, , num, rest] = match;
  if (rest.trim() === "") {
    return { value: value.slice(0, from) + value.slice(caret), start: from, end: from };
  }
  const head = num ? `${indent}${Number(num) + 1}. ` : `${indent}- `;
  const insert = `\n${head}`;
  const at = caret + insert.length;
  return { value: value.slice(0, caret) + insert + value.slice(caret), start: at, end: at };
}

// 글쓰기 본문: 서식 도구 + 쓰는 만큼 늘어나는 입력칸 + 사진
export function PostEditor({
  value,
  onChange,
  template,
  images,
  onImagesChange,
}: {
  value: string;
  onChange: (value: string) => void;
  template: { label: string; text: string } | null;
  images: PostImage[];
  // 올리기가 끝나는 순서대로 붙도록 이전 값을 받아 고치는 함수로 넘긴다
  onImagesChange: (update: (images: PostImage[]) => PostImage[]) => void;
}) {
  const area = useRef<HTMLTextAreaElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const upload = useUploadPostImageMutation();
  // 올리는 중인 사진 미리보기 (브라우저 object URL)
  const [pending, setPending] = useState<{ key: string; preview: string }[]>([]);

  // 쓰는 만큼 높이를 늘린다 (최소 높이는 CSS)
  useLayoutEffect(() => {
    const el = area.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

  function apply(edit: Edit | null) {
    if (!edit || edit.value.length > POST_CONTENT_MAX) return;
    onChange(edit.value);
    requestAnimationFrame(() => {
      area.current?.focus();
      area.current?.setSelectionRange(edit.start, edit.end);
    });
  }

  function format(kind: "bold" | "ul" | "ol") {
    const el = area.current;
    if (!el) return;
    const { selectionStart: s, selectionEnd: e } = el;
    apply(kind === "bold" ? toggleBold(value, s, e) : toggleList(value, s, e, kind === "ol"));
  }

  function insertTemplate() {
    if (!template) return;
    if (value.trim() === "") return apply({ value: template.text, start: 0, end: 0 });
    const text = `${value.replace(/\s+$/, "")}\n\n${template.text}`;
    apply({ value: text, start: text.length, end: text.length });
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "b") {
      event.preventDefault();
      format("bold");
      return;
    }
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      const el = event.currentTarget;
      if (el.selectionStart !== el.selectionEnd) return;
      const edit = continueList(value, el.selectionStart);
      if (edit) {
        event.preventDefault();
        apply(edit);
      }
    }
  }

  async function addFiles(files: FileList | null) {
    if (!files?.length) return;
    const room = POST_IMAGES_MAX - images.length - pending.length;
    const picked = Array.from(files);
    if (picked.length > room) toast(`사진은 ${POST_IMAGES_MAX}장까지 올릴 수 있어요`);
    for (const file of picked.slice(0, Math.max(0, room))) {
      if (!POST_IMAGE_TYPES.includes(file.type)) {
        toast("JPG, PNG, WEBP 사진만 올릴 수 있어요");
        continue;
      }
      if (file.size > POST_IMAGE_MAX_BYTES) {
        toast("사진 한 장은 5MB까지 올릴 수 있어요");
        continue;
      }
      const key = crypto.randomUUID();
      const preview = URL.createObjectURL(file);
      setPending((list) => [...list, { key, preview }]);
      try {
        const image = await upload.mutateAsync(file);
        onImagesChange((list) => [...list, image]);
      } catch (error) {
        toast(apiErrorMessage(error, "사진을 올리지 못했어요. 잠시 후 다시 시도해주세요"));
      } finally {
        setPending((list) => list.filter((p) => p.key !== key));
        URL.revokeObjectURL(preview);
      }
    }
  }

  const count = images.length + pending.length;
  const tool =
    "flex size-9 items-center justify-center rounded-[9px] text-[#444] transition-colors hover:bg-[#EDEDEB] hover:text-ink";

  return (
    <div className="overflow-hidden rounded-[14px] border border-[#E1E1E1] transition-shadow focus-within:border-ink focus-within:shadow-[0_0_0_3px_rgba(17,17,17,0.05)]">
      <div className="flex items-center gap-0.5 border-b border-line bg-[#FAFAF9] px-2 py-1.5" role="toolbar" aria-label="서식">
        <button type="button" className={tool} aria-label="굵게 (Ctrl+B)" title="굵게 (Ctrl+B)" onClick={() => format("bold")}>
          <Bold size={17} strokeWidth={2.4} />
        </button>
        <button type="button" className={tool} aria-label="목록" title="목록" onClick={() => format("ul")}>
          <List size={18} strokeWidth={2} />
        </button>
        <button type="button" className={tool} aria-label="번호 목록" title="번호 목록" onClick={() => format("ol")}>
          <ListOrdered size={18} strokeWidth={2} />
        </button>
        <span className="mx-1.5 h-[18px] w-px bg-[#E4E4E4]" />
        <button
          type="button"
          className={cn(tool, count >= POST_IMAGES_MAX && "pointer-events-none opacity-40")}
          aria-label="사진 추가"
          title="사진 추가"
          onClick={() => fileInput.current?.click()}
        >
          <ImagePlus size={18} strokeWidth={2} />
        </button>
        <input
          ref={fileInput}
          type="file"
          accept={POST_IMAGE_TYPES.join(",")}
          multiple
          hidden
          onChange={(event) => {
            void addFiles(event.target.files);
            event.target.value = "";
          }}
        />
        {template && (
          <button
            type="button"
            onClick={insertTemplate}
            className="ml-auto inline-flex h-8 items-center gap-1 rounded-full border border-[#E4E4E4] bg-white px-3 text-[12.5px] font-semibold text-[#333] hover:border-ink"
          >
            <NotebookPen size={14} strokeWidth={2} />
            {template.label}
          </button>
        )}
      </div>

      <label htmlFor="post-content" className="sr-only">
        내용
      </label>
      <textarea
        id="post-content"
        ref={area}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={onKeyDown}
        maxLength={POST_CONTENT_MAX}
        placeholder={template ? `경험이나 궁금한 점을 자유롭게 적어주세요. 막막하면 "${template.label}"를 눌러보세요` : "경험이나 궁금한 점을 자유롭게 적어주세요"}
        className="block min-h-[200px] w-full resize-none overflow-hidden px-4 py-3.5 text-[15px] leading-[1.75] outline-none placeholder:text-faint md:px-5 md:py-4"
      />

      {count > 0 && (
        <div className="flex flex-wrap gap-2 px-4 pb-3.5 md:px-5">
          {images.map((image, i) => (
            <div key={image.path} className="relative size-[72px] overflow-hidden rounded-[12px] bg-surface md:size-[84px]">
              {/* eslint-disable-next-line @next/next/no-img-element -- 올린 사진 미리보기 */}
              <img src={image.url} alt={`첨부 사진 ${i + 1}`} className="size-full object-cover" />
              <button
                type="button"
                aria-label={`사진 ${i + 1} 빼기`}
                onClick={() => onImagesChange((list) => list.filter((p) => p.path !== image.path))}
                className="absolute top-1 right-1 flex size-5 items-center justify-center rounded-full bg-black/55 text-white"
              >
                <X size={12} strokeWidth={2.6} />
              </button>
            </div>
          ))}
          {pending.map((p) => (
            <div key={p.key} className="relative size-[72px] overflow-hidden rounded-[12px] bg-surface md:size-[84px]">
              {/* eslint-disable-next-line @next/next/no-img-element -- 올리는 중인 사진 미리보기 */}
              <img src={p.preview} alt="" className="size-full object-cover opacity-50" />
              <Loader2 size={20} className="absolute inset-0 m-auto animate-spin text-ink" />
            </div>
          ))}
          {count < POST_IMAGES_MAX && (
            <button
              type="button"
              onClick={() => fileInput.current?.click()}
              className="flex size-[72px] flex-col items-center justify-center gap-0.5 rounded-[12px] border-[1.5px] border-dashed border-[#D6D6D6] text-xs text-faint hover:border-ink hover:text-ink md:size-[84px]"
            >
              <Plus size={18} />
              {count} / {POST_IMAGES_MAX}
            </button>
          )}
        </div>
      )}

      <div className="flex items-center justify-between border-t border-line px-4 py-2 text-[12.5px] text-faint md:px-5">
        <span>쓰는 만큼 입력칸이 늘어나요</span>
        <span>
          {value.trim().length.toLocaleString("ko-KR")} / {POST_CONTENT_MAX.toLocaleString("ko-KR")}
        </span>
      </div>
    </div>
  );
}
