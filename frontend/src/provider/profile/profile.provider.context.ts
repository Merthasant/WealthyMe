import type { Profile } from "@/lib/types/profile.type";
import { createContext } from "react";

type ProfileContextValue =
  | {
      profile: Profile | undefined | null;
      setProfile: (profile: Profile | undefined) => void;
      isLoading: boolean;
    }
  | undefined;

export const ProfileContext = createContext<ProfileContextValue>(undefined);
