import { useProfileStore } from "@/store/profile.store";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const haveProfile = useProfileStore((s) => s.haveProfile);

  if (haveProfile) return <Navigate to={"/dashboard"} replace />;

  return <Outlet />;
}
