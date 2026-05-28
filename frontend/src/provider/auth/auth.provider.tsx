import type { ChildrenProps } from "@/components/organisms/auth/auth.organism.type";
import { useAuthMe } from "@/lib/queries/auth.query";
import { AuthContext } from "./auth.provider.context";
import { useState } from "react";
import type { AuthMe } from "@/lib/types/auth.type";

export default function AuthProvider({ children }: ChildrenProps) {
  const [user, setUser] = useState<AuthMe | undefined>(undefined);
  const { data, isLoading } = useAuthMe();
  console.log("in auth provider", { data, isLoading });
  const currentUser = user ?? data?.data;

  return (
    <AuthContext.Provider value={{ user: currentUser, setUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
