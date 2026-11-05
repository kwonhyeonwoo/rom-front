"use client";

import { useState } from "react";
import { Check, ChevronDown, ExternalLink } from "lucide-react";

import { cn } from "@/lib/utils";

export type VerifyConsentState = {
  licensePrivacy: boolean;
  communityRules: boolean;
  marketing: boolean;
};

type Key = keyof VerifyConsentState;

type Item = {
  key: Key;
  required: boolean;
  title: string;
  // 펼치면 보이는 요약 (항목, 목적, 보관 기간)
  rows: { label: string; value: string }[];
  link?: { href: string; label: string };
};

// 요약은 lib/legal/privacy.ts·terms.ts와 같은 내용을 짧게 줄인 것. 방침을 고치면 여기도 함께 고친다
const items: Item[] = [
  {
    key: "licensePrivacy",
    required: true,
    title: "면허 인증을 위한 개인정보 수집·이용 동의",
    rows: [
      {
        label: "수집 항목",
        value: "면허증에 적힌 이름, 면허번호, 면허 취득연도, 주 분야, 면허증 사진, 휴대폰번호",
      },
      { label: "이용 목적", value: "물리치료사 면허 확인, 인증 회원 커뮤니티 운영, 심사 관련 연락" },
      {
        label: "보관 기간",
        value:
          "면허증 사진은 심사(승인·반려)가 끝나면 바로 삭제해요. 그 외 정보는 회원 탈퇴 시 바로 삭제해요. 면허번호와 휴대폰번호는 암호화해 저장해요.",
      },
    ],
    link: { href: "/privacy", label: "개인정보처리방침 보기" },
  },
  {
    key: "communityRules",
    required: true,
    title: "커뮤니티 이용 규칙 동의",
    rows: [
      {
        label: "주요 내용",
        value:
          "환자를 알아볼 수 있는 정보·사진 금지, 욕설·비방·허위 후기 금지, 승인 없는 광고 금지, 다른 사람 면허 사용 금지",
      },
      { label: "위반 시", value: "글 숨김, 이용 제한, 인증 취소가 될 수 있어요" },
    ],
    link: { href: "/terms#rules", label: "이용약관 보기" },
  },
  {
    key: "marketing",
    required: false,
    title: "새 기능·이벤트·추천 세미나 소식 받기",
    rows: [
      { label: "수집 항목", value: "이메일 주소 또는 휴대폰번호, 수신 동의 여부와 일시" },
      { label: "이용 목적", value: "새 기능, 이벤트, 추천 세미나 등 광고성 정보 안내" },
      { label: "보관 기간", value: "동의 철회 또는 회원 탈퇴 시까지. 마이페이지에서 언제든 끌 수 있어요" },
    ],
    link: { href: "/privacy", label: "개인정보처리방침 보기" },
  },
];

// 면허 인증 동의. 필수 2개 + 선택 1개(마케팅). "모두 동의"는 선택 항목까지 켠다
export function VerifyConsents({
  value,
  onChange,
}: {
  value: VerifyConsentState;
  onChange: (next: VerifyConsentState) => void;
}) {
  const [open, setOpen] = useState<Key | null>(null);
  const all = value.licensePrivacy && value.communityRules && value.marketing;

  return (
    <div className="mt-5 rounded-[14px] bg-[#F7F7F5] p-4">
      <Box
        checked={all}
        onChange={(checked) => onChange({ licensePrivacy: checked, communityRules: checked, marketing: checked })}
      >
        <b className="text-[14.5px]">모두 동의하기</b>
        <span className="block text-[12.5px] text-sub">선택 항목(소식 받기)도 함께 동의해요</span>
      </Box>

      <ul className="mt-3 space-y-1 border-t border-[#E6E6E3] pt-3">
        {items.map((item) => {
          const expanded = open === item.key;
          const panelId = `consent-${item.key}`;
          return (
            <li key={item.key}>
              <div className="flex items-start gap-1">
                <Box checked={value[item.key]} onChange={(checked) => onChange({ ...value, [item.key]: checked })}>
                  <b className={item.required ? "text-ink" : "text-sub"}>[{item.required ? "필수" : "선택"}]</b>{" "}
                  {item.title}
                </Box>
                <button
                  type="button"
                  onClick={() => setOpen(expanded ? null : item.key)}
                  aria-expanded={expanded}
                  aria-controls={panelId}
                  className="flex h-7 shrink-0 items-center gap-0.5 rounded-md px-1.5 text-[12.5px] font-semibold text-sub hover:text-ink"
                >
                  내용
                  <ChevronDown size={14} className={cn("transition-transform", expanded && "rotate-180")} />
                </button>
              </div>
              {expanded && (
                <div id={panelId} className="mt-1.5 mb-2 ml-[30px] rounded-[10px] bg-white px-3.5 py-3 text-[12.5px] leading-[1.6]">
                  <dl className="space-y-1.5">
                    {item.rows.map((row) => (
                      <div key={row.label}>
                        <dt className="font-bold text-ink">{row.label}</dt>
                        <dd className="text-sub">{row.value}</dd>
                      </div>
                    ))}
                  </dl>
                  {item.link && (
                    <a
                      href={item.link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2.5 inline-flex items-center gap-1 font-semibold text-ink underline underline-offset-[3px]"
                    >
                      {item.link.label}
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <p className="mt-3 text-[12px] leading-[1.6] text-faint">
        동의를 거부할 수 있어요. 다만 필수 항목에 동의하지 않으면 면허 인증과 커뮤니티 글쓰기를 이용할 수 없어요. 선택
        항목은 동의하지 않아도 인증할 수 있어요.{" "}
        <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-sub underline">
          개인정보처리방침
        </a>
        {" · "}
        <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-sub underline">
          이용약관
        </a>
      </p>
    </div>
  );
}

function Box({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-1 cursor-pointer items-start gap-2.5 py-1 text-[13.5px] leading-[1.45]">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="peer sr-only" />
      <span className="mt-px flex size-5 shrink-0 items-center justify-center rounded-md border-[1.5px] border-[#CFCFCF] bg-white text-white peer-checked:border-ink peer-checked:bg-ink peer-focus-visible:ring-2 peer-focus-visible:ring-ink/30">
        <Check size={13} strokeWidth={3} />
      </span>
      <span>{children}</span>
    </label>
  );
}
