import { useAuthStore } from "@/store/auth.store";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const accessToken = useAuthStore((state) => state.accessToken);

  if (!accessToken) return <Navigate to={"/sign-in"} replace />;

  return <Outlet />;
}
