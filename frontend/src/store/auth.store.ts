import type { Role } from "@/lib/types/auth.type";
import { jwtDecode } from "jwt-decode";
import { create } from "zustand";

type DecodedTekon = {
  id: string;
  role: Role;
};

type AuthStore = {
  accessToken: string | null;
  role: Role | null;
  id: string | null;
  setAccessToken: (token: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  accessToken: null,
  role: null,
  id: null,
  setAccessToken: (token) => {
    if (token) {
      const { id, role } = jwtDecode<DecodedTekon>(token);
      set({ accessToken: token, id, role });
    } else {
      set({ accessToken: null, role: null, id: null });
    }
  },
  logout: () => set({ accessToken: null, role: null, id: null }),
}));
