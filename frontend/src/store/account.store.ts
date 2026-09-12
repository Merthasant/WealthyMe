import { create } from "zustand";

type AccountStore = {
  idAccountSelected: string | null;
  setIdAccountSelected: (id: string | null) => void;
  reset: () => void;
};

export const useAccountStore = create<AccountStore>((set) => ({
  idAccountSelected: null,
  setIdAccountSelected: (id) => set({ idAccountSelected: id }),
  reset: () => set({ idAccountSelected: null }),
}));
