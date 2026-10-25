import { create } from "zustand";

export type Toast = {
  id: number;
  message: string;
  // 토스트 오른쪽 링크 버튼 (예: 로그인하러 가기)
  action?: { label: string; href: string };
};

type ToastState = {
  toasts: Toast[];
  show: (toast: Omit<Toast, "id">) => void;
  dismiss: (id: number) => void;
};

const DURATION = 2800;
let nextId = 1;

export const useToastStore = create<ToastState>()((set, get) => ({
  toasts: [],
  show: (toast) => {
    const id = nextId++;
    // 연달아 눌러도 화면에는 가장 최근 것 하나만 남긴다
    set({ toasts: [{ ...toast, id }] });
    setTimeout(() => get().dismiss(id), DURATION);
  },
  dismiss: (id) => set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) })),
}));

export const toast = (message: string, action?: Toast["action"]) => useToastStore.getState().show({ message, action });
