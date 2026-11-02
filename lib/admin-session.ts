import { useSyncExternalStore } from "react";

// 관리자 로그인 토큰. 회원(Supabase) 로그인과 별개이고, 탭을 닫으면 사라지도록 sessionStorage에 둔다
const KEY = "rom-admin-token";
const listeners = new Set<() => void>();

function read() {
  try {
    return sessionStorage.getItem(KEY);
  } catch {
    return null;
  }
}

function emit() {
  listeners.forEach((listener) => listener());
}

export function getAdminToken() {
  return read();
}

export function setAdminToken(token: string) {
  try {
    sessionStorage.setItem(KEY, token);
  } catch {
    // 저장소를 못 쓰는 브라우저에서는 새로고침하면 다시 로그인해야 한다
  }
  emit();
}

export function clearAdminToken() {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    // 무시
  }
  emit();
}

// undefined는 아직 확인 중(서버 렌더), null은 로그아웃 상태
export function useAdminToken() {
  return useSyncExternalStore<string | null | undefined>(
    (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    read,
    () => undefined,
  );
}
