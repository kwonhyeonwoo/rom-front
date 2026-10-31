import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

// 별점 표시. onChange를 주면 눌러서 고를 수 있다
export function StarRating({
  value,
  onChange,
  size = 16,
  className,
}: {
  value: number;
  onChange?: (value: number) => void;
  size?: number;
  className?: string;
}) {
  return (
    <div
      role={onChange ? "radiogroup" : "img"}
      aria-label={onChange ? "별점" : `별점 ${value}점`}
      className={cn("flex items-center gap-0.5", className)}
    >
      {[1, 2, 3, 4, 5].map((n) => {
        const star = <Star size={size} strokeWidth={1.8} className={n <= value ? "fill-[#E3A008] text-[#E3A008]" : "text-[#CFCFCF]"} />;
        return onChange ? (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={n === value}
            aria-label={`${n}점`}
            onClick={() => onChange(n)}
            className="rounded p-0.5"
          >
            {star}
          </button>
        ) : (
          <span key={n}>{star}</span>
        );
      })}
    </div>
  );
}
