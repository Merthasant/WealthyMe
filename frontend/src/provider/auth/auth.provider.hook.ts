import { useContext } from "react";
import { AuthContext } from "./auth.provider.context";

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("gak tau nulis apa");
  return ctx;
};
