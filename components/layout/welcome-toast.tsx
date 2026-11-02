"use client";

import { useEffect } from "react";

import { WELCOME_COOKIE } from "@/lib/welcome";
import { toast } from "@/stores/use-toast-store";

// 새로 가입한 직후(탈퇴 후 같은 계정으로 다시 들어온 경우 포함) 한 번만 환영 안내를 띄운다
export function WelcomeToast() {
  useEffect(() => {
    if (!document.cookie.split("; ").includes(`${WELCOME_COOKIE}=1`)) return;
    document.cookie = `${WELCOME_COOKIE}=; path=/; max-age=0`;
    toast("롬에 오신 걸 환영해요! 새 계정으로 가입됐어요", { label: "마이페이지", href: "/mypage" });
  }, []);

  return null;
}
