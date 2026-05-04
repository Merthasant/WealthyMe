import { Outlet } from "react-router-dom";

interface ProtectedRouteProps {
  adminOnly?: boolean;
}

export default function ProtectedRoute({ adminOnly }: ProtectedRouteProps) {
  if (adminOnly) {
    alert("Admin access only!");
  }
  return <Outlet />;
}
