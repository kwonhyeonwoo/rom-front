import { Fragment, type ReactNode } from "react";

import { Container } from "@/components/layout/container";
import { SiteHeader } from "@/components/layout/site-header";
import type { LegalBlock, LegalDocument } from "@/lib/legal/types";

// 【…】는 운영자가 아직 채우지 않은 빈칸이다. 눈에 띄게 칠해 둔다
function withBlanks(text: string): ReactNode {
  const parts = text.split(/(【[^】]*】)/g);
  return parts.map((part, i) =>
    part.startsWith("【") ? (
      <mark key={i} className="rounded bg-[#FFF3C4] px-1 text-ink">
        {part.slice(1, -1)}
      </mark>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

function Block({ block }: { block: LegalBlock }) {
  switch (block.type) {
    case "p":
      return <p>{withBlanks(block.text)}</p>;
    case "ul":
    case "ol": {
      const List = block.type;
      return (
        <List className={`space-y-1.5 pl-5 ${block.type === "ul" ? "list-disc" : "list-decimal"}`}>
          {block.items.map((item, i) => (
            <li key={i}>{withBlanks(item)}</li>
          ))}
        </List>
      );
    }
    case "table":
      return (
        <div className="-mx-4 overflow-x-auto px-4 md:mx-0 md:px-0">
          <table className="w-full min-w-[560px] border-collapse text-[13.5px] leading-[1.6]">
            <thead>
              <tr>
                {block.head.map((h) => (
                  <th key={h} className="border border-[#E4E4E4] bg-[#F7F7F5] px-3 py-2 text-left font-bold text-ink">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, r) => (
                <tr key={r}>
                  {row.map((cell, c) => (
                    <td key={c} className="border border-[#E4E4E4] px-3 py-2 align-top">
                      {withBlanks(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }
}

// 이용약관·개인정보처리방침 공통 화면. 목차 → 본문 순서로 보여준다
export function LegalDocumentPage({ doc }: { doc: LegalDocument }) {
  return (
    <>
      <SiteHeader activeHref="" />
      <main>
        <Container className="py-10 md:py-16">
          <article className="mx-auto max-w-[760px] text-[15px] leading-[1.75] text-sub">
            <h1 className="text-[26px] font-extrabold tracking-[-0.04em] text-ink md:text-[32px]">{doc.title}</h1>
            <p className="mt-2 text-[13.5px] text-faint">{withBlanks(doc.effectiveDate)}</p>

            <p className="mt-6 rounded-[14px] bg-[#F7F7F5] p-4 text-[13.5px] leading-[1.65]">
              롬은 지금 테스트 운영 중이에요. 이 문서는 정식 시행 전 초안이라 내용이 바뀔 수 있고, 바뀌면 공지사항으로
              먼저 알려드릴게요.
            </p>

            <div className="mt-6 space-y-3">
              {doc.intro.map((text, i) => (
                <p key={i}>{withBlanks(text)}</p>
              ))}
            </div>

            <nav aria-label="목차" className="mt-8 rounded-[14px] border border-[#E8E8E6] p-4 md:p-5">
              <p className="text-[13px] font-bold text-ink">목차</p>
              <ol className="mt-2 grid gap-x-6 gap-y-1 text-[14px] md:grid-cols-2">
                {doc.sections.map((s) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className="hover:text-ink hover:underline">
                      {s.heading}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            {doc.sections.map((s) => (
              <section key={s.id} id={s.id} className="mt-10 scroll-mt-24">
                <h2 className="text-[18px] font-extrabold tracking-[-0.03em] text-ink md:text-[20px]">{s.heading}</h2>
                <div className="mt-3 space-y-3">
                  {s.blocks.map((b, i) => (
                    <Block key={i} block={b} />
                  ))}
                </div>
              </section>
            ))}
          </article>
        </Container>
      </main>
    </>
  );
}
