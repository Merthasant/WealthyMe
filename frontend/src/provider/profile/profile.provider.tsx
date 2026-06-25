import { useState } from "react";
import { ProfileContext } from "./profile.provider.context";
import { useGetProfile } from "@/lib/queries/profile.query";
import type { Profile } from "@/lib/types/profile.type";
import { Outlet } from "react-router-dom";

export default function ProfileProvider() {
  const [profile, setProfile] = useState<Profile | undefined>(undefined);
  const { data, isLoading } = useGetProfile();
  const currentProfile = profile ?? data?.data;
  return (
    <ProfileContext.Provider
      value={{ profile: currentProfile, setProfile, isLoading }}
    >
      <Outlet /> {/* Karena ngebungkus routes */}
    </ProfileContext.Provider>
  );
}
