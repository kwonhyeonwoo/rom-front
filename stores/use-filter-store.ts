import { create } from "zustand";

// 세미나 검색 필터 상태 (예시 스토어)
type FilterState = {
  keyword: string;
  region: string | null;
  weekendOnly: boolean;
  setKeyword: (keyword: string) => void;
  setRegion: (region: string | null) => void;
  toggleWeekendOnly: () => void;
  reset: () => void;
};

const initialState = {
  keyword: "",
  region: null,
  weekendOnly: false,
};

export const useFilterStore = create<FilterState>()((set) => ({
  ...initialState,
  setKeyword: (keyword) => set({ keyword }),
  setRegion: (region) => set({ region }),
  toggleWeekendOnly: () => set((state) => ({ weekendOnly: !state.weekendOnly })),
  reset: () => set(initialState),
}));
