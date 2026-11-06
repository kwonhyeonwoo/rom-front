import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Container } from "@/components/layout/container";
import { SiteHeader } from "@/components/layout/site-header";
import { BookmarkButton } from "@/components/seminar/bookmark-button";
import { SeminarPoster } from "@/components/seminar/seminar-poster";
import { formatPrice, formatSchedule, toPoster, type ApiSeminar } from "@/lib/seminars";
import { getSeminar } from "@/lib/seminars-server";
import { siteName, siteUrl } from "@/lib/site";

// 세미나 상세. 검색엔진이 받는 첫 HTML에 세미나 내용과 구조화 데이터(JSON-LD)가 다 들어가도록 서버에서 그린다.

function credit(s: ApiSeminar) {
  if (s.ceCredits) return `보수교육 ${s.ceCredits}점 인정`;
  if (s.ceRecognized) return "보수교육 인정";
  return null;
}

// 마감까지 남은 일수는 백엔드가 한국 날짜로 계산해 준다
const closed = (s: ApiSeminar) => s.deadlineDaysLeft !== null && s.deadlineDaysLeft < 0;

// "2026-11-20" → "11.20"
function shortDate(date: string) {
  const [, m, d] = date.split("-").map(Number);
  return `${m}.${d}`;
}

function describe(s: ApiSeminar) {
  const parts = [
    s.host,
    formatSchedule(s.startDate, s.endDate),
    [s.region, s.venue].filter(Boolean).join(" "),
    formatPrice(s.price),
    credit(s),
    s.applyDeadline && `모집 마감 ${shortDate(s.applyDeadline)}`,
  ].filter(Boolean);
  return `${s.title} 일정·장소·수강료 안내. ${parts.join(" · ")}. 롬에서 물리치료 세미나와 보수교육을 한 번에 찾아보세요.`;
}

export async function generateMetadata({ params }: PageProps<"/seminars/[id]">): Promise<Metadata> {
  const { id } = await params;
  const s = await getSeminar(id);
  if (!s) return { title: "세미나를 찾을 수 없어요", robots: { index: false, follow: true } };

  const category = s.categories.find((c) => c !== "기타");
  const title = [s.title, category && `${category} 세미나`, s.region].filter(Boolean).join(" · ");
  const description = describe(s);
  const url = `/seminars/${s.id}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { type: "website", locale: "ko_KR", siteName, url, title, description },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default function SeminarRoute({ params }: PageProps<"/seminars/[id]">) {
  return (
    <>
      <SiteHeader activeHref="/search" />
      <main>
        <Suspense fallback={<SeminarSkeleton />}>
          {params.then(({ id }) => (
            <SeminarDetail id={id} />
          ))}
        </Suspense>
      </main>
    </>
  );
}

async function SeminarDetail({ id }: { id: string }) {
  const s = await getSeminar(id);
  if (!s) notFound();

  const applyUrl = s.applyUrl ?? s.sourceUrl;
  const category = s.categories.find((c) => c !== "기타");
  const ce = credit(s);
  const rows: [string, string | null][] = [
    ["일정", s.startDate ? `${formatSchedule(s.startDate, s.endDate)}${s.isWeekend ? " · 주말" : ""}` : "일정 미정"],
    ["지역", s.region ?? "지역 미정"],
    ["장소", s.venue],
    ["주최", s.host ?? s.source],
    ["수강료", formatPrice(s.price)],
    ["보수교육", ce ?? (s.ceRecognized === false ? "인정 안 됨" : "공지에 없음")],
    [
      "모집 기간",
      s.applyStart || s.applyDeadline
        ? `${s.applyStart ? shortDate(s.applyStart) : ""} ~ ${s.applyDeadline ? shortDate(s.applyDeadline) : ""}`.trim()
        : null,
    ],
    ["분야", s.categories.join(", ") || null],
  ];

  return (
    <Container className="pt-5 pb-12 md:pt-10 md:pb-20">
      <SeminarJsonLd seminar={s} />

      <nav aria-label="경로" className="text-[13px] text-sub">
        <Link href="/" className="hover:underline">
          홈
        </Link>
        <span className="mx-1.5">›</span>
        <Link href="/search" className="hover:underline">
          세미나 검색
        </Link>
        {category && (
          <>
            <span className="mx-1.5">›</span>
            <Link href={`/search?category=${encodeURIComponent(category)}`} className="hover:underline">
              {category}
            </Link>
          </>
        )}
      </nav>

      <div className="mt-5 flex flex-col gap-6 md:mt-7 md:flex-row md:items-start md:gap-12">
        <div className="relative flex h-[260px] shrink-0 items-center justify-center rounded-[14px] bg-surface md:h-[380px] md:w-[360px]">
          <div className="overflow-hidden rounded-[3px] shadow-[0_4px_14px_rgba(0,0,0,.14)]">
            <SeminarPoster poster={toPoster(s)} width={170} />
          </div>
          <BookmarkButton seminarId={s.id} className="absolute top-3 right-3" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm text-sub">{s.host ?? s.source}</p>
          <h1 className="mt-1.5 text-[22px] leading-[1.35] font-bold tracking-[-0.03em] md:text-[28px]">{s.title}</h1>
          <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[15px]">
            <b className="text-lg font-extrabold">{formatPrice(s.price)}</b>
            {ce && <span className="font-semibold text-brand">{ce}</span>}
            {closed(s) && <span className="text-sm font-bold text-soon">모집 마감</span>}
          </p>

          <dl className="mt-6 divide-y divide-line border-y border-line text-[15px]">
            {rows
              .filter((row): row is [string, string] => !!row[1])
              .map(([label, value]) => (
                <div key={label} className="flex gap-4 py-3">
                  <dt className="w-[72px] shrink-0 text-sub">{label}</dt>
                  <dd className="min-w-0 break-words">{value}</dd>
                </div>
              ))}
          </dl>

          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
            <a
              href={applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-brand px-6 text-[15px] font-bold text-white"
            >
              신청 페이지로 가기
            </a>
            {applyUrl !== s.sourceUrl && (
              <a
                href={s.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-line px-6 text-[15px] font-semibold"
              >
                원문 공지 보기
              </a>
            )}
          </div>
          <p className="mt-4 text-[13px] leading-relaxed text-faint">
            학회·교육업체 공지를 자동으로 모은 정보예요. 일정과 금액은 바뀔 수 있으니 신청 전에 원문을 꼭 확인해 주세요.
          </p>

          <div className="mt-8 flex flex-wrap gap-2 text-sm">
            {category && (
              <Link
                href={`/search?category=${encodeURIComponent(category)}`}
                className="rounded-full bg-surface px-3.5 py-2 hover:underline"
              >
                {category} 세미나 더 보기
              </Link>
            )}
            {s.region && (
              <Link
                href={`/search?region=${encodeURIComponent(s.region)}`}
                className="rounded-full bg-surface px-3.5 py-2 hover:underline"
              >
                {s.region} 세미나 더 보기
              </Link>
            )}
            <Link href={`/reviews/${s.id}`} className="rounded-full bg-surface px-3.5 py-2 hover:underline">
              수강 후기 쓰기
            </Link>
          </div>
        </div>
      </div>
    </Container>
  );
}

// 구글 이벤트 리치 결과용 schema.org Event. 시작일이 없으면 필수 항목이 빠지므로 넣지 않는다
function SeminarJsonLd({ seminar: s }: { seminar: ApiSeminar }) {
  if (!s.startDate) return null;
  const pageUrl = `${siteUrl}/seminars/${s.id}`;
  const data = {
    "@context": "https://schema.org",
    "@type": "EducationEvent",
    name: s.title,
    description: describe(s),
    startDate: s.startDate,
    endDate: s.endDate ?? s.startDate,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    inLanguage: "ko",
    url: pageUrl,
    image: [`${siteUrl}/opengraph-image.png`],
    location: {
      "@type": "Place",
      name: s.venue ?? s.region ?? "장소 미정",
      address: {
        "@type": "PostalAddress",
        ...(s.venue && { streetAddress: s.venue }),
        ...(s.region && { addressRegion: s.region }),
        addressCountry: "KR",
      },
    },
    organizer: { "@type": "Organization", name: s.host ?? s.source, url: s.sourceUrl },
    ...(s.price !== null && {
      offers: {
        "@type": "Offer",
        price: s.price,
        priceCurrency: "KRW",
        url: s.applyUrl ?? s.sourceUrl,
        // 모집 마감이 지난 세미나는 신청 가능하다고 표시하지 않는다
        ...(!closed(s) && { availability: "https://schema.org/InStock" }),
        ...(s.applyStart && { validFrom: s.applyStart }),
      },
    }),
  };
  return (
    <script
      type="application/ld+json"
      // JSON 안의 </script>가 태그를 닫지 않도록 <를 이스케이프한다
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

function SeminarSkeleton() {
  return (
    <Container className="pt-5 pb-12 md:pt-10" aria-busy>
      <div className="skeleton h-4 w-48 rounded" />
      <div className="mt-7 flex flex-col gap-6 md:flex-row md:gap-12">
        <div className="skeleton h-[260px] rounded-[14px] md:h-[380px] md:w-[360px]" />
        <div className="flex-1">
          <div className="skeleton h-4 w-32 rounded" />
          <div className="skeleton mt-3 h-8 w-3/4 rounded" />
          <div className="skeleton mt-6 h-56 w-full rounded" />
        </div>
      </div>
    </Container>
  );
}
