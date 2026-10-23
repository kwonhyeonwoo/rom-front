import { create } from "zustand";

// 세미나 저장(북마크) 상태. 로그인/서버 연동 전까지는 클라이언트에만 보관한다.
type BookmarkState = {
  ids: string[];
  toggle: (id: string) => void;
};

export const useBookmarkStore = create<BookmarkState>()((set) => ({
  ids: [],
  toggle: (id) =>
    set((state) => ({
      ids: state.ids.includes(id)
        ? state.ids.filter((saved) => saved !== id)
        : [...state.ids, id],
    })),
}));
