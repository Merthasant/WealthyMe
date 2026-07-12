import { authRefresh } from "@/lib/APIs/services/auth.service";
import type { ChildrenProps } from "@/lib/types/components.type";
import { useAuthStore } from "@/store/auth.store";
import { useEffect, useState } from "react";

export default function AuthChecker({ children }: ChildrenProps) {
  const [isChecking, setIsChecking] = useState<boolean>(true);
  const setAccessToken = useAuthStore((s) => s.setAccessToken);

  useEffect(() => {
    const init = async () => {
      try {
        const { data } = await authRefresh();
        const accessToken = data?.accessToken;
        if (accessToken) setAccessToken(accessToken);
      } catch (err) {
        console.error("auth checker error", err);
      }
    };

    init().finally(() => setIsChecking(false));
  }, [setAccessToken]);

  if (isChecking) return <h1>Loading...</h1>;

  return <>{children}</>;
}
