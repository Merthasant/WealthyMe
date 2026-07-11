import { create } from "zustand";

type ProfileStore = {
  haveProfile: boolean;
  setHaveProfile: (haveProfile: boolean) => void;
  resetProfile: () => void;
};

export const useProfileStore = create<ProfileStore>((set) => ({
  haveProfile: false,
  setHaveProfile: (haveProfile) => set({ haveProfile }),
  resetProfile: () => set({ haveProfile: false }),
}));
