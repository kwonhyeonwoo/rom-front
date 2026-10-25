"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { SeminarPoster } from "@/components/seminar/seminar-poster";
import type { Banner } from "@/lib/seminars";
import { cn } from "@/lib/utils";

const AUTOPLAY_MS = 5000;
// 이만큼 이상 옆으로 밀면 스와이프로 본다
const SWIPE_PX = 40;

// 교육업체 상단 노출 광고 배너 (자동 슬라이드, 마우스를 올리거나 터치하는 동안 멈춤)
export function PromoBanner({ banners, className }: { banners: Banner[]; className?: string }) {
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [touching, setTouching] = useState(false);
  const [focused, setFocused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const count = banners.length;
  const move = (step: number) => setIndex((current) => (current + step + count) % count);
  const paused = hovered || touching || focused || reducedMotion;

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  // 슬라이드가 바뀔 때마다 타이머를 새로 걸어서, 직접 넘긴 뒤에도 바로 다음 장으로 넘어가지 않게 한다
  useEffect(() => {
    if (paused || count < 2) return;
    const timer = window.setTimeout(() => setIndex((current) => (current + 1) % count), AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [index, paused, count]);

  if (count === 0) return null;

  return (
    <section
      aria-roledescription="carousel"
      aria-label="추천 세미나 광고"
      className={cn("relative h-[156px] overflow-hidden rounded-[18px] text-white md:h-[230px] md:rounded-[22px]", className)}
      // 터치로 생기는 가짜 마우스 이벤트 때문에 멈춘 채로 남지 않도록 마우스일 때만 hover로 본다
      onPointerEnter={(event) => event.pointerType === "mouse" && setHovered(true)}
      onPointerLeave={(event) => event.pointerType === "mouse" && setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(event) => !event.currentTarget.contains(event.relatedTarget) && setFocused(false)}
      onTouchStart={(event) => {
        touchStartX.current = event.touches[0].clientX;
        setTouching(true);
      }}
      onTouchEnd={(event) => {
        const start = touchStartX.current;
        const dx = start === null ? 0 : event.changedTouches[0].clientX - start;
        if (Math.abs(dx) >= SWIPE_PX) move(dx < 0 ? 1 : -1);
        touchStartX.current = null;
        setTouching(false);
      }}
      onTouchCancel={() => {
        touchStartX.current = null;
        setTouching(false);
      }}
    >
      <div
        className="flex h-full transition-transform duration-500 ease-out motion-reduce:transition-none"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {banners.map((banner, slide) => (
          <div
            key={banner.id}
            role="group"
            aria-roledescription="slide"
            aria-label={`${slide + 1} / ${count}`}
            aria-hidden={slide !== index}
            inert={slide !== index}
            className="relative h-full w-full shrink-0"
            style={{ background: banner.background }}
          >
            <div className="absolute inset-y-0 left-[21px] flex flex-col justify-center gap-[5px] md:left-[41px] md:gap-[9px]">
              <span className="text-[6.4px] font-bold tracking-[.14em] text-[#8FE3C8] md:text-[12.6px]">{banner.eyebrow}</span>
              <span className="text-[17.4px] leading-[1.2] font-extrabold tracking-[-0.04em] md:text-[34.5px]">
                {banner.title[0]}
                <br />
                {banner.title[1]}
              </span>
              <span className="text-[7.5px] opacity-75 md:text-[15px]">{banner.meta}</span>
            </div>

            <div className="absolute top-[25px] right-[26px] rotate-3 overflow-hidden rounded-md shadow-[0_8px_24px_rgba(0,0,0,.3)] md:top-[37px] md:right-[220px]">
              <div className="md:hidden">
                <SeminarPoster poster={banner.poster} width={94} />
              </div>
              <div className="hidden md:block">
                <SeminarPoster poster={banner.poster} width={138} />
              </div>
            </div>

            <span className="absolute top-2 right-[9px] text-[6px] font-semibold opacity-60 md:top-4 md:right-[18px] md:text-xs">
              광고 · {banner.advertiser}
            </span>
          </div>
        ))}
      </div>

      {count > 1 && (
        <>
          <div className="absolute bottom-[11px] left-1/2 flex -translate-x-1/2 items-center gap-1 md:bottom-[22px] md:gap-1.5">
            {banners.map((banner, slide) => (
              <button
                key={banner.id}
                type="button"
                aria-label={`${slide + 1}번째 광고 보기`}
                aria-current={slide === index}
                onClick={() => setIndex(slide)}
                className={cn(
                  "h-[5px] rounded-full bg-white transition-all md:h-1.5",
                  slide === index ? "w-3.5 opacity-100 md:w-5" : "w-[5px] opacity-45 hover:opacity-70 md:w-1.5",
                )}
              />
            ))}
          </div>

          <div className="absolute bottom-2 left-[9px] flex items-center gap-2 rounded-full bg-black/40 px-[11px] py-[3px] text-[9.8px] font-semibold md:right-[18px] md:bottom-4 md:left-auto md:text-[13.2px]">
            <button type="button" aria-label="이전 광고" onClick={() => move(-1)}>
              <ChevronLeft size={12} strokeWidth={2.6} />
            </button>
            <span aria-live={paused ? "polite" : "off"}>
              {index + 1} / {count}
            </span>
            <button type="button" aria-label="다음 광고" onClick={() => move(1)}>
              <ChevronRight size={12} strokeWidth={2.6} />
            </button>
          </div>
        </>
      )}
    </section>
  );
}
