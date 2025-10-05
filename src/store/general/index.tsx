import { create } from "zustand";
import { useGeneralStoreModal } from "./useGeneralModal";

export const UseGeneral = create<useGeneralStoreModal>()((set) => ({
  theme: localStorage.getItem("theme") || "light",
  setTheme: (newTheme: string) => {
    localStorage.setItem("theme", newTheme);
    set({ theme: newTheme });
  },
  scrollToTop: () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  },
  journalOpen: false,
  setJournalOpen: (e: boolean) => {
    set({ journalOpen: e });
  },
  sideBarOpen: false,
  setSideBarOpen: (e: boolean) => {
    set({ sideBarOpen: e });
  },
  choosenUnits: [],
  setChoosenUnits: (newUnits: number[]) => {
    set({ choosenUnits: newUnits });
  },
}));
