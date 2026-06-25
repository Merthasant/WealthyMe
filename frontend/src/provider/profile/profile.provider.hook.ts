import { useContext } from "react";
import { ProfileContext } from "./profile.provider.context";

export const useProfileContext = () => {
  const ctx = useContext(ProfileContext);
  if (!ctx)
    throw new Error("useProfileContext must be used within ProfileProvider");
  return ctx;
};
