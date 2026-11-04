"use client";

import { formatPhoneInput, isValidPhone, type MyPhone } from "@/lib/phone";

const inputClass =
  "h-[50px] w-full rounded-[12px] border border-[#E1E1E1] bg-white px-4 text-[15px] outline-none placeholder:text-faint focus:border-ink";
const labelClass = "mb-2 block text-[13.5px] font-bold";

// 면허 인증 화면의 휴대폰번호 단계.
// - 저장된 번호가 있으면(카카오 가입 등) 가린 번호를 보여주고 확인만 받는다
// - 없으면(구글 가입, 카카오에서 번호 제공 거부) 여기서 입력받는다. 지금은 형식만 확인한다
// 문자 인증을 붙일 때는 입력칸 옆에 "인증번호 받기"와 인증번호 입력칸을 넣고, 확인이 끝나야 onChange로 값을 넘기면 된다
export function PhoneField({
  phone,
  editing,
  value,
  onChange,
  onEdit,
  onCancel,
}: {
  // undefined: 불러오는 중, null: 저장된 번호 없음
  phone: MyPhone | null | undefined;
  editing: boolean;
  value: string;
  onChange: (digits: string) => void;
  onEdit: () => void;
  onCancel: () => void;
}) {
  const help = "심사 중 연락이 필요할 때만 쓰고, 다른 회원에게는 보이지 않아요.";

  if (phone === undefined) {
    return (
      <div className="mt-[18px]">
        <span className={labelClass}>휴대폰번호</span>
        <div className="h-[50px] animate-pulse rounded-[12px] bg-surface" />
      </div>
    );
  }

  if (phone && !editing) {
    return (
      <div className="mt-[18px]">
        <span className={labelClass}>휴대폰번호</span>
        <div className="flex h-[50px] items-center gap-2.5 rounded-[12px] border border-[#E1E1E1] bg-surface px-4">
          <span className="text-[15px] font-bold tracking-[0.02em]">{phone.masked}</span>
          <span className="rounded-md bg-white px-2 py-0.5 text-[12px] font-bold text-sub">
            {phone.source === "KAKAO" ? "카카오 계정 번호" : "입력한 번호"}
          </span>
          <button type="button" onClick={onEdit} className="ml-auto text-[13px] font-bold text-sub underline-offset-2 hover:underline">
            변경
          </button>
        </div>
        <p className="mt-1.5 text-[12.5px] text-faint">이 번호가 맞는지 확인해주세요. {help}</p>
      </div>
    );
  }

  const invalid = value.length >= 10 && !isValidPhone(value);
  return (
    <div className="mt-[18px]">
      <label htmlFor="phone" className={labelClass}>
        휴대폰번호
      </label>
      <div className="flex gap-2">
        <input
          id="phone"
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          value={formatPhoneInput(value)}
          onChange={(event) => onChange(event.target.value.replace(/\D/g, "").slice(0, 11))}
          placeholder="010-1234-5678"
          aria-invalid={invalid}
          aria-describedby="phone-help"
          className={inputClass + (invalid ? " border-soon focus:border-soon" : "")}
        />
        {phone ? (
          <button
            type="button"
            onClick={onCancel}
            className="h-[50px] shrink-0 rounded-[12px] border border-[#E1E1E1] px-4 text-[14px] font-bold text-sub"
          >
            취소
          </button>
        ) : null}
      </div>
      <p id="phone-help" className={"mt-1.5 text-[12.5px] " + (invalid ? "text-soon" : "text-faint")}>
        {invalid ? "010으로 시작하는 휴대폰번호를 입력해주세요" : help}
      </p>
    </div>
  );
}
