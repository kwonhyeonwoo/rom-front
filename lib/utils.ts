import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 화면에 보여줄 내 이름. 카카오는 이메일 동의를 안 하면 이메일이 비어 있으므로 닉네임(user_metadata.name)을 먼저 본다
export function sessionUserName(
  user: { name: string | null } | undefined,
  sessionUser: { email?: string; user_metadata?: { name?: string; full_name?: string } },
) {
  return (
    user?.name ||
    sessionUser.user_metadata?.name ||
    sessionUser.user_metadata?.full_name ||
    sessionUser.email?.split("@")[0] ||
    "회원"
  );
}
