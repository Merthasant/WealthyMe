import { getProfile } from "@/lib/APIs/services/profile.service";
import type { ChildrenProps } from "@/lib/types/components.type";
import { useAuthStore } from "@/store/auth.store";
import { useProfileStore } from "@/store/profile.store";
import { useEffect, useState } from "react";

export default function ProfileChecker({ children }: ChildrenProps) {
  const [isChecking, setIsChecking] = useState<boolean>(true);
  const accessToken = useAuthStore((s) => s.accessToken);
  const setHaveProfile = useProfileStore((s) => s.setHaveProfile);

  useEffect(() => {
    const init = async () => {
      try {
        const { data } = await getProfile();
        if (data) setHaveProfile(true);
      } catch (err) {
        console.error("profile checker error", err);
      }
    };

    if (accessToken) {
      init().finally(() => setIsChecking(false));
    }
  }, [setHaveProfile, accessToken]);

  if (isChecking) return <h1>Loading...</h1>;

  return <>{children}</>;
}
