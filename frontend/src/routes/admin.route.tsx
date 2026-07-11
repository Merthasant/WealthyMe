import { useAuthStore } from "@/store/auth.store";
import { Navigate, Outlet } from "react-router-dom";

export default function AdminRoute() {
  const role = useAuthStore((s) => s.role);

  if (role !== "admin") return <Navigate to="/access-dinied" replace />;

  return <Outlet />;
}
