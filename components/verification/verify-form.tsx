"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, ImagePlus, ShieldCheck, Star, Users } from "lucide-react";

import { Container } from "@/components/layout/container";
import { CommunityLoginRequired, CommunitySkeleton } from "@/components/community/login-required";
import { useRequestVerificationMutation } from "@/hooks/mutations/verification/useRequestVerificationMutation";
import { useUserQuery } from "@/hooks/queries/user/useUserQuery";
import { useSession } from "@/hooks/useSession";
import { useVerifyAccess } from "@/hooks/useVerifyAccess";
import { apiErrorMessage } from "@/lib/api";
import {
  LICENSE_FIELDS,
  LICENSE_IMAGE_MAX_BYTES,
  LICENSE_IMAGE_TYPES,
  formatRequestedAt,
} from "@/lib/verification";
import { toast } from "@/stores/use-toast-store";
import { VerifyBanner } from "./verify-banner";

const inputClass =
  "h-[50px] w-full rounded-[12px] border border-[#E1E1E1] bg-white px-4 text-[15px] outline-none placeholder:text-faint focus:border-ink";
const labelClass = "mb-2 block text-[13.5px] font-bold";

const perks = [
  { icon: ShieldCheck, title: "인증된 동료만 쓰기", body: "면허 확인을 마친 물리치료사만 글과 댓글을 쓸 수 있어요" },
  { icon: Users, title: "익명이어도 믿을 수 있게", body: "익명으로 써도 '인증 PT'가 함께 보여요" },
  { icon: Star, title: "진짜 세미나 후기", body: "수강한 세미나에 연결된 후기를 남길 수 있어요" },
];

// 면허 인증 요청. 승인 전에도 세미나 검색과 커뮤니티 읽기는 그대로 쓸 수 있다
export function VerifyForm() {
  const session = useSession();
  const { access, verification } = useVerifyAccess();

  if (access === "LOADING") return <CommunitySkeleton />;
  if (access === "GUEST" || !session) return <CommunityLoginRequired />;
  if (access === "APPROVED") return <Done />;
  if (access === "PENDING") return <Waiting requestedAt={verification?.requestedAt ?? null} />;

  return (
    <Container className="pt-6 pb-16 md:pt-14">
      <div className="mx-auto flex max-w-[1060px] flex-col gap-10 lg:flex-row lg:items-start lg:gap-20">
        <div className="hidden flex-1 pt-6 lg:block">
          <span className="inline-flex h-7 items-center rounded-md bg-[#E6F2EF] px-2.5 text-[13px] font-bold text-brand">
            물리치료사 인증
          </span>
          <h1 className="mt-4 text-[38px] leading-[1.25] font-extrabold tracking-[-0.05em]">
            동료 물리치료사들과
            <br />
            편하게 이야기하세요
          </h1>
          <p className="mt-3 text-base text-sub">한 번만 인증하면 커뮤니티를 계속 이용할 수 있어요</p>
          <ul className="mt-6 space-y-5">
            {perks.map(({ icon: Icon, title, body }) => (
              <li key={title} className="flex items-start gap-3.5">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#E6F2EF] text-brand">
                  <Icon size={20} strokeWidth={2} />
                </span>
                <div>
                  <p className="text-base font-bold">{title}</p>
                  <p className="mt-0.5 text-sm text-sub">{body}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-9 rounded-2xl bg-surface px-5 py-[18px] text-[13px] leading-[1.65]">
            <b className="text-[13.5px]">개인정보는 이렇게 다뤄요</b>
            <p className="mt-1 text-sub">
              · 면허증 사진은 관리자 확인용으로만 쓰고, 검토가 끝나면 바로 삭제해요
              <br />· 면허번호는 암호화해 저장하고 다른 회원에게 보이지 않아요
              <br />· 커뮤니티에는 닉네임과 &apos;인증 PT&apos; 표시만 나와요
            </p>
          </div>
        </div>

        <div className="w-full lg:w-[500px] lg:shrink-0">
          <VerifyBanner verification={verification} />
          <RequestForm />
        </div>
      </div>
    </Container>
  );
}

function RequestForm() {
  const router = useRouter();
  const { data: user } = useUserQuery(true);
  const request = useRequestVerificationMutation();

  const [name, setName] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [year, setYear] = useState("");
  const [field, setField] = useState<string>(LICENSE_FIELDS[0]);
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const previewRef = useRef<string | null>(null);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeRules, setAgreeRules] = useState(false);

  const thisYear = new Date().getFullYear();
  const years = Array.from({ length: thisYear - 1969 }, (_, index) => thisYear - index);
  const shownName = name || user?.name || "";
  const valid =
    shownName.trim().length >= 2 &&
    /^\d{3,10}$/.test(licenseNumber) &&
    year !== "" &&
    photo !== null &&
    agreePrivacy &&
    agreeRules;

  // 미리보기 주소는 화면을 떠날 때 거둔다 (사진을 바꿀 때는 pick에서 거둔다)
  useEffect(
    () => () => {
      if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    },
    [],
  );

  function pick(file: File | undefined) {
    if (!file) return;
    if (!(LICENSE_IMAGE_TYPES as readonly string[]).includes(file.type)) {
      return toast("JPG, PNG, WEBP 사진만 올릴 수 있어요");
    }
    if (file.size > LICENSE_IMAGE_MAX_BYTES) {
      return toast("사진은 5MB 이하로 올려주세요");
    }
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    previewRef.current = URL.createObjectURL(file);
    setPreview(previewRef.current);
    setPhoto(file);
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!valid || !photo || request.isPending) return;
    request.mutate(
      { name: shownName.trim(), licenseNumber, acquiredYear: Number(year), field, photo },
      {
        onSuccess: () => {
          toast("면허 인증을 요청했어요. 결과는 알려드릴게요");
          router.replace("/community");
        },
        onError: (error) =>
          toast(
            error instanceof Error && !("status" in error)
              ? error.message
              : apiErrorMessage(error, "요청하지 못했어요. 잠시 후 다시 시도해주세요"),
          ),
      },
    );
  }

  return (
    <form onSubmit={submit} className="rounded-[24px] border border-[#EFEFEF] p-6 shadow-[0_8px_30px_rgba(0,0,0,.05)] md:p-9">
      <h2 className="text-[22px] font-extrabold tracking-[-0.04em]">면허 인증</h2>

      <div className="mt-6">
        <label htmlFor="name" className={labelClass}>
          이름 (면허증에 적힌 이름)
        </label>
        <input
          id="name"
          value={shownName}
          onChange={(event) => setName(event.target.value)}
          maxLength={20}
          autoComplete="name"
          className={inputClass}
        />
      </div>

      <div className="mt-[18px]">
        <label htmlFor="license" className={labelClass}>
          물리치료사 면허번호
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-[15px] text-sub">제</span>
          <input
            id="license"
            inputMode="numeric"
            value={licenseNumber}
            onChange={(event) => setLicenseNumber(event.target.value.replace(/\D/g, "").slice(0, 10))}
            placeholder="12345"
            className={inputClass + " px-9"}
          />
          <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-[15px] text-sub">호</span>
        </div>
      </div>

      <div className="mt-[18px] flex gap-2.5">
        <div className="flex-1">
          <label htmlFor="year" className={labelClass}>
            면허 취득연도
          </label>
          <select id="year" value={year} onChange={(event) => setYear(event.target.value)} className={inputClass}>
            <option value="">선택</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label htmlFor="field" className={labelClass}>
            주 분야
          </label>
          <select id="field" value={field} onChange={(event) => setField(event.target.value)} className={inputClass}>
            {LICENSE_FIELDS.map((f) => (
              <option key={f}>{f}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-[18px]">
        <span className={labelClass}>면허증 사진</span>
        <label className="flex cursor-pointer items-center gap-4 rounded-[14px] border border-dashed border-[#CFCFCF] p-4 hover:border-ink">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="올린 면허증 사진" className="size-16 shrink-0 rounded-lg object-cover" />
          ) : (
            <span className="flex size-16 shrink-0 items-center justify-center rounded-lg bg-surface text-sub">
              <ImagePlus size={22} />
            </span>
          )}
          <span className="min-w-0 text-[13.5px] leading-[1.55] text-sub">
            <b className="block truncate text-[14.5px] text-ink">{photo ? photo.name : "사진을 선택해주세요"}</b>
            주민등록번호는 가린 뒤 올려주세요. 검토가 끝나면 사진은 바로 삭제돼요.
          </span>
          <input
            type="file"
            accept={LICENSE_IMAGE_TYPES.join(",")}
            className="sr-only"
            onChange={(event) => pick(event.target.files?.[0])}
          />
        </label>
      </div>

      <div className="mt-5 space-y-2.5 rounded-[14px] bg-[#F7F7F5] p-4">
        <Consent checked={agreePrivacy} onChange={setAgreePrivacy}>
          <b>[필수]</b> 면허 확인을 위한 개인정보 수집·이용 동의
        </Consent>
        <Consent checked={agreeRules} onChange={setAgreeRules}>
          <b>[필수]</b> 커뮤니티 이용 규칙 동의
        </Consent>
      </div>

      <button
        type="submit"
        disabled={!valid || request.isPending}
        className="mt-5 flex h-[52px] w-full items-center justify-center rounded-full bg-ink text-base font-bold text-white disabled:bg-[#CFCFCF]"
      >
        {request.isPending ? "요청하는 중" : "인증 요청하기"}
      </button>
      <p className="mt-3 text-center text-[13px] text-faint">보통 영업일 1일 안에 결과를 알려드려요</p>
    </form>
  );
}

function Consent({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-[13.5px]">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="sr-only peer" />
      <span className="flex size-5 shrink-0 items-center justify-center rounded-md border-[1.5px] border-[#CFCFCF] bg-white text-white peer-checked:border-ink peer-checked:bg-ink peer-focus-visible:ring-2 peer-focus-visible:ring-ink/30">
        <Check size={13} strokeWidth={3} />
      </span>
      <span>{children}</span>
    </label>
  );
}

function Waiting({ requestedAt }: { requestedAt: string | null }) {
  return (
    <Notice
      title="면허 심사 중이에요"
      body={`보통 영업일 1일 안에 알려드려요. 승인되면 글과 댓글을 쓸 수 있어요.${
        requestedAt ? ` (요청 ${formatRequestedAt(requestedAt)})` : ""
      }`}
    />
  );
}

function Done() {
  return <Notice title="면허 인증을 마쳤어요" body="이제 커뮤니티에서 글, 댓글, 후기를 쓸 수 있어요." />;
}

function Notice({ title, body }: { title: string; body: string }) {
  return (
    <Container className="flex justify-center py-20 md:py-28">
      <div className="w-full max-w-[380px] text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#E6F2EF] text-brand">
          <ShieldCheck size={24} strokeWidth={2} />
        </span>
        <h1 className="mt-6 text-2xl font-extrabold tracking-[-0.04em]">{title}</h1>
        <p className="mt-2 text-[15px] leading-[1.55] text-sub">{body}</p>
        <Link
          href="/community"
          className="mt-8 flex h-12 items-center justify-center rounded-full bg-ink text-[15px] font-bold text-white"
        >
          커뮤니티로 가기
        </Link>
      </div>
    </Container>
  );
}
