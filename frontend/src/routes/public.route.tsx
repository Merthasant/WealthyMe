import { useAuthStore } from "@/store/auth.store";
import { Navigate, Outlet } from "react-router-dom";

export default function PublicRoute() {
  const accessToken = useAuthStore((state) => state.accessToken);

  if (accessToken) return <Navigate to={"/dashboard"} replace />;

  return <Outlet />;
}
