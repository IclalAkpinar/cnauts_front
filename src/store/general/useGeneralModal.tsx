// import { create } from "zustand";
// import { UseGet } from "../../hooks";

// // Store tipi tanımlaması
// interface GeneralStoreState {
//   userId: string | null;
//   setUserId: (id: string) => void;
// }

// // Store'un tanımlanması
// export const useGeneralStore = create<GeneralStoreState>((set) => {
//   // authData'yı çekiyoruz ve userId'yi ayarlıyoruz
//   const { data: authData } = UseGet<{
//     check: boolean;
//     id: string;
//     email: string;
//     phone: string;
//   }>("/auth/check");

//   // authData yüklendiğinde userId'yi günceller
//   if (authData) {
//     set({ userId: authData.id });
//   }

//   return {
//     userId: null,
//     setUserId: (id: string) => set({ userId: id }),
//   };
// });


export interface useGeneralStoreModal {
  scrollToTop: () => void;
  setTheme: (newTheme: string) => void;
  theme: string;
  journalOpen: boolean;
  setJournalOpen: (e: boolean) => void;
  sideBarOpen: boolean;
  setSideBarOpen: (e: boolean) => void;
  choosenUnits: number[];
  setChoosenUnits: (newUnits: number[]) => void;
 }
 