import type { AuthMe } from "@/lib/types/auth.type";
import { createContext } from "react";

type AuthContextValue =
  | {
      user: AuthMe | undefined;
      setUser: (user: AuthMe | undefined) => void;
      isLoading: boolean;
    }
  | undefined;

export const AuthContext = createContext<AuthContextValue>(undefined);
