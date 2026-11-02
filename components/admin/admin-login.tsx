"use client";

import { useState } from "react";
import { ShieldCheck } from "lucide-react";

import { Container } from "@/components/layout/container";
import { useAdminLoginMutation } from "@/hooks/mutations/verification/useAdminLoginMutation";
import { apiErrorMessage } from "@/lib/api";

const inputClass =
  "h-[50px] w-full rounded-[12px] border border-[#E1E1E1] bg-white px-4 text-[15px] outline-none placeholder:text-faint focus:border-ink";

// 관리자 전용 로그인. 회원 로그인과는 별개의 아이디·비밀번호를 쓴다
export function AdminLogin() {
  const login = useAdminLoginMutation();
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const valid = id.trim() !== "" && password !== "";

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!valid || login.isPending) return;
    login.mutate({ id: id.trim(), password });
  }

  return (
    <Container className="flex justify-center py-16 md:py-28">
      <form onSubmit={submit} className="w-full max-w-[380px]">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-surface">
          <ShieldCheck size={22} strokeWidth={2} />
        </span>
        <h1 className="mt-6 text-center text-2xl font-extrabold tracking-[-0.04em]">관리자 로그인</h1>
        <p className="mt-2 text-center text-[15px] text-sub">관리자 전용 아이디와 비밀번호를 입력해주세요</p>

        <div className="mt-8 space-y-3">
          <input
            value={id}
            onChange={(event) => setId(event.target.value)}
            autoComplete="username"
            placeholder="아이디"
            aria-label="아이디"
            className={inputClass}
          />
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            placeholder="비밀번호"
            aria-label="비밀번호"
            className={inputClass}
          />
        </div>

        {login.isError && (
          <p role="alert" className="mt-3 text-[13.5px] font-semibold text-soon">
            {apiErrorMessage(login.error, "로그인하지 못했어요. 잠시 후 다시 시도해주세요")}
          </p>
        )}

        <button
          type="submit"
          disabled={!valid || login.isPending}
          className="mt-5 h-12 w-full rounded-full bg-ink text-[15px] font-bold text-white disabled:opacity-40"
        >
          {login.isPending ? "로그인 중…" : "로그인"}
        </button>
      </form>
    </Container>
  );
}
