import { posterThemes, type Poster } from "@/lib/seminars";

// 디자인 기준 폭(144px)에 맞춘 값을 width 비율로 확대/축소한다.
const BASE_WIDTH = 144;

export function SeminarPoster({ poster, width }: { poster: Poster; width: number }) {
  const s = width / BASE_WIDTH;
  const theme = posterThemes[poster.theme];

  return (
    <div
      aria-hidden
      className="flex shrink-0 flex-col justify-between overflow-hidden"
      style={{
        width,
        height: Math.round((width * 4) / 3),
        padding: `${13.7 * s}px ${12 * s}px`,
        background: theme.bg,
        color: theme.fg,
      }}
    >
      <div className="font-bold tracking-[0.12em] opacity-75" style={{ fontSize: 8.9 * s }}>
        {poster.label}
      </div>
      <div>
        <div style={{ width: 24 * s, height: 3.4 * s, marginBottom: 8.6 * s, background: theme.accent }} />
        <div className="leading-[1.08] font-extrabold tracking-[-0.02em]" style={{ fontSize: 19.7 * s }}>
          {poster.lines[0]}
          <br />
          {poster.lines[1]}
        </div>
        <div className="font-medium opacity-85" style={{ fontSize: 10.6 * s, marginTop: 8.6 * s }}>
          {poster.subtitle}
        </div>
      </div>
      <div className="font-semibold opacity-70" style={{ fontSize: 8.9 * s }}>
        {poster.date}
      </div>
    </div>
  );
}
