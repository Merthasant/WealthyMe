import { Button } from "@/components/ui/button";
import { authLogout } from "@/lib/APIs/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Navigate, Outlet } from "react-router-dom";

export default function DashboardLayout() {
  const logoutStore = useAuthStore((state) => state.logout);

  const queryClient = useQueryClient();
  const mutate = useMutation({
    mutationFn: () => authLogout(),
    onSuccess: () => {
      queryClient.clear();
      logoutStore();
      return <Navigate to={"/sign-in"} />;
    },
  });

  const logout = async () => {
    await mutate.mutateAsync();
  };

  return (
    <section className="bg-background w-full h-screen flex items-center justify-center">
      <Button onClick={logout}>Logout</Button>
      {/* <img
        src={profile?.avatarUrl || "/default-avatar.webp"}
        alt="User Avatar"
        width={50}
        height={50}
      /> */}
      <Outlet />
    </section>
  );
}
