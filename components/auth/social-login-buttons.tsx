"use client";

import { useState } from "react";
import type { Provider } from "@supabase/supabase-js";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const button =
  "flex h-[54px] w-full items-center justify-center gap-2.5 rounded-xl text-[15.5px] font-bold disabled:opacity-60";

export function SocialLoginButtons({
  action,
}: {
  action: "로그인" | "시작하기";
}) {
  const router = useRouter();
  const [pending, setPending] = useState<Provider | null>(null);
  const [error, setError] = useState(false);

  const signIn = async (provider: Provider) => {
    setPending(provider);
    setError(false);
    const { error } = await getSupabaseBrowserClient().auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    router.push("/");
    // 성공하면 카카오·구글 화면으로 이동하므로 실패했을 때만 상태를 되돌린다
    if (error) {
      setPending(null);
      setError(true);
      console.log("error", error);
    }
  };

  return (
    <div className="flex flex-col gap-2.5">
      <button
        type="button"
        disabled={pending !== null}
        onClick={() => signIn("kakao")}
        className={cn(button, "bg-[#FEE500] text-[#191919]")}
      >
        <KakaoIcon />
        카카오로 {action}
      </button>
      <button
        type="button"
        disabled={pending !== null}
        onClick={() => signIn("google")}
        className={cn(button, "border border-[#DEDEDE] bg-white text-ink")}
      >
        <GoogleIcon />
        Google로 {action}
      </button>
      {error && (
        <p className="text-[13px] text-soon">
          로그인을 시작하지 못했어요. 잠시 후 다시 시도해주세요.
        </p>
      )}
    </div>
  );
}

function KakaoIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#191919"
        d="M12 3C6.48 3 2 6.58 2 11c0 2.85 1.86 5.35 4.67 6.77-.2.74-.74 2.7-.85 3.12-.13.52.19.51.4.37.17-.11 2.66-1.81 3.74-2.54.66.1 1.34.15 2.04.15 5.52 0 10-3.58 10-8S17.52 3 12 3z"
      />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"
      />
    </svg>
  );
}
