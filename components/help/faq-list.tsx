import { ChevronDown } from "lucide-react";

import { faqs } from "@/lib/support";

// 자주 묻는 질문. 질문을 누르면 답이 펼쳐진다
export function FaqList() {
  return (
    <ul className="divide-y divide-[#EFEFEF] border-y border-[#EFEFEF]">
      {faqs.map((faq) => (
        <li key={faq.q}>
          <details className="group">
            <summary className="flex cursor-pointer list-none items-center gap-3 py-4 text-[15px] font-bold md:text-[16px] [&::-webkit-details-marker]:hidden">
              <span className="text-brand">Q</span>
              <span className="flex-1">{faq.q}</span>
              <ChevronDown size={18} className="shrink-0 text-faint transition-transform group-open:rotate-180" />
            </summary>
            <p className="mb-4 rounded-[12px] bg-surface px-4 py-3.5 text-[14.5px] leading-[1.7] text-[#333]">{faq.a}</p>
          </details>
        </li>
      ))}
    </ul>
  );
}
