import { Fragment, type ReactNode } from "react";

import { cn } from "@/lib/utils";

type Block =
  | { kind: "p"; lines: string[] }
  | { kind: "ul"; items: string[] }
  | { kind: "ol"; items: string[]; start: number };

const BULLET = /^\s*- (.*)$/;
const NUMBER = /^\s*(\d+)\. (.*)$/;

// 글 본문의 간단한 서식만 읽는다: **굵게**, "- " 목록, "1. " 번호 목록.
// HTML은 해석하지 않고 글자 그대로 그리므로 본문에 태그를 넣어도 실행되지 않는다
export function parseContent(content: string): Block[] {
  const blocks: Block[] = [];
  for (const line of content.split("\n")) {
    const last = blocks.at(-1);
    const bullet = BULLET.exec(line);
    const number = NUMBER.exec(line);
    if (bullet) {
      if (last?.kind === "ul") last.items.push(bullet[1]);
      else blocks.push({ kind: "ul", items: [bullet[1]] });
    } else if (number) {
      if (last?.kind === "ol") last.items.push(number[2]);
      else blocks.push({ kind: "ol", items: [number[2]], start: Number(number[1]) });
    } else if (line.trim() === "") {
      // 빈 줄은 문단을 나눈다
      if (last?.kind === "p" && last.lines.length) blocks.push({ kind: "p", lines: [] });
    } else if (last?.kind === "p") {
      last.lines.push(line);
    } else {
      blocks.push({ kind: "p", lines: [line] });
    }
  }
  return blocks.filter((b) => b.kind !== "p" || b.lines.length > 0);
}

function inline(text: string): ReactNode[] {
  return text.split(/(\*\*.+?\*\*)/g).map((part, i) =>
    part.length > 4 && part.startsWith("**") && part.endsWith("**") ? (
      <b key={i} className="font-bold text-ink">
        {part.slice(2, -2)}
      </b>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

export function PostContent({ content, className }: { content: string; className?: string }) {
  return (
    <div className={cn("space-y-3 text-[15.5px] leading-[1.85] break-words text-[#222]", className)}>
      {parseContent(content).map((block, i) => {
        if (block.kind === "ul")
          return (
            <ul key={i} className="list-disc space-y-0.5 pl-5 marker:text-faint">
              {block.items.map((item, j) => (
                <li key={j}>{inline(item)}</li>
              ))}
            </ul>
          );
        if (block.kind === "ol")
          return (
            <ol key={i} start={block.start} className="list-decimal space-y-0.5 pl-5 marker:text-sub">
              {block.items.map((item, j) => (
                <li key={j}>{inline(item)}</li>
              ))}
            </ol>
          );
        return (
          <p key={i}>
            {block.lines.map((line, j) => (
              <Fragment key={j}>
                {j > 0 && <br />}
                {inline(line)}
              </Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}

// 본문 아래 사진. 누르면 원본을 새 탭으로 연다
export function PostImages({ images }: { images: string[] }) {
  if (!images.length) return null;
  return (
    <div className={cn("mt-6 grid gap-2", images.length === 1 ? "grid-cols-1" : "grid-cols-2")}>
      {images.map((src, i) => (
        <a
          key={src}
          href={src}
          target="_blank"
          rel="noreferrer"
          className="block overflow-hidden rounded-[12px] bg-surface"
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- Supabase 공개 버킷 사진은 원본 그대로 쓴다 */}
          <img
            src={src}
            alt={`첨부 사진 ${i + 1}`}
            loading="lazy"
            className={cn("w-full object-cover", images.length === 1 ? "max-h-[520px]" : "aspect-square")}
          />
        </a>
      ))}
    </div>
  );
}
